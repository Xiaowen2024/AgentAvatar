import {
    DatabaseReader,
    internalAction,
    internalMutation,
    mutation,
    query,
    action
  } from './_generated/server';
  import { v } from 'convex/values';

export async function sayHello() {
    return `Hello, World! This is a test action.`;
}

export const testAction = action({
  handler: async (ctx) => {
    console.log("testAction");
    return "Action executed successfully";
  },
});