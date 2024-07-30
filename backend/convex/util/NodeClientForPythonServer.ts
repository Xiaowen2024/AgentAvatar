import axios from 'axios';


export async function extractEvent(data: string) {    
  try {
    const response = await axios.post('http://127.0.0.1:8080/extractevent', data);
    console.log('Extracted Event:', response.data.result);
    return response.data.result;
  } catch (error : any) {
    console.error('Error:', error.response ? error.response.data : error.message);
  }
}