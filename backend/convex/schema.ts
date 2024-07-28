import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';
import { agentTables } from './Memory/schema';
// import { aiTownTables } from './aiTown/schema';
import { conversationId, playerId } from './ids';

export default defineSchema({

  worlds: defineTable({ 
    worldId: v.string(), 
    createdTime: v.string()
   }),
  agents: defineTable({
    playerId: v.string(),
    worldId: v.id('worlds'),
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
  }).index("playerId", ["worldId", "playerId"]),

  conversations: defineTable({
    conversationId: v.string(),
    worldId: v.id('worlds'),
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
    worldId: v.optional(v.id('worlds')),
  })
    .index('conversationId', ['worldId', 'conversationId'])
    .index('messageUuid', ['conversationId', 'messageUuid']),

  ...agentTables
});
