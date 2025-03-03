import { ApiHelper } from "./apiHelper";
import { isProd } from "Mike/utils/axiosInstance_";

export const ApiService = async (endpoint: string, payload : any) => {
  try {
    if (isProd) {
      return await ApiHelper.post(endpoint, 
        payload);
    } else {
      return await ApiHelper.get(endpoint);
    }
  } catch (error) {
    throw error;
  }
};
