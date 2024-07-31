import { v } from 'convex/values';
import { playerId, conversationId, textinputId, visualinputId, userId } from '../ids';
import { defineTable, defineSchema } from 'convex/server';
import { LLM_CONFIG } from '../util/llm';

export const episodicMemoryFields = {
  playerId : playerId,
  description: v.string(),
  embeddingId: v.id('memoryEmbeddings'),
  importance: v.number(),
  lastAccess: v.number(),
  emotion: v.optional(v.string()),
  confidenceLevel: v.number(),
  data: v.union(
    // event relations with other players
    v.object({
      type: v.literal('relationship'),
      playerIds : v.optional(v.array(playerId))
    }),
    // conversations related to this memory
    v.object({
      type: v.literal('conversation'),
      conversationId: v.optional(conversationId)
    }),
    // reflection related to this memory
    v.object({
      type: v.literal('reflection'),
      relatedMemoryIds: v.array(v.id('memories')),
    }),
    // below two are specificly related to memory updates that are driven by user input instead of actual conversations or events
    // text input related to this memory
    v.object({
        type: v.literal('textinput'),
        textinputId:  v.optional(textinputId)
    }),
    // visual input related to this memory
    v.object({
      type: v.literal('visualinput'),
      visualinputId:  v.optional(visualinputId)
    })
  ),
};

export const semanticMemoryFields = {
  playerId : playerId,
  conceptId : v.id('concepts'),
  description: v.string(),
  embeddingId: v.id('memoryEmbeddings'),
  strength: v.number(),
  lastAccess: v.number(),
  relation:  v.object({
    type: v.literal('relationship'),
    relatedConceptIds: v.array(v.id('concepts')),
    relationshipType: v.string(),
  })
};

export const proceduralMemoryFields = {
  playerId : playerId,
  producerId : v.id('producers'),
  description : v.string(),
  embeddingId : v.id('memoryEmbeddings'),
  skillLevel : v.number(), 
  lastAccess : v.number()
};

export const textualWorkingMemoryFields = {
  playerId : playerId,
  otherPlayerId : v.array(playerId),
  text : v.string(),
  embeddingId : v.id('memoryEmbeddings'),
  lastAccess : v.number(),
  emotion : v.optional(v.string())
};

export const visualWorkingMemoryFields = {
  playerId : playerId,
  imageurl : v.string(),
  description : v.string(),
  embeddingId : v.id('memoryEmbeddings'),
  importance : v.number(),
  lastAccess : v.number(),
  emotion : v.optional(v.string())
};

export const memoryTables = {
  episodicMemories: defineTable(episodicMemoryFields)
    .index('embeddingId', ['embeddingId'])
    .index('playerId_type', ['playerId', 'data.type'])
    .index('playerId', ['playerId']),

  semanticMemories: defineTable(semanticMemoryFields)
    .index('embeddingId', ['embeddingId'])
    .index('playerId', ['playerId']),

  proceduralMemories: defineTable(proceduralMemoryFields)
    .index('embeddingId', ['embeddingId'])
    .index('playerId', ['playerId']),

  textualWorkingMemories: defineTable(textualWorkingMemoryFields)
    .index('embeddingId', ['embeddingId'])
    .index('playerId', ['playerId']),

  visualWorkingMemories: defineTable(visualWorkingMemoryFields)
    .index('embeddingId', ['embeddingId'])
    .index('playerId', ['playerId']),

  memoryEmbeddings: defineTable({
    playerId,
    embedding: v.array(v.float64()),
  }).vectorIndex('embedding', {
    vectorField: 'embedding',
    filterFields: ['playerId'],
    dimensions: LLM_CONFIG.embeddingDimension,
  }),
};



export const agentTables = {
  ...memoryTables,
  embeddingsCache: defineTable({
    textHash: v.bytes(),
    embedding: v.array(v.float64()),
  }).index('text', ['textHash']),
};

export default defineSchema({
  agents: defineTable({
    playerId: v.string(),
    playerName: v.string(),
    baseKnowledgeInfo: v.object({
      age: v.number(),
      gender: v.string(),
      ethnicity: v.string(),
      selfDescription: v.string(),
    }),
    basePersonalityInfo: v.object({
      introversion: v.number(),
      openness: v.number(),
      conscientiousness: v.number(),
      agreeableness: v.number(),
      neuroticism: v.number(),
      keywords: v.array(v.string()),
    }),
    baseSkillsInfo: v.object({
      skills: v.array(v.string()),
    }),
    inProgressOperation: v.optional(v.any())
  }),
});