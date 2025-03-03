
import { axiosInstance_switch } from "Mike/utils/axiosInstance_";

export class ApiHelper {
  static async post(endpoint: string, payload: any) {
    try {
      return await axiosInstance_switch.post(endpoint, payload);
    } catch (error) {
      throw error;
    }
  }

  static async get(endpoint: string) {
    try {
      return await axiosInstance_switch.get(endpoint);
    } catch (error) {
      throw error;
    }
  }
}
