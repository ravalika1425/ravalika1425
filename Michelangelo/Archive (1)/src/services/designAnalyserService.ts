import { DesignAnalysisRequest } from "Mike/models/designAnalysis";
import { axiosInstance } from "Mike/utils/axiosConfig";


export async function getDesignAnalysis(payload:DesignAnalysisRequest) {
    const response = await axiosInstance.post('/design/analyse', payload)
    return response
}