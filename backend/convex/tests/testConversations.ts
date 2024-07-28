import { startConversationMessage } from "../agentConversation";
import {
  DatabaseReader,
  internalAction,
  internalMutation,
  mutation,
  query,
  action
} from '../_generated/server';
import { v } from 'convex/values';
import { GameId } from '../ids';
import { internal } from '../_generated/api';
import { ActionCtx } from '../_generated/server'; 


export const testConvo = action({
  args: {},
  handler: async (ctx: ActionCtx, args) => {
    const a: any = (await startConversationMessage(
      ctx,
      'c:115' as GameId<'conversations'>,
      'p:0' as GameId<'players'>,
      'p:6' as GameId<'players'>,
    )) as any;
    return await a.readAll();
  },
});


export const sayHello = action({
  args: { name: v.string() },
  handler: async (ctx, args) => {
    return `Hello, ${args.name}! This is a test action.`;
  },
});