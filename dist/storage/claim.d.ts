import { VdxfUniValue, ContentMultiMap, DataDescriptor } from 'verus-typescript-primitives';
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
export declare const CLAIM_EXPERIENCE: {
    vdxfid: string;
    indexid: string;
    hash160result: string;
    qualifiedname: {
        namespace: string;
        name: string;
    };
};
export declare const CLAIM_STATEMENT: {
    vdxfid: string;
    indexid: string;
    hash160result: string;
    qualifiedname: {
        namespace: string;
        name: string;
    };
};
export declare const CLAIM_SOCIAL_ACCOUNT: {
    vdxfid: string;
    indexid: string;
    hash160result: string;
    qualifiedname: {
        namespace: string;
        name: string;
    };
};
export declare const CLAIM_WORK_EXPERIENCE: {
    vdxfid: string;
    indexid: string;
    hash160result: string;
    qualifiedname: {
        namespace: string;
        name: string;
    };
};
export declare const CLAIM_ATTESTATION_BLOCK: {
    vdxfid: string;
    indexid: string;
    hash160result: string;
    qualifiedname: {
        namespace: string;
        name: string;
    };
};
export declare const CLAIM: {
    vdxfid: string;
    indexid: string;
    hash160result: string;
    qualifiedname: {
        namespace: string;
        name: string;
    };
};
export interface ClaimJson {
    referenceID?: string;
}
export declare type ClaimType = 'experience' | 'achievement' | 'certification' | 'education' | 'employment' | 'skill' | 'statement' | 'socialAccount' | 'workExperience' | 'attestationBlock';
export declare class Claim {
    type: ClaimType;
    data: Array<VdxfUniValue | null>;
    static readonly TYPES: {
        readonly TYPE_EXPERIENCE: "experience";
        readonly TYPE_EMPLOYMENT: "employment";
        readonly TYPE_CERTIFICATION: "certification";
        readonly TYPE_STATEMENT: "statement";
        readonly TYPE_SOCIAL_ACCOUNT: "socialAccount";
        readonly TYPE_WORK_EXPERIENCE: "workExperience";
        readonly TYPE_ATTESTATION_BLOCK: "attestationBlock";
        readonly TYPE_ACHIEVEMENT: "achievement";
        readonly TYPE_EDUCATION: "education";
        readonly TYPE_SKILL: "skill";
    };
    constructor(input?: {
        data?: [VdxfUniValue];
        type?: ClaimType;
    });
    initialize(): void;
    appendDataDescriptor(descriptor: DataDescriptor): void;
    createClaimData(data: Record<string, any>): void;
    typeToVdxfid(type: ClaimType): string;
    toIdentityUpdateJson(): {
        [key: string]: {
            [key: string]: [string];
        };
    };
    static storeMultipleClaims(claims: Claim[]): ContentMultiMap;
}
