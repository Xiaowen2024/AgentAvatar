import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';
import { conversationId, playerId, worldId } from './ids';

const embeddingDimension = 1536;
export const episodicMemoryFields = {
  playerId : playerId,
  worldId: v.string(),
  description: v.string(),
  embeddingId: v.id('memoryEmbeddings'),
  importance: v.number(),
  lastAccess: v.number(),
  emotion: v.optional(v.string()),
  data: v.union(
    v.object({
      type: v.literal('relationship'),
      playerId,
    }),
    v.object({
      type: v.literal('conversation'),
      conversationId : v.optional(v.string()),
      playerIds: v.array(playerId),
    }),
    v.object({
        type: v.literal('textinput'),
        textinputId:  v.optional(v.string())
    }),
    v.object({
      type: v.literal('visualinput'),
      visualinputId:  v.optional(v.string())
    }),
    v.object({
      type: v.literal('reflection'),
      relatedMemoryIds: v.array(v.id('memories')),
    }),
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


export const memoryTables = {
  episodicMemories: defineTable(episodicMemoryFields)
    .index('embeddingId', ['embeddingId'])
    .index('playerId_type', ['playerId', 'data.type'])
    .index('playerId', ['playerId']),

  semanticMemories: defineTable(semanticMemoryFields)
    .index('embeddingId', ['embeddingId'])
    .index('playerId', ['playerId']),

  memoryEmbeddings: defineTable({
    playerId,
    embedding: v.array(v.float64()),
  }).vectorIndex('embedding', {
    vectorField: 'embedding',
    filterFields: ['playerId'],
    dimensions: embeddingDimension,
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

  worlds: defineTable({ 
    worldId: v.string(), 
    createdTime: v.string()
   }),
  agents: defineTable({
    playerId: v.string(),
    worldId: v.string(),
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
      interests: v.array(v.string()),
      values: v.array(v.string()),
    }),
    baseSkillsInfo: v.object({
      skills: v.array(v.string()),
    }),
    inProgressOperation: v.optional(v.any())
  }).index("playerId", ["worldId", "playerId"]),

  conversations: defineTable({
    conversationId: v.string(),
    worldId: v.string(),
    playerId: v.string(),
    otherPlayerId: v.string(), 
    createdAt: v.string(),
    endedAt: v.optional(v.string()), 
    lastMessageId: v.optional(v.string())
  }).index("conversationId", ["worldId", "conversationId"]),

  messages: defineTable({
    conversationId,
    messageUuid: v.string(),
    author: playerId,
    text: v.string(),
    worldId: v.string()
  })
    .index('conversationId', ['worldId', 'conversationId'])
    .index('messageUuid', ['conversationId', 'messageUuid']),

  ...agentTables
});
