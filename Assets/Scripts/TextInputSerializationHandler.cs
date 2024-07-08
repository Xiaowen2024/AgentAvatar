using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class TextInputSerializationHandler : MonoBehaviour
{
    [System.Serializable]
    public class SerializedTextInput
    {
        public string id;
        public string creator;
        public string user;
        public string created;
        public string input;

       // Constructor 
        public SerializedTextInput(string id, string creator, string user, string created, string input)
        {
            this.id = id;
            this.creator = creator;
            this.user = user;
            this.created = created;
            this.input = input;
        }
       
    }
}
