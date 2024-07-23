import { ConvexHttpClient } from "convex/browser";
import { api } from "./_generated/api.js";
import * as dotenv from "dotenv";
import { SerializedTextInput, TextInput } from "./textInput";
import { testConvo } from "./tests/testConversations";
// dotenv.config({ path: ".env.local" });

const client = new ConvexHttpClient("https://reliable-gecko-464.convex.cloud");

async function createTextInput(textInput: SerializedTextInput) {
  try {
    const id = await client.mutation(api.textInput.create, { textInput });
    console.log(`TextInput created with ID: ${id}`);
    return id;
  } catch (error) {
    console.error("Error creating TextInput:", error);
  }
}

// Function to query all TextInputs
async function getAllTextInputs() {
  try {
    const textInputs = await client.query(api.textInput.getAll);
    console.log("TextInputs:", textInputs);
    return textInputs;
  } catch (error) {
    console.error("Error querying TextInputs:", error);
  }
}

// Example usage
async function main() {
  // console.log(JSON.stringify(api, null, 2));
  // const newTextInput: SerializedTextInput = {
  //   id: "t:1",  // Replace with actual ID generation logic
  //   creator: "p:1", // Replace with actual player ID
  //   created: new Date().toISOString(),
  //   input: "Hello, World!"
  // };
  // // Create a new TextInput
  // await createTextInput(newTextInput);
  // // Query all TextInputs
  // await getAllTextInputs();
  await callAction();
}

async function callAction() {
  try {
    const result = await client.action(api.actions.testConvo);
    console.log("Action result:", result);
  } catch (error) {
    console.error("Error calling action:", error);
  }
}

main();
