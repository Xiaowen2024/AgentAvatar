import { chatCompletion, ChatCompletionParams } from "../util/llm"

// test if gpt-4 chat response is working
(async () => {
    const params: ChatCompletionParams = {
        model: "gpt-4",
         messages: [
            { role: 'user', content: 'Tell me a joke.' }
        ],
        
      max_tokens: 50,
    };
  
    try {
      const response = await chatCompletion(params);
      console.log('Chat Completion Response:', response);
    } catch (error) {
      console.error('Error:', error);
    }
  })();