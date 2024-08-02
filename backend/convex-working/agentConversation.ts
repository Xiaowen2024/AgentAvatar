import type { Id } from './convex/_generated/dataModel';
import { ActionCtx, internalQuery, action, mutation, query } from './convex/_generated/server';
import { LLMMessage, chatCompletion } from './util/llm';
import { api, internal } from './convex/_generated/api';
import { GameId, conversationId, playerId } from './ids';
import { NUM_MEMORIES_TO_SEARCH } from './constants';
import * as memory from './AgentMemory/memoryHelper';
import * as embeddingsCache from './AgentMemory/embeddingsCache';
import * as agentConversation from './agentConversation';
import { v } from 'convex/values';
import { Agent } from './AgentMemory/agent';

const selfInternal = internal.agentConversation;
const messageValidator = v.object({
  conversationId: v.id('conversations'),
  author: v.id('players'),
  messageUuid: v.string(),
  text: v.string(),
  worldId: v.id('worlds')
});


export const startConversationMessageAction = action({
  args: {
    playerId: v.string(),
    otherPlayerId: v.string(),
    worldId: v.string()
  },
  handler: async (ctx: ActionCtx, args: { playerId: string, otherPlayerId: string, worldId: Id<'worlds'> }) => {
    const { player, otherPlayer, playerDescription, otherPlayerDescription } = await ctx.runQuery(
      selfInternal.queryPromptData,
      {
        playerId: args.playerId, 
        otherPlayerId: args.otherPlayerId, 
        worldId: args.worldId as Id<'worlds'> // Explicitly cast worldId
      },
    );
    // const embedding = await embeddingsCache.fetch(
    //   ctx,
    //   `${player.playerId} is talking to ${otherPlayer.playerId}`,
    // );

    // const memories = await memory.searchMemories(
    //   ctx,
    //   player.playerId as unknown as GameId<'players'>,
    //   embedding,
    //   Number(process.env.NUM_MEMORIES_TO_SEARCH) || NUM_MEMORIES_TO_SEARCH,
    // );

    // const memoryWithOtherPlayer = memories.find(
    //   (m : any) => m.data.type === 'conversation' && m.data.playerIds.includes(args.otherPlayerId),
    // );
    const prompt = [
      `You are ${player.playerName}, and you just started a conversation with ${otherPlayer.playerName}.`,
    ];
    prompt.push(`About you:`);
    prompt.push(playerDescription);
    prompt.push(`About ${otherPlayer.playerName}: `);
    prompt.push(otherPlayerDescription);
    // prompt.push(...previousConversationPrompt(otherPlaye.playerName, lastConversation));
    // prompt.push(...relatedMemoriesPrompt(memories));
    // if (memoryWithOtherPlayer) {
    //   prompt.push(
    //     `Be sure to include some detail or question about a previous conversation in your greeting.`,
    //   );
    // }
    // prompt.push(`${player.playerName}:`);

    prompt.push(`Now please start a converaation with ${otherPlayer.playerName}.`);

    console.log(prompt);

    const params = {
      model: "gpt-4",
      messages: [
        { role: 'user' as const, content: prompt.join('\n') }
      ],
      max_tokens: 1000
    };

    const response = await chatCompletion(params);
    const content = response.choices[0].message.content; // Extract the message content
    
   

    const getConversationIdResult: { conversationId: string } = await ctx.runQuery(api.agentConversationHelper.getConversationId);
    const conversationId = getConversationIdResult.conversationId;

    const createMessageresult = await ctx.runMutation(api.agentConversationHelper.createMessage, {
      worldId: args.worldId,
      conversationId: conversationId,
      author: args.playerId,
      text: content
    });
    const messageId: string = createMessageresult.messageId;

    const createConversationResult = await ctx.runMutation(api.agentConversationHelper.createConversation, {
      worldId: args.worldId,
      playerId: args.playerId,
      otherPlayerId: args.otherPlayerId,
      messageId: messageId, 
      conversationId: conversationId
    });

    return {
      conversationId: conversationId,
      messageId: messageId,
      content: content
    }
  }
});


function previousConversationPrompt(
  otherPlayer: { name: string },
  conversation: { created: number } | null,
): string[] {
  const prompt: string[] = [];
  if (conversation) {
    const prev = new Date(conversation.created);
    const now = new Date();
    prompt.push(
      `Last time you chatted with ${
        otherPlayer.name
      } it was ${prev.toLocaleString()}. It's now ${now.toLocaleString()}.`,
    );
  }
  return prompt;
}

export const continueConversationMessageAction = action({
  args: {
    playerId: v.string(),
    otherPlayerId: v.string(),
    worldId: v.id('worlds'),
    conversationId: v.id('conversations')
  },
  handler: async (ctx: ActionCtx, args: { playerId: string, otherPlayerId: string, worldId: v.string(), conversationId: Id<'conversations'> }) => {
    const { player, otherPlayer, playerDescription, otherPlayerDescription } = await ctx.runQuery(
      selfInternal.queryPromptData,
      {
        playerId: args.playerId,
        otherPlayerId: args.otherPlayerId,
        worldId: args.worldId
      },
    );

    const conversation = await ctx.runQuery(selfInternal.queryConversation, {
      worldId: args.worldId,
      conversationId: args.conversationId
    });

    if (!conversation) {
      throw new Error(`Conversation ${args.conversationId} not found`);
    }

    const now = Date.now();
    const started = new Date(conversation.createdAt);
    // const embedding = await embeddingsCache.fetch(
    //   ctx,
    //   `What do you think about ${otherPlayer.name}?`,
    // );
    
    // const memories = await memory.searchMemories(ctx, player.id as GameId<'players'>, embedding, 3);
    const prompt = [
      `You are ${player.playerName}, and you're currently in a conversation with ${otherPlayer.playerName}.`,
      `The conversation started at ${started.toLocaleString()}. It's now ${now.toLocaleString()}.`,
    ];
    // prompt.push(...relatedMemoriesPrompt(memories));
    prompt.push(`About you:`);
    prompt.push(playerDescription);
    prompt.push(`About ${otherPlayer.playerName}: `);
    prompt.push(otherPlayerDescription);
    prompt.push(
      `Below is the current chat history between you and ${otherPlayer.playerName}.`,
      `DO NOT greet them again. Do NOT use the word "Hey" too often. Your response should be brief and within 200 characters.`,
    );

    const llmMessages: LLMMessage[] = [
      {
        role: 'user',
        content: prompt.join('\n'),
      },
      ...(await previousMessages(
        ctx,
        args.worldId,
        player,
        otherPlayer,
        args.conversationId as unknown as GameId<'conversations'>,
      )),
    ];
    llmMessages.push({ role: 'user', content: `${player.playerName}:` });

    const { content } = await chatCompletion({
      model: "gpt-4o",
      messages: llmMessages,
      max_tokens: 300,
      stream: true,
      stop: stopWords(otherPlayer.playerName, player.playerName),
    });
    
    
    const getConversationIdResult: { conversationId: string } = await ctx.runQuery(api.agentConversationHelper.getConversationId);
    const conversationId = getConversationIdResult.conversationId;

    const createMessageresult = await ctx.runMutation(api.agentConversationHelper.createMessage, {
      worldId: args.worldId,
      conversationId: conversationId,
      author: args.playerId,
      text: content
    });
    const messageId: string = createMessageresult.messageId;

    const createConversationResult = await ctx.runMutation(api.agentConversationHelper.createConversation, {
      worldId: args.worldId,
      playerId: args.playerId,
      otherPlayerId: args.otherPlayerId,
      messageId: messageId, 
      conversationId: conversationId
    });

    return {
      conversationId: conversationId,
      messageId: messageId,
      content: content
    }
  }
});


export async function leaveConversationMessage(
  ctx: ActionCtx,
  args: { worldId: v.string(), convId: GameId<'conversations'>, playerId: GameId<'players'>, otherPlayerId: GameId<'players'> }
) {
  const { player, otherPlayer, playerDescription, otherPlayerDescription } = await ctx.runQuery(
    selfInternal.queryPromptData,
    {
      worldId: args.worldId,
      playerId: args.playerId,
      otherPlayerId: args.otherPlayerId
    },
  );
  const prompt = [
    `You are ${player.playerName}, and you're currently in a conversation with ${otherPlayer.playerName}.`,
    `You've decided to leave the question and would like to politely tell them you're leaving the conversation.`,
  ];
 
  prompt.push(`About you:`);
  prompt.push(playerDescription);
  prompt.push(`About ${otherPlayer.playerName}: `);
  prompt.push(otherPlayerDescription);
  prompt.push(
    `Below is the current chat history between you and ${otherPlayer.playerName}.`,
    `How would you like to tell them that you're leaving? Your response should be brief and within 200 characters.`,
  );
  const llmMessages: LLMMessage[] = [
    {
      role: 'user',
      content: prompt.join('\n'),
    },
    ...(await previousMessages(
      ctx,
      args.worldId,
      player,
      otherPlayer,
      args.convId, // Updated to use args.convId
    )),
  ];
  llmMessages.push({ role: 'user', content: `${player.playerName}:` });

  const { content } = await chatCompletion({
    model: 'gpt-4o',
    messages: llmMessages,
    max_tokens: 300,
    stream: true,
    stop: stopWords(otherPlayer.playerName, player.playerName),
  });


    const getConversationIdResult: { conversationId: string } = await ctx.runQuery(api.agentConversationHelper.getConversationId);
    const conversationId = getConversationIdResult.conversationId;

    const createMessageresult = await ctx.runMutation(api.agentConversationHelper.createMessage, {
      worldId: args.worldId,
      conversationId: conversationId,
      author: args.playerId,
      text: content
    });
    const messageId: string = createMessageresult.messageId;

    const createConversationResult = await ctx.runMutation(api.agentConversationHelper.createConversation, {
      worldId: args.worldId,
      playerId: args.playerId,
      otherPlayerId: args.otherPlayerId,
      messageId: messageId, 
      conversationId: conversationId
    });


  return {
    conversationId: conversationId,
    messageId: messageId,
    content: content
  }
}

function stopWords(otherPlayer: string, player: string) {
  // These are the words we ask the LLM to stop on. OpenAI only supports 4.
  const variants = [`${otherPlayer} to ${player}`];
  return variants.flatMap((stop) => [stop + ':', stop.toLowerCase() + ':']);
}

async function previousMessages(
  ctx: ActionCtx,
  worldId: v.string(),
  player: Agent, 
  otherPlayer: Agent, 
  conversationId: GameId<'conversations'>,
) {
  const llmMessages: LLMMessage[] = [];
  const prevMessages = await ctx.runQuery(selfInternal.queryPreviousMessages, {
    worldId: worldId,
    conversationId: conversationId as unknown as Id<'conversations'>
  }); 
  for (const message of prevMessages) {
    const author = message.author === player.playerId ? player : otherPlayer;
    const recipient = message.author === player.playerId ? otherPlayer : player;
    llmMessages.push({
      role: 'user',
      content: `${author.playerName} to ${recipient.playerName}: ${message.text}`,
    });
  }
  return llmMessages;
}

export const queryPreviousMessages = internalQuery({
  args: {
    worldId: v.id('worlds'),
    conversationId: v.id('conversations')
  },
  handler: async (ctx, args) => {
    return ctx.db.query('messages')
      .withIndex('conversationId', (q) => q.eq('worldId', args.worldId).eq('conversationId', args.conversationId))
      .order('desc')
      .collect(); 
  }
});

export const queryConversation = internalQuery({
  args: {
    worldId: v.id('worlds'),
    conversationId: v.string()
  },
  handler: async (ctx, args) => {
    return ctx.db.query('conversations').withIndex('conversationId', (q) => q.eq('worldId', args.worldId).eq('conversationId', args.conversationId)).first();
  }
});

export const queryPromptData = internalQuery({
  args: {
    playerId : v.string(),
    otherPlayerId:v.string(),
    worldId: v.id('worlds')
  },
  handler: async (ctx, args) => {
    const player : Agent = await ctx.db.query('agents' as any)
      .withIndex('worldId', (q) => q.eq('worldId', args.worldId as string))
      .filter((q) => q.eq('playerId', args.playerId))
      .first();
    if (!player) {
      throw new Error(`Player ${args.playerId} not found`);
    }
    var playerDescription = `Your id is ${player.playerId} and you are ${player.baseKnowledgeInfo.age} years old. 
    You are a ${player.baseKnowledgeInfo.gender} and you are ${player.baseKnowledgeInfo.ethnicity}. 
    You describe yourself as ${player.baseKnowledgeInfo.selfDescription}. 
    You are a ${player.basePersonalityInfo.introversion} on the introversion scale. 
    You are a ${player.basePersonalityInfo.openness} on the openness scale. 
    You are a ${player.basePersonalityInfo.conscientiousness} on the conscientiousness scale. 
    You are a ${player.basePersonalityInfo.agreeableness} on the agreeableness scale. 
    You are a ${player.basePersonalityInfo.neuroticism} on the neuroticism scale. 
    Your skills include: ${player.baseSkillsInfo.skills.join(', ')}. 
    Keywords associated with you are: ${player.basePersonalityInfo.keywords.join(', ')}.`;

    if (player.inProgressOperation) {
      playerDescription += `You are currently working on ${player.inProgressOperation.name} with id ${player.inProgressOperation.operationId}.`;
    }
  
    const otherPlayer : Agent = await ctx.db.query('agents' as any)
      .withIndex('worldId', (q) => q.eq('worldId', args.worldId))
      .filter((q) => q.eq('playerId', args.otherPlayerId))
      .first();
    var otherPlayerDescription = `${otherPlayer.playerId} is ${otherPlayer.baseKnowledgeInfo.age} years old. 
    They are a ${otherPlayer.baseKnowledgeInfo.gender} and their ethnicity is ${otherPlayer.baseKnowledgeInfo.ethnicity}. 
    They describe themselves as ${otherPlayer.baseKnowledgeInfo.selfDescription}. 
    They score ${otherPlayer.basePersonalityInfo.introversion} on the introversion scale, 
    ${otherPlayer.basePersonalityInfo.openness} on the openness scale, 
    ${otherPlayer.basePersonalityInfo.conscientiousness} on the conscientiousness scale, 
    ${otherPlayer.basePersonalityInfo.agreeableness} on the agreeableness scale, 
    and ${otherPlayer.basePersonalityInfo.neuroticism} on the neuroticism scale. 
    Their skills include: ${otherPlayer.baseSkillsInfo.skills.join(', ')}. 
    Keywords associated with them are: ${otherPlayer.basePersonalityInfo.keywords.join(', ')}.`;

    if (otherPlayer.inProgressOperation) {
      otherPlayerDescription += `They are currently working on ${otherPlayer.inProgressOperation.name} with id ${otherPlayer.inProgressOperation.operationId}.`;
    }

    return {
      player, 
      otherPlayer, 
      playerDescription, 
      otherPlayerDescription
    };
  },
});