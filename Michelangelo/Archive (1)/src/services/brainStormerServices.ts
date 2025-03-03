import { axiosInstance } from 'Mike/utils/axiosConfig';
import { ADD_BRAINSTORMER_ENDPOINT, GET_BRAINSTORMER_ENDPOINT, MLO_SERVER, PRODUCT_RESEARCH,REGENRATE_BRAINSTORMER_ENDPOINT, UPDATE_BRAINSTORMER_ENDPOINT, UPDATE_DESIGN_SYSTEM_ENDPOINT } from 'Mike/constants';
import { BrainstormerRequest } from 'Mike/models/response';
import { AddPayload, EditPayload, EmailPayload } from 'Mike/models/playResponse';
export async function regenarateBrainStormer(payload:any) {
    const response = await axiosInstance.post(REGENRATE_BRAINSTORMER_ENDPOINT, payload)
    return response
}
export async function getBrainStormer(payload:BrainstormerRequest){
    const response  = await axiosInstance.post(PRODUCT_RESEARCH,payload);
    return response;
}
    
export async function reloadBrainStormer(payload:BrainstormerRequest){

    const response = await axiosInstance.post( PRODUCT_RESEARCH, payload)
    return response;
}

export async function updateBrainStormer(payload:EditPayload){
    const response = await axiosInstance.post(UPDATE_BRAINSTORMER_ENDPOINT, payload);
    return response;
}

export async function createBrainStormer(payload:AddPayload){

    const response = await axiosInstance.post(ADD_BRAINSTORMER_ENDPOINT,payload);
    return response;
}    


export async function getBrainStormerData(params: any) {
    const response = await axiosInstance.get(GET_BRAINSTORMER_ENDPOINT, { params });
    return response;
  }

  export async function fetchBrainstormerProjects(payload: EmailPayload) {

    const response  = await axiosInstance.post(MLO_SERVER + GET_BRAINSTORMER_ENDPOINT,payload);
    return response;

  }


  export async function updateDesignSystem(payload:any){
    const response = await axiosInstance.put(`${UPDATE_DESIGN_SYSTEM_ENDPOINT}/${payload}`);
    return response;
  }

  export async function createDesignSystem(payload:any){
    const response = await axiosInstance.post(UPDATE_DESIGN_SYSTEM_ENDPOINT,payload);
    return response
  }

  export async function DeleteDesignSystem(payload:any){
    axiosInstance.delete(`${UPDATE_DESIGN_SYSTEM_ENDPOINT}/${payload}`);
  }

  export async function fetchDesignSystem(){
    const response = await axiosInstance.get(UPDATE_DESIGN_SYSTEM_ENDPOINT);
    return response ;
  }