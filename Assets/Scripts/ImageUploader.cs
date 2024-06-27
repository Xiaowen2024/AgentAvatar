using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using Firebase.Storage;
using Firebase;
using System.Threading.Tasks;


public class ImageUploader : MonoBehaviour
{
    
    public void uploadImage(string localFile){
        FirebaseStorage storage = FirebaseStorage.DefaultInstance;

        StorageReference storageRef = storage.GetReferenceFromUrl("gs://visionavatar-bad3f.appspot.com");


        StorageReference imagesRef = storageRef.Child("images");


         StorageReference gestureRef = imagesRef.Child("gesture.jpg");

        // Upload the file to the path 
        gestureRef.PutFileAsync(localFile)
            .ContinueWith((Task<StorageMetadata> task) => {
                if (task.IsFaulted || task.IsCanceled) {
                    Debug.Log(task.Exception.ToString());
                }
                else {
                    StorageMetadata metadata = task.Result;
                    string md5Hash = metadata.Md5Hash;
                    Debug.Log("Finished uploading...");
                    Debug.Log("md5 hash = " + md5Hash);
                }
            });
        }
    }

