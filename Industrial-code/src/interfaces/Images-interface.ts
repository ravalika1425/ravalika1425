export interface ImagesInterface {
    data: {
        images: {
            files: string[];
            id: number;
        }[];
        property_details: {
            address: string;
            approved_by: string;
            created_at: string;
            description: string;
            facing: string;
            features: string;
            floors: number;
            id: number;
            is_active: boolean;
            modified_at: string | null;
            near_by_places: string;
            negotiable: string;
            plots_per_floor: number;
            price: string;
            property_name: string;
            property_type: string;
            size: string;
        };
    };
    msg: string;
    status: string;
    success: boolean;
}
