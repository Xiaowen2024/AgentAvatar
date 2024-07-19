using UnityEngine;
using Firebase.Storage;
using System.Threading.Tasks;
using System.IO;
using System;

public class FirebaseManager : MonoBehaviour
{
    [SerializeField] private Camera cam;
    public int width = 1920;
    public int height = 1080;
    private const string FilePath = "Assets/Screenshots/screenshot.png";
    private const string StorageBucket = "gs://visionavatar-bad3f.appspot.com";

    private FirebaseStorage storage;
    private StorageReference storageRef;

    private void Start()
    {
        InitializeFirebase();
        RegisterSocketEvents();
        WSClient.Instance.OnCaptureAndUploadRequest += HandleCaptureAndUploadRequest;
    }

    private void InitializeFirebase()
    {
        storage = FirebaseStorage.DefaultInstance;
        storageRef = storage.GetReferenceFromUrl(StorageBucket);
        Debug.Log("Firebase Initialized");
    }

    private void RegisterSocketEvents()
    {
        if (WSClient.Instance != null)
        {
            WSClient.Instance.OnCaptureAndUploadRequest += HandleCaptureAndUploadRequest;
        }
        else
        {
            Debug.LogError("WSClient instance not found. Make sure it's initialized before FirebaseManager.");
        }
    }

    private async void HandleCaptureAndUploadRequest()
    {
        try
        {
            CaptureImage();
            string url = await UploadImageAsync("screenshot.png");
            WSClient.Instance.Emit("image_uploaded", url);
        }
        catch (Exception ex)
        {
            Debug.LogError($"Error in capture and upload process: {ex.Message}");
            WSClient.Instance.Emit("image_upload_error", ex.Message);
        }
    }

    private void CaptureImage()
    {
        try
        {
            RenderTexture renderTexture = new RenderTexture(width, height, 24);
            cam.targetTexture = renderTexture;
            cam.Render();

            RenderTexture.active = renderTexture;
            Texture2D snapshot = new Texture2D(width, height, TextureFormat.RGB24, false);
            snapshot.ReadPixels(new Rect(0, 0, width, height), 0, 0);
            snapshot.Apply();

            byte[] imageBytes = snapshot.EncodeToPNG();
            File.WriteAllBytes(FilePath, imageBytes);

            // Clean up
            RenderTexture.active = null;
            cam.targetTexture = null;
            Destroy(renderTexture);

            Debug.Log("Image captured and saved to: " + FilePath);
        }
        catch (Exception ex)
        {
            Debug.LogError($"Error capturing image: {ex.Message}");
            throw;
        }
    }

    private async Task<string> UploadImageAsync(string imageName)
    {
        try
        {
            StorageReference imageRef = storageRef.Child(imageName);
            var task = imageRef.PutFileAsync(FilePath);
            await task;

            if (task.IsFaulted || task.IsCanceled)
            {
                throw new Exception($"Upload failed: {task.Exception?.Message}");
            }

            Uri downloadUri = await imageRef.GetDownloadUrlAsync();
            string downloadUrl = downloadUri.ToString();
            Debug.Log($"Image uploaded. Download URL: {downloadUrl}");
            return downloadUrl;
        }
        catch (Exception ex)
        {
            Debug.LogError($"Error uploading image: {ex.Message}");
            throw;
        }
    }
}