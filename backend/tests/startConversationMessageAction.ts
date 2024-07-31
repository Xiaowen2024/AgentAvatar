import { client } from "../client";
import { api } from "../_generated/api";

async function callStartConversationMessageAction() {
    try {
      const result = await client.action(api.agentConversation.startConversationMessageAction, {
        playerId: 'p:1',
        otherPlayerId: 'p:2',
        worldId: 'w:1'
      });
      console.log(result);
    } catch (error) {
      console.error("Error calling testAction:", error);
    }
  }
  
  callStartConversationMessageAction();