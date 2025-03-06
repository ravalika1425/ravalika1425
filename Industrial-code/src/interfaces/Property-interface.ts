export interface Property {
    about_owner: string;
    address: string;
    approved_by: string;
    approved_no: string;
    brochure: File[];
    created_at: string;
    description: string;
    facing: string;
    features: string;
    floors: string;
    id: number;
    images: File[];
    is_active: boolean;
    logo: File[];
    modified_at: string | null;
    near_by_places: string;
    negotiable: string;
    owner_email: string;
    owner_phone_no: string;
    price: string;
    property_name: string;
    property_name_name: string;
    property_status: string;
    property_type: string;
    site_visiting_images: File[];
    size: string;
    status: string;
    views: number;

}

export interface PropertyResponse {
    data: Property[];
    msg: string;
    status: string;
    success: boolean;
}

export interface PropertyResponseById {
    images: string[][];
    property: Property;

}
