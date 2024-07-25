import { startConversationMessage } from "../Agent/conversation";
import {
  DatabaseReader,
  internalAction,
  internalMutation,
  mutation,
  query,
} from '../_generated/server';
import { v } from 'convex/values';
import { GameId } from '../ids';
// test if start conversation message is working


export const testConvo = internalAction({
  args: {},
  handler: async (ctx, args) => {
    const a: any = (await startConversationMessage(
      ctx,
      'c:1' as GameId<'conversations'>,
      'p:1' as GameId<'players'>,
      'p:2' as GameId<'players'>,
    )) as any;
    return await a.readAll();
  },
});


