export interface ApiResponseData {
    address: string;
    id: number;
    logo: string;
    phone_no: number;
    property_name: string;
}

export interface ApiResponse {
    data: ApiResponseData;
    msg: string;
    status: string;
    success: boolean;
}
