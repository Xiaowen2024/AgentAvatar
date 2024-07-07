import { ObjectType, v } from 'convex/values';
import { GameId, parseGameId, textinputId, playerId} from './ids.js';
import { ConversationMembership, serializedConversationMembership } from './conversationMembership';
import { parseMap, serializeMap } from './util/object';


import { FunctionArgs  } from 'convex/server';
import { MutationCtx, internalMutation, internalQuery, mutation, query } from './_generated/server';
import { internal } from './_generated/api.js';

// class TextInput {
//   id: GameId<'textinput'>;
//   creator: GameId<'players'>;
//   created: number;

//   constructor(serialized: SerializedTextInput) {
//     const { id, creator, created } = serialized;
//     this.id = parseGameId('textinput', id);
//     this.creator = parseGameId('players', creator);
//     this.created = created;
//   }
// }


export class TextInput {
  id: GameId<'textinput'>;
  creator: GameId<'players'>;
  created: string;
  input: string;

  constructor(serialized: SerializedTextInput) {
      const { id, creator, created } = serialized;
      this.id = parseGameId('textinput', id);
      this.creator = parseGameId('players', creator);
      this.created = created;
      this.input = input;
  }
}

export const serializedTextInput = {
  id: v.string(),
  creator: v.string(),
  created: v.string(),
  input: v.string(),
};
export type SerializedTextInput = ObjectType<typeof serializedTextInput>;

export const create = mutation({
  args: { textInput: v.object(serializedTextInput) },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert("textInputs", args.textInput);
    return id;
  },
});

export const getAll = query({
  handler: async (ctx) => {
    return await ctx.db.query("textInputs").collect();
  },
});



export default mutation(async ({ db }, textInput: SerializedTextInput) => {
  const id = await db.insert("textInputs", textInput);
  return id;
});