using System;
using System.Collections;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using Unity.VisualScripting;
using UnityEngine;
using UnityEngine.InputSystem;
using UnityEngine.Networking;
using UnityEngine.Windows.WebCam;

public class VisionModel : MonoBehaviour
{
    [SerializeField] private string openAIUrl = "https://api.openai.com/v1/chat/completions";
    [SerializeField] private string apiKey = "sk-proj-WQQGfls7Glf8EzP5skoWT3BlbkFJb0Ved8WcYfsE9du6hVgV"; 

    public List<string> imageUrls = new List<string>();
    public string queryMessage = "What's the gesture of the wooden puppet in the image? Choose one of the options: standing still, walking, waving hands, raising hands up, raising hands to the sides. ";

    PhotoCapture photoCaptureObject = null;
    Texture2D targetTexture = null;
    WebCamTexture webCamTexture;
    ImageUploader imageUploader;

    private string segmentedText = " ";

    private string resultText = " ";

    void Start()
    {
        // getImage();
        // imageUrls.Add("https://avatarresearchimages.s3.us-west-1.amazonaws.com/screenshot.png");
        // StartCoroutine(PostImageQueryRequest(HandleResponse));
        
         // StartCoroutine(PostTextQueryRequest("how are you", HandleResponse));
        webCamTexture = new WebCamTexture();
        webCamTexture.Play();
        imageUploader = new ImageUploader();
    }

    void Update()
    {
        if (Input.GetKeyDown(KeyCode.Space))
        {
            Debug.Log("Space key was pressed.");
            StartCoroutine(TakePhoto());
        }

        if (Input.GetKeyDown(KeyCode.Return))
        {
            Debug.Log("Return key was pressed.");
            StartCoroutine(PostImageQueryRequest(HandleResponse));
        }

        if (Input.GetKeyDown(KeyCode.I))
        {
            Debug.Log("I key was pressed.");
            imageUploader.uploadImage("/Users/xiaowenyuan/VisionAvatar/Assets/gesture.jpg");
        }
    }

    public void UpdateSegmentedText(string response){
        segmentedText = response;

    }

    public void UpdateResultText(string response)
    {
        resultText = response;
        Debug.Log(resultText);
        StartCoroutine(PostTextQueryRequest(response, HandleResponse));
    }

    IEnumerator TakePhoto() 
    {

        Debug.Log("Take Photo");

        yield return new WaitForEndOfFrame(); 

        string your_path = "/Users/xiaowenyuan/VisionAvatar/Assets/";

        Texture2D photo = new Texture2D(webCamTexture.width, webCamTexture.height);
        photo.SetPixels(webCamTexture.GetPixels());
        photo.Apply();

      
        byte[] bytes = photo.EncodeToPNG();
        File.WriteAllBytes(your_path + "gesture.jpg", bytes);

        // ImageUploader imageUploader = GetComponent<ImageUploader>();

        // imageUploader.uploadImage(your_path + "gesture.jpg");

    }

    
    private void HandleResponse(string response)
    {
        if (response != null)
        {
            Debug.Log("Response: " + response);
            AnswerDecoder.ParseResponse(response);
            Debug.Log(AnswerDecoder.GetContent());
        }
    }

    IEnumerator PostTextQueryRequest(string queryMessage, Action<string> onResponse)
    {
        var requestBody = new
        {
            model = "gpt-4",
            messages = new[]
            {
            new { role = "user", content = queryMessage }
        },
            max_tokens = 300
        };

        string json = JsonUtility.ToJson(requestBody);


        using (UnityWebRequest webRequest = new UnityWebRequest(openAIUrl, "POST"))
        {
            byte[] jsonToSend = new System.Text.UTF8Encoding().GetBytes(json);
            webRequest.uploadHandler = new UploadHandlerRaw(jsonToSend);
            webRequest.downloadHandler = new DownloadHandlerBuffer();
            webRequest.SetRequestHeader("Content-Type", "application/json");
            webRequest.SetRequestHeader("Authorization", "Bearer " + apiKey);

            yield return webRequest.SendWebRequest();

            if (webRequest.result != UnityWebRequest.Result.Success)
            {
                Debug.LogError("Error: " + webRequest.error);
                onResponse?.Invoke(null);

            }
            else
            {
                //Debug.Log("Response: " + webRequest.downloadHandler.text);
                onResponse?.Invoke(webRequest.downloadHandler.text);
            }
        }
    }

    IEnumerator PostImageQueryRequest( Action<string> onResponse)
    {
        string json = @"
        {
        ""model"": ""gpt-4-vision-preview"",
        ""messages"": [
            {
            ""role"": ""user"",
            ""content"": [
                {
                ""type"": ""text"",
                ""text"": ""What's the gesture of the wooden puppet in the image? Choose one of the options:  Agree, Greetings, Disagree. Your answer shoud be exactly one of the options. Please don't give me any extra words. Think about what humans would do if they are in one of the states. Can you pay attention to the arms of the puppet and notice what gestures this typically mean to humans?  ""
                },
                {
                ""type"": ""image_url"",
                ""image_url"": {
                    ""url"": ""https://avatarresearchimages.s3.us-west-1.amazonaws.com/greetings.jpg""
                }
                }
            ]
            }
        ],
        ""max_tokens"": 10
        }
        ";

        using (UnityWebRequest webRequest = UnityWebRequest.PostWwwForm(openAIUrl, "POST"))
        {
            byte[] jsonToSend = new System.Text.UTF8Encoding().GetBytes(json);
            webRequest.uploadHandler = new UploadHandlerRaw(jsonToSend);
            webRequest.uploadHandler.contentType = "application/json";
            webRequest.downloadHandler = new DownloadHandlerBuffer();
            webRequest.SetRequestHeader("Content-Type", "application/json");
            webRequest.SetRequestHeader("Authorization", "Bearer " + apiKey);

            yield return webRequest.SendWebRequest();

            if (webRequest.result != UnityWebRequest.Result.Success)
            {
                Debug.LogError("Error: " + webRequest.error);
                onResponse?.Invoke(null);
            }
            else
            {
                string response = webRequest.downloadHandler.text;
               
                // AvatarStateController avatarStateController = GetComponent<AvatarStateController>();
                // avatarStateController.SetAvatarState(content);
                onResponse?.Invoke(webRequest.downloadHandler.text);
            }
        }
    }


    private object[] BuildImageQueryMessages(List<string> urls)
    {
        var messages = new List<object>
        {
            new { type = "text", text = queryMessage }
        };

        foreach (var url in urls)
        {
            messages.Add(new { type = "image_url", image_url = url });
        }

        return messages.ToArray();
    }


    public string serverURL = "http://localhost:5000/upload"; // URL of the server endpoint to send the image data

    public void getImage()
    {
        StartCoroutine(CaptureAndSendScreenshot());
    }

    IEnumerator CaptureAndSendScreenshot()
    {
        // Capture a screenshot
        yield return new WaitForEndOfFrame();
        Texture2D screenTexture = ScreenCapture.CaptureScreenshotAsTexture();
        
        // Convert the texture to a byte array
        byte[] imageData = screenTexture.EncodeToPNG();

        // Save the screenshot locally (optional)
        string imagePath = "/Users/xiaowenyuan/VisionAvatar/Assets/screenshot.png";
        System.IO.File.WriteAllBytes(imagePath, imageData);
        // StartPythonServer startPythonServer = new StartPythonServer();
        // startPythonServer.StartPythonHTTPServer(imagePath);

        // Send the image data to the server
        // yield return SendImageToServer(imageData);

        Debug.Log(imagePath);
    }

    IEnumerator SendImageToServer(byte[] imageData)
    {
        using (UnityWebRequest request = UnityWebRequest.Put(serverURL, imageData))
        {
            // Set the content type to indicate that we're sending image data
            request.SetRequestHeader("Content-Type", "image/png");

            // Send the request
            yield return request.SendWebRequest();

            // Check for errors
            if (request.result == UnityWebRequest.Result.Success)
            {
                // Image data sent successfully
                Debug.Log("Image sent successfully");
            }
            else
            {
                // Log any errors
                Debug.LogError("Failed to send image: " + request.error);
            }
        }
    }
}
