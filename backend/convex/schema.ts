import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';
import { agentTables } from './Agent/schema';
// import { aiTownTables } from './aiTown/schema';
import { conversationId, playerId } from './ids';

export default defineSchema({
  music: defineTable({
    storageId: v.string(),
    type: v.union(v.literal('background'), v.literal('player')),
  }),
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
  }).index("playerId", ["playerId"]),

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
