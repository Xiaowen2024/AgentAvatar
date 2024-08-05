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
  ),
};

const personalSemanticMemoryTypes = ["self-knowledge", "autographical-facts", "repeated-events"] as const;

export const semanticMemoryFields = {
  playerId : playerId,
  nodeId: v.string(),
  type: v.union(...personalSemanticMemoryTypes.map(v.literal)),
  content: v.string(),
  embeddingId: v.id('memoryEmbeddings'),
  importance: v.number(),
  lastAccess: v.number(),
  emotion: v.optional(v.string()),
  data: v.union(
    v.object({
      type: v.literal('episodicMemory'),
      episodicMemoryId: v.optional(v.string()),
    }),
    v.object({
        type: v.literal('textinput'),
        textinputId:  v.optional(v.string())
    }),
    v.object({
      type: v.literal('visualinput'),
      visualinputId:  v.optional(v.string())
    }),
  ),
  relatedSemanticMemoryIds: v.array(v.string()),
}; 

export const memoryTables = {
  episodicMemories: defineTable(episodicMemoryFields)
    .index('embeddingId', ['embeddingId'])
    .index('playerId_type', ['playerId', 'data.type'])
    .index('playerId', ['playerId']),

  semanticMemories: defineTable(semanticMemoryFields)
    .index('embeddingId', ['embeddingId'])
    .index('playerId', ['playerId'])
    .index('type', ['type']),

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
      conformity: v.number(),
      tradition: v.number(),
      benevolence: v.number(),
      universalism: v.number(),
      selfdirection: v.number(),
      stimulation: v.number(),
      hedonism: v.number(),
      achievement: v.number(),
      power: v.number(),
      security: v.number(),
      interests: v.array(v.string()),
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