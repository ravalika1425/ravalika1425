import { ADD_IMAGE_TO_CODE, DELETE_IMAGE_TO_CODE, EDIT_IMAGE_TO_CODE, GENERATE_IMAGE, GET_IMAGE_TO_CODE, GET_SCREENSHOT, IMAGE_TO_CODE, IMAGE_TO_CODE_CONVERT} from "Mike/constants";
import { axiosInstance } from "Mike/utils/axiosConfig";
import axios
 from "axios";

export async function getScreenshot(payload:any){
    const source = axios.CancelToken.source();
    const response = await axiosInstance.post(GET_SCREENSHOT,payload,{cancelToken:source.token});;
    return response;
}

export async function getImageToCode(endpoint:string,payload:any){
    const response = await axiosInstance.post(endpoint, payload);
    return response ;

}

export async function getCodeForEditImage(payload:any){
    const response = await axiosInstance.post(IMAGE_TO_CODE, payload);
    return response ;
}


export async function editImageToCode(payload:any){

    const response = await axiosInstance.post(EDIT_IMAGE_TO_CODE, payload);
    return response ;
}

export async function addImageToCode(payload:any){
    const response =  await axiosInstance.post(ADD_IMAGE_TO_CODE,payload);
    return response;
}


export async function imageToCodeConvert(payload:any){
    const source = axios.CancelToken.source();
    const response  = await axiosInstance.post(IMAGE_TO_CODE_CONVERT,payload, {cancelToken: source.token});
    return response;
}

export async function generateImage_I2C(payload:any){
    const source = axios.CancelToken.source();
    const response  = await axiosInstance.post(GENERATE_IMAGE,payload, {cancelToken: source.token});
    return response;
}


export async function fetchImageToCode(payload:any){
    const response = await axiosInstance.get(`${GET_IMAGE_TO_CODE}/${payload}`);
    return response;
}

export async function deletImageToCode(payload:string) {
    const response = await axiosInstance.delete(`${DELETE_IMAGE_TO_CODE}?id=${payload}`);
    return response;
}

export async function PostImageToCode(payload:string){
    const response  =  await axiosInstance.post(GET_IMAGE_TO_CODE,payload);
    return response;
}

export async function addImagetoCodeProject(payload:any){

    const response = await axiosInstance.post(ADD_IMAGE_TO_CODE,payload);
    return  response;

}