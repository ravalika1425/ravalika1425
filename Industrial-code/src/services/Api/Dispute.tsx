import axios from 'axios';

const PROPERTY_PROJRCT_URL = 'https://gruhasamachar.com/api'
// const PROPERTY_PROJRCT_URL = 'http://localhost:5010/api';

// Create a property
export const createDispute = async (data: any) => {
    const response = await axios.post(`${PROPERTY_PROJRCT_URL}/dispute-requests`, data);
    return response.data;
};

//get dispute
export const getSingleDispute = async (did: any) => {
    const response = await axios.get(`${PROPERTY_PROJRCT_URL}/dispute-requests/${did}`);
    return response.data;
};

//get all disputes
export const getAllDispute = async () => {
    const response = await axios.get(`${PROPERTY_PROJRCT_URL}/dispute-requests-all`);
    return response.data;
};

//delete dispute
export const deleteDispute = async (did: any) => {
    const response = await axios.delete(`${PROPERTY_PROJRCT_URL}/dispute-requests/${did}`);
    return response.data;
};