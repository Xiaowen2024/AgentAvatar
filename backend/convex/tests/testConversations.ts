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

import { internal } from '../_generated/api';
import { ActionCtx } from '../_generated/server'; 

async function runTestConvo() {
  const result = await internal.actions.testConvo({}, {});
  console.log(result);
}

runTestConvo().catch((error) => {
  console.error('Error running testConvo:', error);
});


export const testConvo = internalAction({
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
