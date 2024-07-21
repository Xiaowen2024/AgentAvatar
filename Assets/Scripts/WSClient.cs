using System;
using System.Collections.Generic;
using SocketIOClient;
using SocketIOClient.Newtonsoft.Json;
using UnityEngine;
using UnityEngine.UI;
using Newtonsoft.Json.Linq;

public class WSClient : MonoBehaviour
{

    public static WSClient Instance { get; private set; }
    public SocketIOUnity socket;
    public event Action OnCaptureAndUploadRequest;

    void Start()
    {
        var uri = new Uri("http://localhost:8080");
        socket = new SocketIOUnity(uri, new SocketIOOptions
        {
            Query = new Dictionary<string, string>
                {
                    {"token", "UNITY" }
                }
            ,
            EIO = 4
            ,
            Transport = SocketIOClient.Transport.TransportProtocol.WebSocket
        });

        socket.JsonSerializer = new NewtonsoftJsonSerializer();

       
        socket.OnConnected += (sender, e) =>
        {
            Debug.Log("socket.OnConnected");
        };
       
        socket.OnDisconnected += (sender, e) =>
        {
            Debug.Log("disconnect: " + e);
        };

        socket.OnReconnectAttempt += (sender, e) =>
        {
            Debug.Log($"{DateTime.Now} Reconnecting: attempt = {e}");
        };

        Debug.Log("Connecting...");
        socket.Connect();


        // ReceivedText.text = "";
        // socket.OnAnyInUnityThread((name, response) =>
        // {
        //     ReceivedText.text += "Received On " + name + " : " + response.GetValue().GetRawText() + "\n";
        // });


        socket.On("capture_and_upload", (response) =>
        {
            OnCaptureAndUploadRequest?.Invoke();
        });
    }

    
    public void Emit(string eventName, string data)
    {
        if (socket == null)
        {
            Debug.LogError("Socket is null. Make sure it's initialized before calling Emit.");
            return;
        }
        socket.Emit(eventName, data);
    }



    void Update()
    {
        if (Input.GetKeyDown(KeyCode.W))
        {
            // // socket.EmitStringAsJSON("hello", "Hello from Unity");
            // // socket.EmitStringAsJSON("hello", "Hello from Unity");
            // socket.Emit("message", "Hello from Unity");
            TextInputSerializationHandler TextInputSerializationHandler = GetComponent<TextInputSerializationHandler>();
            TextInputSerializationHandler.SerializedTextInput serializedTextInput = new TextInputSerializationHandler.SerializedTextInput("t:1", "p:1", "u:1", "2024-07-05T00:08:10Z", "Hello from Unity");
            TextInputSerializationHandler.SerializedTextInput[] input = new TextInputSerializationHandler.SerializedTextInput[]{
                serializedTextInput
            };
            Debug.Log("Socket is null: " + (socket == null) );
            socket.Emit("message", socket.JsonSerializer.Serialize(input));
            Debug.Log("Sending Message");
        }
    }

    private void OnDestroy()
    {
        if (socket != null)
        {
            socket.Disconnect();
        }
    }
}