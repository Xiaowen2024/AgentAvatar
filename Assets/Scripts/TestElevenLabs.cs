using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class TestElevenLabsUI : MonoBehaviour
{

    public Button sendButton;
    public InputField inputField;
    public ElevenLabsAPIManager tts;

    void Start()
    {
        // Add the PlayClip handler to the ElevenLabsAPI script
        tts.AudioReceived.AddListener(PlayClip);

        // Add the Button's onClick handler 
        sendButton.onClick.AddListener(() => {
            tts.GetAudio("hello");
            //inputField.text = "HELLO";
        });
    }

    public void PlayClip(AudioClip clip)
    {
        AudioSource.PlayClipAtPoint(clip, Camera.main.transform.position);
    }
}