using System;
using System.IO;
using System.Net;
using System.Security.Cryptography;
using System.Text;
using UnityEngine;

public class AWSUploader : MonoBehaviour
{
     private const string awsBucketName = "MyTestBucket";
    private const string awsAccessKey = "XXXxxxXXXxxx";
    private const string awsSecretKey = "XXXXxxxxxxXXXxxxXXX";
    private string awsURLBaseVirtual = "";
 
    void Start()
    {
        awsURLBaseVirtual = "https://" +
           awsBucketName +
           ".s3.amazonaws.com/";
    }
    public void UploadFileToAWS3(string FileName, string FilePath)
    {
        string currentAWS3Date =  
            System.DateTime.UtcNow.ToString(
                "ddd, dd MMM yyyy HH:mm:ss ") +
                "GMT";
        string canonicalString =
            "PUT\n\n\n\nx-amz-date:" +
            currentAWS3Date + "\n/" +
            awsBucketName + "/" + FileName;
        UTF8Encoding encode = new UTF8Encoding();
        HMACSHA1 signature = new HMACSHA1();
        signature.Key = encode.GetBytes(awsSecretKey);
        byte[] bytes = encode.GetBytes(canonicalString);
        byte[] moreBytes = signature.ComputeHash(bytes);
        string encodedCanonical = Convert.ToBase64String(moreBytes);
        string aws3Header = "AWS " +
            awsAccessKey + ":" +
            encodedCanonical;
        string URL3 = awsURLBaseVirtual + FileName;
        WebRequest requestS3 = 
           (HttpWebRequest)WebRequest.Create(URL3);
        requestS3.Headers.Add("Authorization", aws3Header);
        requestS3.Headers.Add("x-amz-date", currentAWS3Date);
        byte[] fileRawBytes = File.ReadAllBytes(FilePath);
        requestS3.ContentLength = fileRawBytes.Length;
        requestS3.Method = "PUT";
        Stream S3Stream = requestS3.GetRequestStream();
        S3Stream.Write(fileRawBytes, 0, fileRawBytes.Length);
        Debug.Log("Sent bytes: " +
            requestS3.ContentLength +
            ", for file: " +
            FileName);
        S3Stream.Close();
    }
}
