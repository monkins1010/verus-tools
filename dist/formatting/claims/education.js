"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Education = void 0;
const claim_1 = require("../../classes/claim");
const { randomBytes } = require('crypto');
class Education {
    constructor(data, identity) {
        this.data = data;
        this.identity = identity;
        // Create claim with education data in the body
        this.claim = new claim_1.Claim({
            type: claim_1.Claim.TYPES.TYPE_EDUCATION,
            data
        });
    }
    /**
     * Creates an identity update JSON using the claim system
     */
    createIdentityUpdateJson() {
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
    createMMRdata(identity) {
        const mmrData = this.claim.toMMRData(identity ? identity : this.identity ? identity : null);
        return mmrData;
    }
}
exports.Education = Education;
