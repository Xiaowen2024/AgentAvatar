using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using System.Text;
using System.Net.Sockets;
using System;
using UnityEngine.Events;

public class NetworkManager : MonoBehaviour
{
    private TcpClient client;
    private NetworkStream stream;

 

    void Start()
    {
        
      
    }

    void Update()
    {
        if (Input.GetKeyDown(KeyCode.E)){
            ConnectToServer();
        }
    }


    void ConnectToServer()
    {
        try
        {
            client = new TcpClient("localhost", 50000);
            stream = client.GetStream();
            Debug.Log("Connected to server");
            RequestEmotionLabel("EmotionRequest");
            string emotionLabel = ReceiveEmotionLabel();
            EventHandler.OnEmotionReceived.Invoke(emotionLabel);
            Debug.Log("Received emotion label: " + emotionLabel);
            stream.Close();
            client.Close();
        }
        catch (Exception e)
        {
            Debug.LogError("Socket exception: " + e);
        }
    }

    public void RequestEmotionLabel(string message)
    {
        if (stream == null)
        {
            Debug.LogError("Network stream is not available");
        }
     

        byte[] data = Encoding.UTF8.GetBytes(message);
        stream.Write(data, 0, data.Length);
    }

    string ReceiveEmotionLabel()
    {
        if (stream == null)
        {
            Debug.LogError("Network stream is not available");
        }


        byte[] data = new byte[1024];
        stream.Read(data, 0, data.Length);
        return Encoding.UTF8.GetString(data);


    }
}
