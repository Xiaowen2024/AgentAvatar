import { v } from 'convex/values';
import { mutation, query } from './_generated/server';
import { conversationId, playerId,  } from './ids';



export const listMessages = query({
  args: {
    worldId: v.id('worlds'),
    conversationId,
  },
  handler: async (ctx, args) => {
    const messages = await ctx.db
      .query('messages')
      .withIndex('conversationId', (q) => q.eq('worldId', args.worldId).eq('conversationId', args.conversationId))
      .collect();
    const out = [];
    for (const message of messages) {
      const authorPlayerId = message.author;
      const agent = await ctx.db
        .query('agents')
        .withIndex('playerId', (q) => q.eq('worldId', args.worldId))
        .filter((q) => q.eq(q.field('playerId'), authorPlayerId))
        .first();
      if (!agent) {
        throw new Error(`Invalid author ID: ${message.author}`);
      }
      out.push({ ...message, authorName: agent.playerName });
    }
    return out;
  },
});

export const writeMessage = mutation({
  args: {
    worldId: v.id('worlds'),
    conversationId,
    messageUuid: v.string(),
    playerId,
    text: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert('messages', {
      conversationId: args.conversationId,
      author: args.playerId,
      messageUuid: args.messageUuid,
      text: args.text,
      worldId: args.worldId,
    });
  },
});