import { ObjectType, v } from 'convex/values';
import { GameId, parseGameId, textinputId, playerId} from './ids.js';
import { ConversationMembership, serializedConversationMembership } from './conversationMembership';
import { parseMap, serializeMap } from './util/object';
import { FunctionArgs  } from 'convex/server';
import { MutationCtx, internalMutation, internalQuery, mutation, query } from './_generated/server';
import { internal } from './_generated/api.js';
import { ConvexHttpClient } from "convex/browser";
import { api } from "./_generated/api.js";
import * as dotenv from "dotenv";
import { SerializedTextInput, TextInput } from "./textInput";


export class TextInput  {
  id: GameId<'textinput'>;
  creator: GameId<'players'>;
  user: GameId<'users'>;
  created: string;
  input: string;

  constructor(serialized: SerializedTextInput) {
      const { id, creator, created, input, user } = serialized;
      this.id = parseGameId('textinput', id);
      this.creator = parseGameId('players', creator);
      this.user = parseGameId('users', user);
      this.created = created;
      this.input = input;
  }
}

export const serializedTextInput = {
  id: v.string(),
  creator: v.string(),
  user: v.string(),
  created: v.string(),
  input: v.string(),
};

export type SerializedTextInput = ObjectType<typeof serializedTextInput>;

const client = new ConvexHttpClient("https://reliable-gecko-464.convex.cloud");

export async function createTextInput(textInput: SerializedTextInput) {
  try {
    const id = await client.mutation(api.textInput.create, { textInput });
    console.log(`TextInput created with ID: ${id}`);
    return id;
  } catch (error) {
    console.error("Error creating TextInput:", error);
  }
}

// Function to query all TextInputs
export async function getAllTextInputs() {
  try {
    const textInputs = await client.query(api.textInput.getAll);
    console.log("TextInputs:", textInputs);
    return textInputs;
  } catch (error) {
    console.error("Error querying TextInputs:", error);
  }
}


