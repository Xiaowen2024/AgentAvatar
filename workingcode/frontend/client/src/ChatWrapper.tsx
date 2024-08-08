// import { fetchAccessToken } from '@humeai/voice';
// import { VoiceProvider } from '@humeai/voice-react';
// import { useEffect, useState } from 'react';
// import ChatStage from './ChatStage.tsx';
// import React from 'react';

// function Chat() {
//   const [accessToken, setAccessToken] = useState('');

//   useEffect(() => {
//     const fetchToken = async () => {
//       // make sure to set these environment variables
//       const apiKey = "dmP6kn5we7fDRfD6J5Klo0KbydA836oMx8Y2P5mhaT2T2xld" || '';
//       const secretKey = "Nuz5DmApP4nLfRoIdVRmZEtuFzGOMpBRtPSW3rmLS3RIYaap9c0zqncWsOTW59do" || '';

//       const token = (await fetchAccessToken({ apiKey, secretKey })) || '';

//       setAccessToken(token);
//     };

//     fetchToken();
//   }, []);

//   return (
//     <>
//       <VoiceProvider
//         auth={{ type: 'accessToken', value: accessToken }}
//         configId={'17dacf14-8e5a-4a74-990c-289b00eb3b9b'} // set your configId here
//       >
//         <ChatStage />
//       </VoiceProvider>
//     </>
//   );
// }

// export default Chat;
