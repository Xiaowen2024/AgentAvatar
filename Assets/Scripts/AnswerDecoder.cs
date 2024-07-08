using System.Collections;
using System.Collections.Generic;
using UnityEngine;


public class AnswerDecoder
{
    
    public string id;
    public string model;
    public static string responseContent;

    [System.Serializable]
    public class chatCompletion
    {
        public string id;
        public string obj;
        public int created;
        public string model;
        public List<Choice> choices;
        public Usage usage;
        public string system_fingerprint;
    }

    [System.Serializable]
    public class Choice
    {
        public int index;
        public Message message;
        public object logprobs;
        public string finish_reason;
    }

    [System.Serializable]
    public class Message
    {
        public string role;
        public string content;
    }

    [System.Serializable]
    public class Usage
    {
        public int prompt_tokens;

        public int completion_tokens;

        public int total_tokens;
    }

    public void ParseResponse(string jsonResponse)
    {
        chatCompletion response = JsonUtility.FromJson<chatCompletion>(jsonResponse);

        if (response.choices != null && response.choices.Count > 0)
        {
            // Get the content from the first choice
            responseContent = response.choices[0].message.content;
        }
        else
        {
            Debug.LogError("No choices found in the JSON response.");
        }
    }

    // Method to get the content
    public string GetContent()
    {
        return responseContent;
    }
}
