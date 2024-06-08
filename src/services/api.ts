import axios from 'axios';

const API_URL = '/sample-data.json';

export const fetchActivityData = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching data', error);
    throw error;
  }
};
