export interface UserData {
    id: number;
    mobile_number: number;
    name: string;
    token: string;
}

export interface UserResponse {
    data: UserData[];
    msg: string;
    status: string;
    success: boolean;
}
