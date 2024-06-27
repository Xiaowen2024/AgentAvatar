using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class AvatarGenerationManager : MonoBehaviour
{
    // Start is called before the first frame update
    void Start()
    {
        avatarPrefabs.Add("standing still", standingStillPrefab);
        avatarPrefabs.Add("walking", walkingPrefab);
        avatarPrefabs.Add("waving hands", wavingHandsPrefab);
        avatarPrefabs.Add("raising hands up", raisingHandsUpPrefab);
        avatarPrefabs.Add("raising hands to the sides", raisingHandsToTheSidesPrefab);
    }

    // Update is called once per frame
    void Update()
    {
        
    }


    private void initializeAvatarPrefabs()
    {
        // Initialize the dictionary in Start or Awake to ensure prefabs are assigned
        avatarPrefabs.Add("standing still", standingStillPrefab);
        avatarPrefabs.Add("walking", walkingPrefab);
        avatarPrefabs.Add("waving hands", wavingHandsPrefab);
        avatarPrefabs.Add("raising hands up", raisingHandsUpPrefab);
        avatarPrefabs.Add("raising hands to the sides", raisingHandsToTheSidesPrefab);
    }
   

    public GameObject standingStillPrefab;
    public GameObject walkingPrefab;
    public GameObject wavingHandsPrefab;
    public GameObject raisingHandsUpPrefab;
    public GameObject raisingHandsToTheSidesPrefab;

    public Dictionary<string, GameObject> avatarPrefabs = new Dictionary<string, GameObject>();
    

    public bool isAvatarType(string type){
        Debug.Log(type);
        List<string> keys = new List<string>(avatarPrefabs.Keys);
        Debug.Log(keys.Count);
        return avatarPrefabs.ContainsKey(type);
    }


    public void generateAvatars (string responseContent){
        initializeAvatarPrefabs();
        if (!isAvatarType(responseContent)){
            Debug.Log("Invalid avatar type");
            return;
        }

        GameObject avatarPrefab = GameObject.Find("Cube");

        Instantiate(avatarPrefab, new Vector3(0, 0, 0), Quaternion.identity);

    }

}
