import React, { useState, useRef } from 'react';
import { Hume, HumeClient } from 'hume';
import {
    convertBlobToBase64,
    ensureSingleValidAudioTrack,
    getAudioStream,
    getBrowserSupportedMimeType,
  } from 'hume';

  import ChatStage from './ChatStage';

const client = new HumeClient({
  apiKey: "dmP6kn5we7fDRfD6J5Klo0KbydA836oMx8Y2P5mhaT2T2xld",
  secretKey: "Nuz5DmApP4nLfRoIdVRmZEtuFzGOMpBRtPSW3rmLS3RIYaap9c0zqncWsOTW59do"
});

const socket = await client.empathicVoice.chat.connect({
    configId: "17dacf14-8e5a-4a74-990c-289b00eb3b9b",
  });

  
  // the recorder responsible for recording the audio stream to be prepared as the audio input
  let recorder: MediaRecorder | null = null;
  
  // the stream of audio captured from the user's microphone
  let audioStream: MediaStream | null = null;
  
  // mime type supported by the browser the application is running in
  const mimeType: MimeType = (() => {
    const result = getBrowserSupportedMimeType();
    return result.success ? result.mimeType : MimeType.WEBM;
  })();
  
  // define function for capturing audio
  async function captureAudio(): Promise<void> {
    // prompts user for permission to capture audio, obtains media stream upon approval
    audioStream = await getAudioStream();
  
    // ensure there is only one audio track in the stream
    ensureSingleValidAudioTrack(audioStream);
  
    // instantiate the media recorder
    recorder = new MediaRecorder(audioStream, { mimeType });
  
    // callback for when recorded chunk is available to be processed
    recorder.ondataavailable = async ({ data }) => {
      // IF size of data is smaller than 1 byte then do nothing
      if (data.size < 1) return;
  
      // base64 encode audio data
      const encodedAudioData = await convertBlobToBase64(data);
  
      // define the audio_input message JSON
      const audioInput: Omit<Hume.empathicVoice.AudioInput, 'type'> = {
        data: encodedAudioData,
      };
  
      // send audio_input message
      socket?.sendAudioInput(audioInput);
    };
  
    // capture audio input at a rate of 100ms (recommended for web)
    const timeSlice = 100;
    recorder.start(timeSlice);
  }
  
  // define a WebSocket open event handler to capture audio
  async function handleWebSocketOpenEvent(): Promise<void> {
    // place logic here which you would like invoked when the socket opens
    console.log('Web socket connection opened');
    await captureAudio();
  }
  
  