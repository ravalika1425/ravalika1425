export interface EventData {
    data: {
        event: {
            description: string;
            id: number;
            title: string;
        }[];
        images: {
            files: string[];
            id: number;
        }[];
    };
    msg: string;
    status: string;
}
