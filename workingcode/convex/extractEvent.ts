import axios from 'axios';


export async function extractEvent(data: string) {    
  try {
    const response = await axios.post('http://localhost:8080/extractevent', {
        action: 'extract_event',
        text: data
    });
    console.log(response.data);
    return response.data;
} catch (error) {
    console.error('Error sending request:', error);
}
}