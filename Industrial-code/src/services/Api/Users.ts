import axios from 'axios';

const PROPERTY_PROJRCT_URL = 'https://gruhasamachar.com/api';
// const PROPERTY_PROJRCT_URL = 'http://localhost:5010/api';

// create user account
export const createUser = async (data: any) => {
  const response = await axios.post(`${PROPERTY_PROJRCT_URL}/user`, data);
  return response.data;
};

//get user account
export const getUser = async (id: string) => {
  const response = await axios.get(`${PROPERTY_PROJRCT_URL}/user-get/${id}`);
  return response.data;
};

//update user account
export const updateUser = async (id: string, data: any) => {
  const response = await axios.put(`${PROPERTY_PROJRCT_URL}/user-update/${id}`, data);
  return response.data;
};

//delete user account
export const deleteUser = async (id: string) => {
  const response = await axios.delete(`${PROPERTY_PROJRCT_URL}/user-delete/` + id);
  return response.data;
};

// get all users
export const getUsers = async () => {
  const response = await axios.get(`${PROPERTY_PROJRCT_URL}/user-list`);
  return response.data;
};

//
export const getUserData = async (queryParams: Record<string, string>) => {
  try {
    // Construct the query string from the queryParams object
    const queryString = new URLSearchParams(queryParams).toString();

    // Make the API call with query parameters
    const response = await axios.get(`${PROPERTY_PROJRCT_URL}/user-get-data?${queryString}`);

    // Return the API response data
    return response.data;
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
};

// user Login Url
export const userLogin = async (data: any) => {
  const response = await axios.post(`${PROPERTY_PROJRCT_URL}/user-login`, data);
  return response.data;
};

//forgot password
export const forgotPassword = async (data: any) => {
  const response = await axios.post(`${PROPERTY_PROJRCT_URL}/forgot-password`, data);
  return response.data;
};

//reset password
export const resetPassword = async (token: string, data: any) => {
  const response = await axios.post(`${PROPERTY_PROJRCT_URL}/reset-password/${token}`, data);
  return response.data;
};

//get user all properties
export const getUserAllProperties = async (userid: any) => {
  const response = await axios.get(`${PROPERTY_PROJRCT_URL}/user/properties/${userid}`);
  return response.data;
};

//get user role data this is used by admin page
export const getUserRoles = async (role_type: any) => {
  const response = await axios.get(`${PROPERTY_PROJRCT_URL}/user/role/${role_type}`);
  return response.data;
};

//get user single property with user id
export const getUserSingleProperties = async (userid: any, property_id: any) => {
  const response = await axios.get(`${PROPERTY_PROJRCT_URL}/user/${userid}/properties/${property_id}`);
  return response.data;
};

// emain otp login user, for both(Buyer and seller)--->send otp api
export const sendOtp = async (data: any) => {
  const response = await axios.post(`${PROPERTY_PROJRCT_URL}/send-otp`, data);
  return response.data;
};

//validate otp for email login user, for both(Buyer and seller)--> validate otp api 
export const validateOtp = async (data: any) => {
  const response = await axios.post(`${PROPERTY_PROJRCT_URL}/validate-otp`, data);
  return response.data;
};