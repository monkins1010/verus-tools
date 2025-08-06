/// <reference types="bn.js" />
/// <reference types="node" />
import { BigNumber } from 'verus-typescript-primitives/dist/utils/types/BigNumber';
import { SerializableEntity } from 'verus-typescript-primitives/dist/utils/types/SerializableEntity';
import { ContentMultiMap } from 'verus-typescript-primitives';
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
export declare const CLAIM: {
    vdxfid: string;
    indexid: string;
    hash160result: string;
    qualifiedname: {
        namespace: string;
        name: string;
    };
};
export declare class Claim implements SerializableEntity {
    static VERSION_INVALID: import("bn.js");
    static VERSION_FIRST: import("bn.js");
    static VERSION_LAST: import("bn.js");
    static VERSION_CURRENT: import("bn.js");
    version: BigNumber;
    flags: BigNumber;
    type: string;
    data: any;
    constructor(input?: {
        data?: any;
        type: string;
        version?: BigNumber;
        flags?: BigNumber;
    });
    setData(data: any): void;
    getByteLength(): number;
    toBuffer(): Buffer;
    fromBuffer(buffer: Buffer, offset?: number): number;
    toIdentityUpdateJson(): {
        [key: string]: {
            [key: string]: [string];
        };
    };
    toMMRData(recievingIdentity: String): any[];
    static storeMultipleClaimsInID(claims: Claim[]): ContentMultiMap;
}
