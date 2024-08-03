import { client } from "../client";
import { api } from "../_generated/api";
import { Id } from "../_generated/dataModel";

async function testContinueConversationMessageAction() {
    try {
      const result = await client.action(api.agentConversation.startConversationMessageAction, {
        playerId: "p:1",
        otherPlayerId: "p:2",
        worldId: 'w:1' as Id<'worlds'>
      });
      console.log(result);
      if (result.conversationId !== undefined) {
        const continueResult = await client.action(api.agentConversation.continueConversationMessageAction, {
          playerId: "p:2",
          otherPlayerId: "p:1",
          worldId: 'w:1' as Id<'worlds'>,
          conversationId: result.conversationId as Id<'conversations'>,
        });
        console.log(continueResult);
      } else {
        console.log("Failed");
      }
    } catch (error) {
      console.error("Error calling testAction:", error);
    }
  }
  
testContinueConversationMessageAction();