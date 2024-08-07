import { useVoice } from '@humeai/voice-react';
import React from 'react';
import { match } from 'ts-pattern';
import { fetchAccessToken } from '@humeai/voice';
import { VoiceProvider } from '@humeai/voice-react';
import { useEffect, useState } from 'react';
/**
 * Main view for displaying the avatars and conversation
 */
const ChatStage: React.FC = () => {
  const { connect, disconnect, status } = useVoice();
  const [accessToken, setAccessToken] = useState('');

  useEffect(() => {
    const fetchToken = async () => {
      // make sure to set these environment variables
      const apiKey = "dmP6kn5we7fDRfD6J5Klo0KbydA836oMx8Y2P5mhaT2T2xld" || '';
      const secretKey = "Nuz5DmApP4nLfRoIdVRmZEtuFzGOMpBRtPSW3rmLS3RIYaap9c0zqncWsOTW59do" || '';

      const token = (await fetchAccessToken({ apiKey, secretKey })) || '';

      setAccessToken(token);
    };

    fetchToken();
  }, []);

  const handleConnect = () => {
    if (status.value === 'connected') {
      disconnect();
      return;
    }
    void connect()
      .then(() => {})
      .catch((e) => {
        console.error(e);
      });
  };

  return (
    <>
      <VoiceProvider
        auth={{ type: 'accessToken', value: accessToken }}
        configId={'17dacf14-8e5a-4a74-990c-289b00eb3b9b'} // set your configId here
      >
        <div className="font-nationalPark absolute inset-0 size-full bg-blue-50 flex flex-col justify-center items-center">
          <h1 className="absolute top-6 text-4xl font-bold">MindMeld</h1>
          <div>
            {match(status.value)
              .with('error', () => {
                return (
                  <div>
                    <p>Something went wrong</p>
                    <button onClick={() => handleConnect()}>Try again</button>
                  </div>
                );
              })
              .with('disconnected', 'connecting', () => {
                return <div></div>;
              })
              .with('connected', () => {
                return (
                  <div>
                    {/* Avatars removed */}
                  </div>
                );
              })
              .exhaustive()}
          </div>
          <button
            onClick={() => handleConnect()}
            className="absolute bottom-12 w-48 bg-blue-200 px-6 py-4 rounded-full 9 font-bold border-4 border-black text-xl hover:bg-blue-200/60 transition"
          >
            {status.value === 'connected' ? 'End chat' : 'Start chat!'}
          </button>
        </div>
      </VoiceProvider>
    </>
  );
};

export default ChatStage;