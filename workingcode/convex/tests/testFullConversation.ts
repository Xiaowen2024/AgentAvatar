import { client } from "../client";
import { api } from "../_generated/api";
import { Id, GameId } from "../_generated/dataModel";

async function testContinueConversationMessageAction() {
    try {
      const result = await client.action(api.agentConversation.startConversationMessageAction, {
        playerId: "p:1",
        otherPlayerId: "p:2",
        worldId: 'w:1' as Id<'worlds'>
      });
      console.log(result);
      if (result.conversationId !== undefined) {
        let conversationId = result.conversationId as GameId<'conversations'>;
        for (let i = 0; i < 3; i++) { 
          const continueResult = await client.action(api.agentConversation.continueConversationMessageAction, {
            playerId: i % 2 === 0 ? "p:2" : "p:1", 
            otherPlayerId: i % 2 === 0 ? "p:1" : "p:2",
            worldId: 'w:1' as Id<'worlds'>,
            conversationId: conversationId,
          });
          console.log(continueResult);
          conversationId = continueResult.conversationId as GameId<'conversations'>; 
        }
        const leaveResult = await client.action(api.agentConversation.leaveConversationMessageAction, {
          worldId: 'w:1' as Id<'worlds'>,
          conversationId: conversationId as GameId<'conversations'>,
          playerId: "p:1" as GameId<'players'>, 
          otherPlayerId: "p:2" as GameId<'players'>,
        });
      } else {
        console.log("Failed");
      }
    } catch (error) {
      console.error("Error calling testAction:", error);
    }
  }
  
testContinueConversationMessageAction();