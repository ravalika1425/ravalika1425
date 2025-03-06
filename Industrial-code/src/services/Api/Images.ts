import axios from 'axios';

const PROPERTY_PROJRCT_URL = 'https://gruhasamachar.com/api';
// const PROPERTY_PROJRCT_URL = 'http://localhost:5010/api';

// create image account
export const createImage = async (data: any) => {
  const response = await axios.post(`${PROPERTY_PROJRCT_URL}/images`, data);
  return response.data;
};

//get image account with property_id
export const getImage = async (id: string) => {
  const response = await axios.get(`${PROPERTY_PROJRCT_URL}/images/properties/${id}`);
  return response.data;
};

//update image account with property_id
export const updateImage = async (id: string, data: any) => {
  const response = await axios.put(`${PROPERTY_PROJRCT_URL}/images/update/${id}`, data);
  return response.data;
};

//delete image account with property_id
export const deleteImage = async (id: string) => {
  const response = await axios.delete(`${PROPERTY_PROJRCT_URL}/images/delete/${id}`);
  return response.data;
};

