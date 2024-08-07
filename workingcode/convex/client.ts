import { ConvexHttpClient } from "convex/browser";
import { api } from "./_generated/api.js";
import * as dotenv from "dotenv";

import { action, httpAction } from "./_generated/server";
import { useAction } from "convex/react";
import { ConvexClient } from "convex/browser";
import { anyApi } from "convex/server";


export const client = new ConvexHttpClient("https://tremendous-okapi-985.convex.cloud");


async function main(){
  
  // const response = await fetch("https://different-deer-793.convex.cloud", {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json',
  //   },
  //   body: JSON.stringify({
  //     path: 'Agent/conversation:startConversationMessageAction',
  //     args: {
  //       conversationId: 'c:1',
  //       playerId: 'p:1',
  //       otherPlayerId: 'p:2'
  //     },
  //     format: 'json'
  //   })
  // });

//   const result = await response.json();
//   console.log(result);

 const response = await fetch("https://tremendous-okapi-985.convex.cloud", {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      path: 'client:testAction',
      args: {
        // Add any necessary arguments for testAction here
      },
      format: 'json'
    })
  });

  if (response.ok) {
    const text = await response.text();
    const result = text ? JSON.parse(text) : {};
    console.log(result);
  } else {
    console.error('Network response was not ok.');
    console.error('Status:', response.status);
    const errorText = await response.text();
    console.error('Response body:', errorText);
  }

  //   const response = await fetch("https://tremendous-okapi-985.convex.cloud", {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json',
  //   },
  //   body: JSON.stringify({
  //     path: 'Agent/conversation:startConversationMessageAction',
  //     args: {
  //       conversationId: 'c:1',
  //       playerId: 'p:1',
  //       otherPlayerId: 'p:2'
  //     },
  //     format: 'json'
  //   })
  // });

  // if (response.ok) {
  //   const text = await response.text();
  //   const result = text ? JSON.parse(text) : {};
  //   console.log(result);
  // } else {
  //   console.error('Network response was not ok.');
  //   console.error('Status:', response.status);
  //   const errorText = await response.text();
  //   console.error('Response body:', errorText);
  // }
}

// export const testAction = action({
//   handler: async (ctx) => {
//     console.log("testAction");
//     return "Action executed successfully";
//   },
// });

// async function callStartConversationMessageAction() {
//   try {
//     const result = await client.action(api.agentConversation.startConversationMessageAction, {
//       playerId: 'p:1',
//       otherPlayerId: 'p:2'
//     });
//     console.log(result); // Should log "Action executed successfully"
//   } catch (error) {
//     console.error("Error calling testAction:", error);
//   }
// }

// callStartConversationMessageAction();

// main();