import { mutation, query } from './_generated/server';
import { v } from 'convex/values';
import { ActionCtx, DatabaseReader, internalMutation, internalQuery } from './_generated/server';
import { Doc, Id } from './_generated/dataModel';
import { internal } from './_generated/api';
import { LLMMessage, chatCompletion, fetchEmbedding } from './util/llm';
import { asyncMap } from './util/asyncMap';
import { GameId, agentId, conversationId, playerId } from './ids';
import { semanticMemoryFields, episodicMemoryFields, proceduralMemoryFields, textualWorkingMemoryFields, visualWorkingMemoryFields } from './Memory/schema';
import { TableNames } from './_generated/dataModel'; 
import { ChatCompletionParams } from './util/llm';

const selfInternal = internal.agentConversationHelper;

export const getConversationId = query({
  args: {}, 
  handler: async (ctx, args) => {
    const conversations = await ctx.db.query('conversations').collect();
    const conversationCount = conversations.length;
    const conversationId = "c:" + conversationCount.toString();
    return {
      conversationId: conversationId
    }
  }
});

export const createConversation = mutation({
  args: {
    worldId: v.id('worlds'), 
    playerId: v.string(), 
    otherPlayerId: v.string(), 
    messageId: v.string(), 
    conversationId: v.string()
  },
  handler: async (ctx, args: { worldId: Id<'worlds'>, playerId: string, otherPlayerId: string, messageId: string, conversationId: string }) => {
    await ctx.db.insert('conversations', {
      conversationId: args.conversationId,
      createdAt: Date.now().toString(),
      worldId: args.worldId, 
      playerId: args.playerId,
      otherPlayerId: args.otherPlayerId, 
      lastMessageId: args.messageId
    });
    return {
      conversationId: args.conversationId
    }
  }
});

export const createMessage = mutation({
  args: {
    worldId: v.id('worlds'),
    conversationId: v.string(),
    author: v.string(),
    text: v.string()
  },
  handler: async (ctx, args: { worldId: Id<'worlds'>, conversationId: string, author: string, text: string }) => {
    const messageCollection = await ctx.db.query('messages')
      .withIndex('conversationId', (q) => q.eq('worldId', args.worldId).eq('conversationId', args.conversationId))
      .collect();
    const messageCount = messageCollection.length;
    const messageId = args.conversationId + "m:" + messageCount.toString();
    await ctx.db.insert('messages', {
      conversationId: args.conversationId,
      author: args.author,
      messageUuid: messageId,
      text: args.text,
      worldId: args.worldId
    });
    return {
      messageId: messageId
    }
  }
});



export async function rememberConversation(
  ctx: ActionCtx,
  worldId: Id<'worlds'>,
  playerId: GameId<'players'>,
  conversationId: GameId<'conversations'>,
) {
  const data = await ctx.runQuery(selfInternal.loadConversation, {
    worldId: playerId,
    conversationId
  });
  const { player, otherPlayer, startedAt, endedAt } = data;
  const messages = await ctx.runQuery(selfInternal.loadMessages, { conversationId });
  if (!messages.length) {
    return;
  }

  const llmMessages: LLMMessage[] = [
    {
      role: 'user',
      content: `You are ${player.playerName}, and you just finished a conversation with ${otherPlayer.playerName}. I would
      like you to summarize the conversation from ${player.playerName}'s perspective, using first-person pronouns like
      "I," and add if you liked or disliked this interaction.`,
    },
  ];

  const authors = new Set<GameId<'players'>>();
  for (const message of messages) {
    const author = message.author === player.playerId ? player : otherPlayer;
    authors.add(author as GameId<'players'>);
    const recipient = message.author === player.playerId ? otherPlayer : player;
    llmMessages.push({
      role: 'user',
      content: `${author.playerName} to ${recipient.playerName}: ${message.text}`,
    });
  }
  llmMessages.push({ role: 'user', content: 'Summary:' });
  const { content } = await chatCompletion({
    model: "gpt-4",
    messages: llmMessages,
    max_tokens: 500,
  });
  const description = `Conversation with ${otherPlayer.playerName} at ${startedAt}: ${content}`;
  const importance = await calculateImportance(description);
  const { embedding } = await fetchEmbedding(description);
  authors.delete(player as GameId<'players'>);
  await ctx.runMutation(selfInternal.insertMemory, {
    agentId,
    playerId: player.id,
    description,
    importance,
    lastAccess: messages[messages.length - 1]._creationTime,
    data: {
      type: 'conversation',
      conversationId,
      playerIds: [...authors],
    },
    embedding,
  });
  await reflectOnMemories(ctx,playerId);
  return description;
}

export const loadConversation = internalQuery({
  args: {
    worldId: v.id('worlds'),
    conversationId: v.string()
  },
  handler: async (ctx, args) => {
    const conversation = await ctx.db
      .query('conversations')
      .withIndex('conversationId', (q) => q.eq('worldId', args.worldId).eq('conversationId', args.conversationId))
      .first();
    if (!conversation) {
      throw new Error(`Conversation ${args.conversationId} not found`);
    }

    const PlayerId = conversation.playerId;
    const otherPlayerId = conversation.otherPlayerId;
    const startedAt = conversation.createdAt;
    const endedAt = conversation.endedAt? conversation.endedAt : Date.now().toString();
    const player = await ctx.db.query('agents').withIndex('playerId', (q) => q.eq('worldId', args.worldId).eq('playerId', PlayerId)).first();
    const otherPlayer = await ctx.db.query('agents').withIndex('playerId', (q) => q.eq('worldId', args.worldId).eq('playerId', otherPlayerId)).first();

    return {
      player,
      otherPlayer,
      startedAt,
      endedAt
    };
  },
});

export const loadMessages = internalQuery({
  args: {
    worldId: v.id('worlds'),
    conversationId,
  },
  handler: async (ctx, args): Promise<Doc<'messages'>[]> => {
    const messages = await ctx.db
      .query('messages')
      .withIndex('conversationId', (q) =>
        q.eq('worldId', args.worldId).eq('conversationId', args.conversationId),
      )
      .collect();
    return messages;
  },
});