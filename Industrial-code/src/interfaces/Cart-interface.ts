export interface CartData {
    id: number;
    is_fav: boolean;
    property_details_id: number;
    user_id: number;
    view: number;
}

export interface CartResponse {
    data: CartData[];
    msg: string;
}
