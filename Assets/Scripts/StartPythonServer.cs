using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using System.Diagnostics;

public class StartPythonServer : MonoBehaviour
{
   
    public string serverPort = "8000"; // Port for the HTTP server

    void Start()
    {
       
    }

    public void StartPythonHTTPServer(string pythonPath)
    {
        // Command to start Python HTTP server
        string command = $"-m http.server {serverPort}";

        // Create process info
        ProcessStartInfo startInfo = new ProcessStartInfo();
        startInfo.FileName = pythonPath; // Path to Python executable
        startInfo.Arguments = command; // Command-line arguments
        startInfo.UseShellExecute = true;
        startInfo.CreateNoWindow = true; // Hide the command window

        // Start the process
        Process process = new Process();
        process.StartInfo = startInfo;
        process.Start();
        
        // Log message
        UnityEngine.Debug.Log("Python HTTP server started at port " + serverPort);
    }
}

