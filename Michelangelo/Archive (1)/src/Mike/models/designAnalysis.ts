export interface DesignAnalysisRequest {
    userSignature: string,
    datauri:string,
    tests:string[]
}
export interface ColorContrastItem {
    text: string;
    textColor: string;
    backgroundColor: string;
    wcag_aa?: boolean;
    wcag_aaa?: boolean;
    result?: boolean;
}

export interface AlignmentItem {
    element: string;
    improvements: string[];
}

export interface ColorBlindnessTestItem {
    type: string;
    suggestions: string[];
    datauri?: string;
}

export interface DesignAnalysisResponse {
    colorContrast: ColorContrastItem[];
    alignment: AlignmentItem[];
    colorBlindnessTest: ColorBlindnessTestItem[];
    gridImage?: string;
}
