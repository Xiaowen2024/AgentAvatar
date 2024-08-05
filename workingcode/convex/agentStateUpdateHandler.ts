import type { Doc, Id } from './_generated/dataModel';
import { ActionCtx, internalQuery, action, mutation, query } from './_generated/server';
import { LLMMessage, chatCompletion } from './util/llm';
import { api, internal } from './_generated/api';
import { GameId, conversationId, playerId } from './ids';
import { NUM_MEMORIES_TO_SEARCH } from './constants';
import * as embeddingsCache from './Agent/embeddingsCache';
import * as agentConversation from './agentConversation';
import { v } from 'convex/values';
import { Agent } from './Agent/agent';
import { toAgent } from './Agent/agent';
import { client } from './client';
import { searchMemories, rememberConversation } from './agentConversationHelper';
import { extractEmotion } from './extractEmotion';
import { extractEvent } from './extractEvent';
import { extractNeedsFromText } from './extractNeeds';

export type Memory = Doc<'episodicMemories'>;
export type MemoryType = Memory['data']['type'];
export type MemoryOfType<T extends MemoryType> = Omit<Memory, 'data'> & {
  data: Extract<Memory['data'], { type: T }>;
};

// const selfInternal = internal.agentStateUpdateHandler;

export async function AnalyzeTextualInput(text: string){
    const needs = await extractNeedsFromText(text);
    const emotions = await extractEmotion(text); 

    if (Object.keys(emotions).length > 0) {
        const predictedEmotion = emotions["predicted_emotion"];
        const probs = emotions["probabilities"];
    }

    if (Object.keys(needs).length > 0){
        const needForAcceptance = needs["needForAcceptance"] === "NA" ? undefined : needs["needForAcceptance"] === "1";
        const needForOptimalPredictability = needs["needForOptimalPredictability"] === "NA" ? undefined : needs["needForOptimalPredictability"] === "1";
        const needForCompetence = needs["needForCompetence"] === "NA" ? undefined : needs["needForCompetence"] === "1";
    }
}


