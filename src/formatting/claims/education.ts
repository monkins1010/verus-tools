import { BN } from 'bn.js';
import { Identity } from 'verus-typescript-primitives';
import { Claim, ATTESTATION_ID } from '../../classes/claim';
import { DataDescriptor } from 'verus-typescript-primitives';
const { randomBytes } = require('crypto');

export interface EducationData {
    qualification: string;
    field: string;
    startdate: string;
    enddate: string;
    person: string;
    status: string; // Optional field for status
    description: string;
    id: string
}

export class Education {
    private data: EducationData;
    private identity?: string;
    private claim: Claim;

    constructor(data: EducationData, identity?: string) {
        this.data = data;
        this.identity = identity;

        // Create claim with education data in the body
        this.claim = new Claim({
            type: Claim.TYPES.TYPE_EDUCATION,
            data
        });
    }

    /**
     * Creates an identity update JSON using the claim system
     */
    createIdentityUpdateJson(): { [key: string]: { [key: string]: [string] } } {
        // Update claim data if needed
        this.claim.setData({
            body: {
                qualification: this.data.qualification,
                field: this.data.field,
                startdate: this.data.startdate,
                enddate: this.data.enddate,
                person: this.data.person,
                description: this.data.description,
                id: this.data.id
            }
        });

        return this.claim.toIdentityUpdateJson();
    }

    /**
     * Creates MMR data array for education information
     */
    createMMRdata(identity?: string): Array<{ vdxfdata: { [key: string]: any } }> {
        const mmrData = this.claim.toMMRData(identity ? identity : this.identity ? identity : null);
        return mmrData;
    }
}
