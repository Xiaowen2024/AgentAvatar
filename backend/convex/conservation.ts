import { GameId } from './ids.js';
import { Agent, SerializedAgent, serializedAgent } from './agent.js';
import { saveConversationMemory } from './conversation_memory.js';
import { chatCompletion } from '../util/llm';
import * as embeddingsCache from './embeddingsCache';
import * as memory from './memory';
import { NUM_MEMORIES_TO_SEARCH } from '../constants';

let conversationHistory = [];

async function generateResponse(ctx, speakingAgent: Agent, respondingAgent: Agent, dialogue: string, emotion: string, sceneDescription: string) {
  const prompt = [
    `You are ${respondingAgent.baseKnowledge.selfDescription}.`,
    `${speakingAgent.baseKnowledge.selfDescription} just said: "${dialogue}" with a ${emotion} expression.`,
    `The current scene is: ${sceneDescription}`,
    `Respond appropriately based on your personality: ${respondingAgent.basePersonality.keywords.join(', ')}.`,
  ];

  const { content: responseDialogue } = await chatCompletion({
    messages: [{ role: 'user', content: prompt.join('\n') }],
    max_tokens: 300,
    stream: true,
  });

  const { content: responseEmotion } = await chatCompletion({
    messages: [{ role: 'user', content: `Analyze the following dialogue and determine the emotion: "${responseDialogue}"` }],
    max_tokens: 10,
    stream: true,
  });

  return { dialogue: responseDialogue, emotion: responseEmotion };
}

async function continueConversation(ctx, speakingAgent: Agent, dialogue: string, emotion: string, agents: Agent[], sceneDescription: string) {
  const responses = {};

  for (const agent of agents) {
    if (agent.id !== speakingAgent.id) {
      const response = await generateResponse(ctx, speakingAgent, agent, dialogue, emotion, sceneDescription);
      conversationHistory.push({ speaker: agent.baseKnowledge.selfDescription, dialogue: response.dialogue, emotion: response.emotion });
      responses[agent.baseKnowledge.selfDescription] = response;
    }
  }

  saveConversationMemory(conversationHistory);

  return responses;
}

async function introduceAgent(agent: Agent, sceneDescription: string) {
  const introduction = `Hello, I am ${agent.baseKnowledge.selfDescription}.`;
  conversationHistory.push({ speaker: agent.baseKnowledge.selfDescription, dialogue: introduction, emotion: "neutral" });

  const prompt = [
    `You are ${agent.baseKnowledge.selfDescription}.`,
    `Introduce yourself. The current scene is: ${sceneDescription}`,
  ];

  const { content: introductionDialogue } = await chatCompletion({
    messages: [{ role: 'user', content: prompt.join('\n') }],
    max_tokens: 300,
    stream: true,
  });

  return introductionDialogue;
}

export async function familyGatheringResponse(ctx, speakingAgentId: GameId<'agents'>, initialDialogue: string, initialEmotion: string, sceneDescription: string, playerResponse: string = null, playerEmotion: string = null) {
  // 获取所有代理的信息（此处假设 agents 是一个包含所有代理信息的数组）
  const agentsData: SerializedAgent[] = [serializedAgent, /* 其他代理数据 */]; // 替换为实际的代理数据
  const agents = agentsData.map(data => new Agent(data));

  const speakingAgent = agents.find(agent => agent.id === speakingAgentId);
  if (!speakingAgent) throw new Error('Speaking agent not found');

  if (conversationHistory.length === 0) {
    // 让所有代理进行自我介绍
    for (const agent of agents) {
      const introduction = await introduceAgent(agent, sceneDescription);
      conversationHistory.push({ speaker: agent.baseKnowledge.selfDescription, dialogue: introduction, emotion: "neutral" });
    }

    const initialResponses = await continueConversation(ctx, speakingAgent, initialDialogue, initialEmotion, agents, sceneDescription);
    conversationHistory.push({ speaker: speakingAgent.baseKnowledge.selfDescription, dialogue: initialDialogue, emotion: initialEmotion });
    saveConversationMemory(conversationHistory);
    return initialResponses;
  }

  if (playerResponse && playerEmotion) {
    conversationHistory.push({ speaker: speakingAgent.baseKnowledge.selfDescription, dialogue: playerResponse, emotion: playerEmotion });
    const subsequentResponses = await continueConversation(ctx, speakingAgent, playerResponse, playerEmotion, agents, sceneDescription);
    saveConversationMemory(conversationHistory);
    return subsequentResponses;
  }

  const lastDialogue = conversationHistory[conversationHistory.length - 1];
  const embedding = await embeddingsCache.fetch(ctx, `Respond to: ${lastDialogue.dialogue}`);

  const memories = await memory.searchMemories(ctx, speakingAgent.id, embedding, NUM_MEMORIES_TO_SEARCH);
  const memoryPrompts = memories.map(mem => `Memory: ${mem.description}`).join('\n');

  const prompt = [
    `You are ${speakingAgent.baseKnowledge.selfDescription}.`,
    `Below is the conversation history:`,
    ...conversationHistory.map(hist => `${hist.speaker}: ${hist.dialogue}`),
    `Now respond appropriately.`,
    memoryPrompts,
  ];

  const { content: autoResponse } = await chatCompletion({
    messages: [{ role: 'user', content: prompt.join('\n') }],
    max_tokens: 300,
    stream: true,
  });

  const { content: autoEmotion } = await chatCompletion({
    messages: [{ role: 'user', content: `Analyze the following dialogue and determine the emotion: "${autoResponse}"` }],
    max_tokens: 10,
    stream: true,
  });

  conversationHistory.push({ speaker: speakingAgent.baseKnowledge.selfDescription, dialogue: autoResponse, emotion: autoEmotion });
  const subsequentResponses = await continueConversation(ctx, speakingAgent, autoResponse, autoEmotion, agents, sceneDescription);
  saveConversationMemory(conversationHistory);
  return subsequentResponses;
}
