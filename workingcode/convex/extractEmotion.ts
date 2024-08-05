import axios from 'axios';


export async function extractEmotion(data: string) {    
  try {
    const response = await axios.post('http://localhost:8080/extractemotion', {
        action: 'extract_emotion',
        text: data
    });
    console.log(response.data);
    return response.data;
} catch (error) {
    console.error('Error sending request:', error);
    }
}