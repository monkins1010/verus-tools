export interface EducationData {
    qualification: string;
    field: string;
    startdate: string;
    enddate: string;
    person: string;
    status: string;
    description: string;
    id: string;
}
export declare class Education {
    private data;
    private identity?;
    private claim;
    constructor(data: EducationData, identity?: string);
    /**
     * Creates an identity update JSON using the claim system
     */
    createIdentityUpdateJson(): {
        [key: string]: {
            [key: string]: [string];
        };
    };
    /**
     * Creates MMR data array for education information
     */
    createMMRdata(identity?: string): Array<{
        vdxfdata: {
            [key: string]: any;
        };
    }>;
}
