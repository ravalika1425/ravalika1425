
import axios from 'axios';

const PROPERTY_PROJRCT_URL = 'https://gruhasamachar.com/api';
// const PROPERTY_PROJRCT_URL = 'http://localhost:5010/api';

// console.log(PROPERTY_PROJRCT_URL);
// const PROPERTY_PROJRCT_URL = process.env.REACT_APP_PROPERTY_PROJRCT_URL;

export const getcount = async (id: number) => {
  const resposne = await axios.get(`${PROPERTY_PROJRCT_URL}/count/${id}`);
  // console.log(resposne.data);
  return resposne.data;
}

// //post count data
// export const postcount = async (data: any) => {
//   const resposne = await axios.post(`${PROPERTY_PROJRCT_URL}/count`, data);
//   console.log(resposne.data);
//   return resposne.data; 
// }
export const postcount = async (data: any) => {
  try {
    const response = await axios.post(`${PROPERTY_PROJRCT_URL}/count`, data);
    return response.data;
  } catch (error) {
    console.error('Error posting count:', error);
    // Handle error appropriately
  }
};

// export const createCart = async (data: any) => {
//   const response = await axios.post(`${PROPERTY_PROJRCT_URL}/cart`, data);
//   return response.data;
// };