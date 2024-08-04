import { mutation, query } from './_generated/server';
import { v } from 'convex/values';
import { ActionCtx, DatabaseReader, internalMutation, internalQuery } from './_generated/server';
import { Doc, Id } from './_generated/dataModel';
import { internal } from './_generated/api';
import { LLMMessage, chatCompletion, fetchEmbedding } from './util/llm';
import { asyncMap } from './util/asyncMap';
import { GameId, agentId, conversationId, playerId, worldId } from './ids';
import { semanticMemoryFields, episodicMemoryFields } from './schema';
import { TableNames } from './_generated/dataModel'; 
import { ChatCompletionParams } from './util/llm';


export type Memory = Doc<'episodicMemories'>;
export type MemoryType = Memory['data']['type'];
export type MemoryOfType<T extends MemoryType> = Omit<Memory, 'data'> & {
  data: Extract<Memory['data'], { type: T }>;
};
const MEMORY_OVERFETCH = 10;
export const MEMORY_ACCESS_THROTTLE = 300_000;
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
    worldId: v.string(), 
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
    worldId: v.string(),
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
  const conversationData = await ctx.runQuery(selfInternal.loadConversation, {
    worldId: worldId,
    conversationId
  });
  const { player, otherPlayer, startedAt, endedAt } = conversationData;
  if (!player) {
    throw new Error(`Player not found for conversation ${conversationId}`);
  }
  if (!otherPlayer) {
    throw new Error(`Other player not found for conversation ${conversationId}`);
  }
  const messages = await ctx.runQuery(selfInternal.loadMessages, { worldId: worldId, conversationId });
  if (!messages.length) {
    return;
  }
  
  const personalityList = {
    introversion: player.basePersonalityInfo.introversion,
    openness: player.basePersonalityInfo.openness,
    conscientiousness: player.basePersonalityInfo.conscientiousness,
    neuroticism: player.basePersonalityInfo.neuroticism,
    agreeableness: player.basePersonalityInfo.agreeableness,
  }


  const llmMessages: LLMMessage[] = [
    {
      role: 'user',
      content: `You are ${player.playerName}, and you just finished a conversation with ${otherPlayer.playerName}. I would
      like you to summarize the conversation from ${player.playerName}'s perspective, using first-person pronouns like
      "I," and add if you liked or disliked this interaction.`,
    },
    {
      role: 'user',
      content: `On a scale of 0 to 20, rate the likely importance of this conversation. Consider the following four factors, scoring each between 0 and 5. Your final score will be the sum of these scores:
      Emotional Impact (0-5):
      How emotionally charged was the conversation? Consider both positive and negative emotions. Did it evoke strong feelings or reactions? Remember, emotionally arousing conversations are more likely to be memorable and perceived as important.
      Personal Relevance (0-5):
      How closely did the conversation relate to your interests, goals, or personal life? Recall that your personality is ${personalityList}, your interests are ${player.basePersonalityInfo.interests}, and your values are ${player.basePersonalityInfo.values}. Conversations directly relevant to these aspects are typically considered more important.
      Information Significance (0-5):
      How new, valuable, or critical was the information shared in this conversation? Consider whether it provided insights beyond routine or trivial matters. Remember that you describe yourself as ${player.baseKnowledgeInfo.selfDescription} and are interested in ${player.basePersonalityInfo.interests}. Rate higher if the conversation offered substantial new knowledge in these or other important areas.
      Social Context (0-5):
      Consider the identity and status of ${otherPlayer.playerName}, who is ${otherPlayer.baseKnowledgeInfo.selfDescription} with interests in ${otherPlayer.basePersonalityInfo.interests}. How influential or important is this person to you? Rate higher for conversations with authority figures, respected peers, or loved ones, as these tend to carry more weight.
      Final Importance Score: Sum of the scores from the four factors (maximum 20).`,
    },
  ];

  const authors = new Set<GameId<'players'>>();
  for (const message of messages) {
    const author = message.author === player.playerId ? player : otherPlayer;
    authors.add(author.playerId as GameId<'players'>); 
    const recipient = message.author === player.playerId ? otherPlayer : player;
    llmMessages.push({
      role: 'user',
      content: `${author.playerName} to ${recipient.playerName}: ${message.text}`,
    });
  }

  llmMessages.push({
    role: 'user',
    content: `please rememeber the instruction and return the results into format: 
    {
    "summary": "<summary of the conversation>",
    "importance": <importance score>
  }
    `,
  });

  const response = await chatCompletion({
    model: "gpt-4",
    messages: llmMessages,
    max_tokens: 1000,
  });

  const content = response.choices[0].message.content;
  console.log('content:', content);
  const {summary, importance} = processResponse(content);
  console.log('importance:', importance);
  const description = `Conversation with ${otherPlayer.playerName} at ${startedAt}: ${summary}`;
  const { embedding } = await fetchEmbedding(description);
  authors.delete(player.playerId as unknown as GameId<'players'>);
  await ctx.runMutation(selfInternal.insertMemory, {
    playerId: player.playerId,
    worldId: worldId,
    description: description,
    importance: importance,
    lastAccess: messages[messages.length - 1]._creationTime,
    data: {
      type: 'conversation',
      conversationId,
      playerIds: [...authors],
    }, 
    embedding,
  });
  return description;
}

export const loadConversation = internalQuery({
  args: {
    worldId: v.string(),
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
    worldId: v.string(),
    conversationId: v.string(),
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

const { embeddingId: _embeddingId, ...memoryFieldsWithoutEmbeddingId } = episodicMemoryFields;

export const insertMemory = internalMutation({
  args: {
    embedding: v.array(v.float64()),
    ...memoryFieldsWithoutEmbeddingId,
  },
  handler: async (ctx, { embedding, ...memory }): Promise<void> => {
    const embeddingId = await ctx.db.insert('memoryEmbeddings', {
      playerId: memory.playerId,
      embedding,
    });
    await ctx.db.insert('episodicMemories', {
      ...memory,
      embeddingId,
    });
  },
});


export async function searchMemories(
  ctx: ActionCtx,
  playerId: GameId<'players'>,
  searchEmbedding: number[],
  n: number = 3,
) {
  const candidates = await ctx.vectorSearch('memoryEmbeddings', 'embedding', {
    vector: searchEmbedding,
    filter: (q) => q.eq('playerId', playerId),
    limit: n * MEMORY_OVERFETCH,
  });
  const rankedMemories = await ctx.runMutation(selfInternal.rankAndTouchMemories, {
    candidates,
    n,
  });
  return rankedMemories.map(({ memory }) => memory);
}

function makeRange(values: number[]) {
  const min = Math.min(...values);
  const max = Math.max(...values);
  return [min, max] as const;
}

function normalize(value: number, range: readonly [number, number]) {
  const [min, max] = range;
  return (value - min) / (max - min);
}

export const rankAndTouchMemories = internalMutation({
  args: {
    candidates: v.array(v.object({ _id: v.id('memoryEmbeddings'), _score: v.number() })),
    n: v.number(),
  },
  handler: async (ctx, args) => {
    const ts = Date.now();
    const relatedMemories = await asyncMap(args.candidates, async ({ _id }) => {
      const memory = await ctx.db
        .query('episodicMemories')
        .withIndex('embeddingId', (q) => q.eq('embeddingId', _id))
        .first();
      if (!memory) throw new Error(`Memory for embedding ${_id} not found`);
      return memory;
    });

    // TODO: fetch <count> recent memories and <count> important memories
    // so we don't miss them in case they were a little less relevant.
    const recencyScore = relatedMemories.map((memory) => {
      const hoursSinceAccess = (ts - memory.lastAccess) / 1000 / 60 / 60;
      return 0.99 ** Math.floor(hoursSinceAccess);
    });
    const relevanceRange = makeRange(args.candidates.map((c) => c._score));
    const importanceRange = makeRange(relatedMemories.map((m) => m.importance));
    const recencyRange = makeRange(recencyScore);
    const memoryScores = relatedMemories.map((memory, idx) => ({
      memory,
      overallScore:
        normalize(args.candidates[idx]._score, relevanceRange) +
        normalize(memory.importance, importanceRange) +
        normalize(recencyScore[idx], recencyRange),
    }));
    memoryScores.sort((a, b) => b.overallScore - a.overallScore);
    const accessed = memoryScores.slice(0, args.n);
    await asyncMap(accessed, async ({ memory }) => {
      if (memory.lastAccess < ts - MEMORY_ACCESS_THROTTLE) {
        await ctx.db.patch(memory._id, { lastAccess: ts });
      }
    });
    return accessed;
  },
});

interface Result {
  summary: string;
  importance: number;
}

function processResponse(response: string): Result {
  try {
    const results: Result = JSON.parse(response);
    return results;
  } catch (error) {
    console.error('Error parsing response:', error);
    return {summary: '', importance: 0};
  }
}