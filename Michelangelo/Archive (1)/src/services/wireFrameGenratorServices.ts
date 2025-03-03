import { WIREFRAME_EDITOR, WIREFRAME_GENERATE, WIREFRAME_LAYOUT, WIREFRAME_REPHRASE } from "Mike/constants";
import { axiosInstance } from "Mike/utils/axiosConfig";
import axios from "axios";

export async function generateWireFrame(payload:any){
    const cancelTokenSource = axios.CancelToken.source();
    const response = await axiosInstance.post(WIREFRAME_GENERATE, payload,{ cancelToken: cancelTokenSource.token });
    return response;
}

export async function rephraseWireFrame(payload:any){
    const response = await axiosInstance.post(WIREFRAME_REPHRASE, payload);
    return response;   
}

export async function editWireFrame(payload:any){
    const response = await axiosInstance.post(WIREFRAME_EDITOR,payload);
    return response;
}

export async function getWireFrameLayout(payload:any){
    const response = await axiosInstance.post(WIREFRAME_LAYOUT,payload);
    return response;
}


