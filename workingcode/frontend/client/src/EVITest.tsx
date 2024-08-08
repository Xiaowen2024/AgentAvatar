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

