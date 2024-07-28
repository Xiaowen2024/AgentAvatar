import { Id } from './_generated/dataModel';
import { ActionCtx, internalQuery, action } from './_generated/server';
import { LLMMessage, chatCompletion } from './util/llm';
import { api, internal } from './_generated/api';
import { GameId, conversationId, playerId } from './ids';
import { NUM_MEMORIES_TO_SEARCH } from './constants';
import * as memory from './Agent/memory';
import * as embeddingsCache from './Agent/embeddingsCache';
import * as agentConversation from './agentConversation';
import { v } from 'convex/values';
import { Agent } from './Agent/agent';



const selfInternal = internal.agentConversation;

export async function startConversationMessage(
  ctx: ActionCtx,
  conversationId: GameId<'conversations'>,
  playerId: GameId<'players'>,
  otherPlayerId: GameId<'players'>,
) {
  
  // const { player, otherPlayer, agent, otherAgent, lastConversation } = await ctx.runQuery(
  //   internal.Agent.agentConversation.queryPromptData,
  //   {
  //     playerId,
  //     otherPlayerId,
  //     conversationId,
  //   },
  // );
  // const embedding = await embeddingsCache.fetch(
  //   ctx,
  //   `${player.name} is talking to ${otherPlayer.name}`,
  // );

  // const memories = await memory.searchMemories(
  //   ctx,
  //   player.id as GameId<'players'>,
  //   embedding,
  //   Number(process.env.NUM_MEMORIES_TO_SEARCH) || NUM_MEMORIES_TO_SEARCH,
  // );

  // const memoryWithOtherPlayer = memories.find(
  //   (m : any) => m.data.type === 'conversation' && m.data.playerIds.includes(otherPlayerId),
  // );
  // const prompt = [
  //   `You are ${player.name}, and you just started a conversation with ${otherPlayer.name}.`,
  // ];
  // prompt.push(...agentPrompts(otherPlayer, agent, otherAgent ?? null));
  // prompt.push(...previousConversationPrompt(otherPlayer, lastConversation));
  // // prompt.push(...relatedMemoriesPrompt(memories));
  // // if (memoryWithOtherPlayer) {
  // //   prompt.push(
  // //     `Be sure to include some detail or question about a previous conversation in your greeting.`,
  // //   );
  // // }
  // prompt.push(`${player.name}:`);

  // const params = {
  //   model: "gpt-4",
  //   messages: [
  //     { role: 'user' as const, content: prompt.join('\n') }
  //   ],
  //   max_tokens: 50,
  //   stop: stopWords(otherPlayer.name, player.name),
  // };

  // const { content } = await chatCompletion(params);
  // return content;
}

export const startConversationMessageAction = action({
  args: {
    playerId: v.string(),
    otherPlayerId: v.string()
  },
  handler: async (ctx: ActionCtx, args: { conversationId: string, playerId: string, otherPlayerId: string }) => {
    const { player, otherPlayer, playerDescription, otherPlayerDescription } = await ctx.runQuery(
      selfInternal.queryPromptData,
      {
        playerId: args.playerId, 
        otherPlayerId: args.otherPlayerId
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
    return content;
    // return 'test';
  }
});

// function agentPrompts(
//   otherPlayer: { name: string },
//   agent: { identity: string; plan: string } | null,
//   otherAgent: { identity: string; plan: string } | null,
// ): string[] {
//   const prompt: string[] = [];
//   if (agent) {
//     prompt.push(`About you: ${agent.identity}`);
//     prompt.push(`Your goals for the conversation: ${agent.plan}`);
//   }
//   if (otherAgent) {
//     prompt.push(`About ${otherPlayer.name}: ${otherAgent.identity}`);
//   }
//   return prompt;
// }

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

// function relatedMemoriesPrompt(memories: memory.Memory[]): string[] {
//   const prompt: string[] = [];
//   if (memories.length > 0) {
//     prompt.push(`Here are some related memories in decreasing relevance order:`);
//     for (const memory of memories) {
//       prompt.push(' - ' + memory.description);
//     }
//   }
//   return prompt;
// }

function stopWords(otherPlayer: string, player: string) {
  // These are the words we ask the LLM to stop on. OpenAI only supports 4.
  const variants = [`${otherPlayer} to ${player}`];
  return variants.flatMap((stop) => [stop + ':', stop.toLowerCase() + ':']);
}


export const queryPromptData = internalQuery({
  args: {
    playerId : v.string(),
    otherPlayerId:v.string()
  },
  handler: async (ctx, args) => {
    const player : Agent = await ctx.db.query('agents' as any).withIndex('playerId', (q) => q.eq('playerId', args.playerId)).first();
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
  
    const otherPlayer : Agent = await ctx.db.query('agents' as any).withIndex('playerId', (q) => q.eq('playerId', args.otherPlayerId)).first();
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

    // const conversation = await ctx.db.query('conversations' as any).withIndex('id', (q) => q.eq('id', args.conversationId)).first();
    // if (!conversation) {
    //   throw new Error(`Conversation ${args.conversationId} not found`);
    // }
    
    // const lastTogether = await ctx.db
    //   .query('participatedTogether')
    //   .withIndex('edge', (q) =>
    //     q
    //       .eq('worldId', args.worldId)
    //       .eq('player1', args.playerId)
    //       .eq('player2', args.otherPlayerId),
    //   )
    //   // Order by conversation end time descending.
    //   .order('desc')
    //   .first();

    // let lastConversation = null;
    // if (lastTogether) {
    //   lastConversation = await ctx.db
    //     .query('archivedConversations')
    //     .withIndex('worldId', (q) =>
    //       q.eq('worldId', args.worldId).eq('id', lastTogether.conversationId),
    //     )
    //     .first();
    //   if (!lastConversation) {
    //     throw new Error(`Conversation ${lastTogether.conversationId} not found`);
    //   }
    // }
    return {
      player, 
      otherPlayer, 
      playerDescription, 
      otherPlayerDescription
    };
  },
});