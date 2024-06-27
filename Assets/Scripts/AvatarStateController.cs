using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using Inworld.Packet;
using Inworld.Assets;
using Inworld.Sample.RPM;

public class AvatarStateController : MonoBehaviour
{
    [SerializeField] Animator m_BodyAnimator;

    static readonly int s_Emotion = Animator.StringToHash("Emotion");
    static readonly int s_Gesture = Animator.StringToHash("Gesture");
    Dictionary<string, int> avatarStates = new Dictionary<string, int>
    {
        {"Agree", 2},
        {"Disagree", 7},
        {"Greetings", 13},
        {"Confused", 6}
    };
    void setGesture(int gesture)
    {
        
        m_BodyAnimator.SetInteger(s_Gesture, gesture);
    }

    void setEmotion(int emotion)
    {
        m_BodyAnimator.SetInteger(s_Emotion, emotion);
    }

    public void SetAvatarState(string state)
    {
        if (avatarStates.ContainsKey(state))
        {
           
            setGesture(avatarStates[state]);
        }
    }
}

