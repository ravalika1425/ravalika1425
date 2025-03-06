import axios from 'axios';

// const PROPERTY_PROJRCT_URL = process.env.REACT_APP_PROPERTY_PROJRCT_URL;

// const PROPERTY_PROJRCT_URL = 'http://localhost:5010/api';
const PROPERTY_PROJRCT_URL = 'https://gruhasamachar.com/api'



// Get all properties admin approved properties for seller(all)
// export const getProperties = async () => {
//   // /properties/admin/approve-properties
//   const response = await axios.get(`${PROPERTY_PROJRCT_URL}/properties/admin/approve-properties`);
//   return response.data;

// };

interface Filters {
  property_type?: string;
  status?: string;
  price?: string;
  address?: string;
}

export const getProperties = async (filters?: Filters): Promise<any> => {
  try {
    // Build query string only if filters are provided
    const queryParams = filters && Object.keys(filters).length > 0
      ? `?${new URLSearchParams(filters as Record<string, string>).toString()}`
      : "";

    const response = await axios.get(`${PROPERTY_PROJRCT_URL}/properties/admin/approve-properties${queryParams}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching properties:", error);
    throw error;
  }
};

// Get Property By Type this for seller(all)
export const getPropertyByType = async (type: any) => {
  const response = await axios.get(`${PROPERTY_PROJRCT_URL}/admin/approve-properties/${type}`);
  return response.data;
};


// Get a single property for seller(all)
export const getProperty = async (id: number | string) => {
  const response = await axios.get(`${PROPERTY_PROJRCT_URL}/property/${id}`);
  return response.data;
};

// Create a property
// export const createProperty = async (userid: any, data: any, options?: any) => {
//   const response = await axios.post(`${PROPERTY_PROJRCT_URL}/property/${userid}`, data, options);
//   return response.data;
// };


export const createProperty = async (userid: any, data: any) => {
  // const response = await axios.post(`${PROPERTY_PROJRCT_URL}/property/${userid}`, data, {
  const response = await axios.post(`${PROPERTY_PROJRCT_URL}/property/${userid}`, data, {

    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const getusertypeproperties = async (prop_type: string, userid: any) => {
  const response = await axios.get(`${PROPERTY_PROJRCT_URL}/user/properties/${prop_type}/${userid}`);
  return response.data;
};

// Update a property
export const updateProperty = async (userid: any, property_id: any, data: any) => {
  const response = await axios.put(`${PROPERTY_PROJRCT_URL}/property/${property_id}/${userid}`, data);
  return response.data;
};

// Delete a property
export const deleteProperty = async (userid: any, property_id: any) => {
  const response = await axios.delete(`${PROPERTY_PROJRCT_URL}/property/${property_id}/${userid}`);
  return response.data;
};


//admin get all properties list which is not approved
export const getAdminAllProperties = async (prop_type: string) => {
  const response = await axios.get(`${PROPERTY_PROJRCT_URL}/admin/property-list/${prop_type}`);
  return response.data;
};

//to approve property

export const approveProperty = async (propertyId: any, payload: any) => {
  const response = await axios.post(`${PROPERTY_PROJRCT_URL}/admin/approve-property/${propertyId}`, payload);
  return response.data;
};
//
// Payload={
//   "reviewed_by" : "APPROVED"
// }
// APPROVED = "APPROVED"
//     REJECTED = "REJECTED"
//     UNDERREVIEW = "UNDERREVIEW"
//     PENDING = "PENDING"

