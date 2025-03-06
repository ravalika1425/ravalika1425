import axios from 'axios';

const PROPERTY_PROJRCT_URL = 'https://gruhasamachar.com/api';
// const PROPERTY_PROJRCT_URL = 'http://localhost:5010/api';

//create event account
export const createEvent = async (data: any) => {
  const response = await axios.post(`${PROPERTY_PROJRCT_URL}/events`, data);
  return response.data;
};

//get all event account
export const getEvents = async () => {
  const response = await axios.get(`${PROPERTY_PROJRCT_URL}/event-list`);
  return response.data;
};

//get event account
export const getEvent = async (id: string) => {
  console.log(PROPERTY_PROJRCT_URL);
  const response = await axios.get(`${PROPERTY_PROJRCT_URL}/event/${id}`);
  return response.data;
  console.log(response.data);
};

// delete event account
export const deleteEvent = async (id: string) => {
  const response = await axios.delete(`${PROPERTY_PROJRCT_URL}/event-delete/${id}`);
  return response.data;
};

