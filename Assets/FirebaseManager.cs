using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.Networking;
using Firebase.Database;
using Firebase;
using System.Threading.Tasks;
using Firebase.Storage;
using Firebase;
using Firebase.Database;
using Firebase.Extensions;
using System.IO;
using System;
    
    public class FirebaseManager : MonoBehaviour
    {
        private DatabaseReference dbReference;
        [SerializeField] 
        private Camera cam;
        public int width = 1920;
        public int height = 1080;
        public string filePath = "Assets/Screenshots/screenshot.png";
        FirebaseStorage storage;

        // Create a storage reference from our storage service
        StorageReference storageRef;

        async void Start()
        {
            // Debug.Log("Starting Firebase");
            // FirebaseApp.CheckAndFixDependenciesAsync().ContinueWith(task => {
            //     if (task.Result == DependencyStatus.Available)
            //     {
            //         Debug.Log("Firebase Dependencies are available");
            //         InitializeFirebase();
            //     }
            //     else
            //     {
            //         Debug.LogError("Could not resolve all Firebase dependencies: " + task.Result);
            //     }
            // });

            storage = FirebaseStorage.DefaultInstance;
            storageRef = storage.GetReferenceFromUrl("gs://visionavatar-bad3f.appspot.com");
            
            string url = await UploadImageAsync(filePath, "screenshot.png");
        }

        public async Task<string> UploadImageAsync(string localFile, string imageName)
        {
            try
            {
                // Create a reference to the file you want to upload
                StorageReference imageRef = storageRef.Child(imageName);

                // Upload the file to the path "images/rivers.jpg"
                StorageMetadata metadata = await imageRef.PutFileAsync(localFile);

                string md5Hash = metadata.Md5Hash;
                Debug.Log("Finished uploading...");
                Debug.Log("md5 hash = " + md5Hash);

                // If you need the download URL
                string downloadUrl = await imageRef.GetDownloadUrlAsync().ContinueWith(task =>
                {
                    if (task.IsFaulted)
                    {
                        Debug.LogError("Failed to fetch download URL: " + task.Exception);
                        return null;
                    }

                    return task.Result.ToString();
                });
                Debug.Log("Download URL: " + downloadUrl);

                return downloadUrl; // If you want to return the URL
            }
            catch (Exception ex)
            {
                Debug.LogError("An error occurred: " + ex.Message);
                throw; // Re-throw the exception if you want to handle it further up the call stack
            }
        }

        public void CaptureImage()
        {
            
            try
            {
                RenderTexture renderTexture = new RenderTexture(width, height, 24);
                cam.targetTexture = renderTexture;
                RenderTexture.active = renderTexture;
                cam.Render();
                Debug.Log("Camera Render");
                Texture2D snapshot = new Texture2D(width, height, TextureFormat.RGB24, false);
                snapshot.ReadPixels(new Rect(0, 0, width, height), 0, 0);
                snapshot.Apply();
                // cam.targetTexture = null;
                // RenderTexture.active = null;
                // Destroy(renderTexture);
                byte[] imageBytes = snapshot.EncodeToPNG();
                // File.WriteAllBytes(filePath, imageBytes);
                System.IO.File.WriteAllBytes(filePath, imageBytes);
                Debug.Log("Image saved to: " + filePath);
                // string fileName = "image_" + DateTime.Now.ToString("yyyyMMddHHmmss") + ".png";
                // StorageReference imageRef = FirebaseStorage.DefaultInstance.GetReference("images/" + fileName);
                // StorageMetadata metadata = await imageRef.PutBytesAsync(imageBytes);
                // Debug.Log("Image uploaded successfully");
                // Uri downloadUrl = await imageRef.GetDownloadUrlAsync();
                // Debug.Log("Download URL: " + downloadUrl);
            }
            catch (Exception ex)
            {
                Debug.LogError("An error occurred: " + ex.Message);
            }
        }

        private void InitializeFirebase()
        {
            Debug.Log("Firebase Initialized");
            dbReference = FirebaseDatabase.DefaultInstance.RootReference;
        }

        


    }

