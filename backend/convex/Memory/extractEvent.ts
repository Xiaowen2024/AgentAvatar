import axios from 'axios';


export async function extractEvent(data: string) {    
  try {
    const response = await axios.post('http://localhost:8080/extractevent', {
        action: 'extract_event',
        text: "We had friends surprise us with a visit. We haven't seen them in over 2 years. We were all so excited! They are from Hawaii and it is snowing here so we got to play in the snow with them and build a snowman"
    });
    console.log(response.data);
} catch (error) {
    console.error('Error sending request:', error);
}
}