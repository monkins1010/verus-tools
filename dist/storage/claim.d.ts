import { VdxfUniValue, DataDescriptor } from 'verus-typescript-primitives';
export declare const CLAIM_EMPLOYMENT: {
    vdxfid: string;
    indexid: string;
    hash160result: string;
    qualifiedname: {
        namespace: string;
        name: string;
    };
};
export declare const CLAIM_ACHIEVEMENT: {
    vdxfid: string;
    indexid: string;
    hash160result: string;
    qualifiedname: {
        namespace: string;
        name: string;
    };
};
export declare const CLAIM_CERTIFICATION: {
    vdxfid: string;
    indexid: string;
    hash160result: string;
    qualifiedname: {
        namespace: string;
        name: string;
    };
};
export declare const CLAIM_EDUCATION: {
    vdxfid: string;
    indexid: string;
    hash160result: string;
    qualifiedname: {
        namespace: string;
        name: string;
    };
};
export declare const CLAIM_SKILL: {
    vdxfid: string;
    indexid: string;
    hash160result: string;
    qualifiedname: {
        namespace: string;
        name: string;
    };
};
export interface ClaimJson {
    title: string;
    body: string;
    dates?: string;
    issued?: string;
    organization?: string;
}
export declare type ClaimType = 'experience' | 'achievement' | 'certification' | 'education' | 'employment' | 'skill';
export declare class Claim {
    type: ClaimType;
    data: [VdxfUniValue | null];
    static readonly TYPES: {
        readonly TYPE_EXPERIENCE: "experience";
        readonly TYPE_ACHIEVEMENT: "achievement";
        readonly TYPE_CERTIFICATION: "certification";
        readonly TYPE_EDUCATION: "education";
        readonly TYPE_EMPLOYMENT: "employment";
        readonly TYPE_SKILL: "skill";
    };
    constructor(input?: {
        data?: [VdxfUniValue];
        type?: ClaimType;
    });
    initialize(): void;
    appendDataDescriptor(descriptor: DataDescriptor): void;
    createClaimData(data: ClaimJson): void;
    typeToVdxfid(type: ClaimType): string;
    toIdentityUpdateJson(): {
        [key: string]: {
            [key: string]: [string];
        };
    };
}
