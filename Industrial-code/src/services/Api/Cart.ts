import axios from 'axios';

const PROPERTY_PROJRCT_URL = 'https://gruhasamachar.com/api';
// const PROPERTY_PROJRCT_URL = 'http://localhost:5010/api';

// create cart account
export const createCart = async (data: any) => {
  const response = await axios.post(`${PROPERTY_PROJRCT_URL}/cart`, data);
  return response.data;
};

//add property to cart
export const addPropertyToCart = async (id: any, data: any) => {
  const response = await axios.post(`${PROPERTY_PROJRCT_URL}/add-count`, data);
  return response.data;
};

//delete cart account
export const deleteCart = async (id: any) => {
  const response = await axios.delete(`${PROPERTY_PROJRCT_URL}/cart-delete/${id}`);
  return response.data;
};

// get cart account with property_id
export const getCart = async (id: any) => {
  const response = await axios.get(`${PROPERTY_PROJRCT_URL}/getcount/${id}`);
  return response.data;
};

//get cart account with user_id
export const getCartByUserId = async (userid: any) => {
  const response = await axios.get(`${PROPERTY_PROJRCT_URL}/cart/${userid}`);
  return response.data;
};