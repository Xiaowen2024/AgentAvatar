import {chatCompletion, visualQuery} from "../util/llm"

// test if gpt-4 vision response is working
const image_url = "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Gfp-wisconsin-madison-the-nature-boardwalk.jpg/2560px-Gfp-wisconsin-madison-the-nature-boardwalk.jpg";

export async function testVision(image_uri: string) {
    const params = {
        model: "gpt-4o",
        messages: [
          {
            role: "user",
            content: {
              type: "image_url",
              image_url: {
                url: image_uri,
              },
            },
          }
        ],
        max_tokens: 300,
    };
  
    try {
      const response = await visualQuery(params);
      console.log('Chat Completion Response:', response);
    } catch (error) {
      console.error('Error:', error);
    }

  };