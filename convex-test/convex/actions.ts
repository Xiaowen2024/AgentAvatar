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