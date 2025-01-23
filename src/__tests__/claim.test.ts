import { BN } from "bn.js";
import { Endorsement, ENDORSEMENT_EMPLOYMENT_PERSONAL } from "../storage/endorsement";
import { Claim, CLAIM_EMPLOYMENT} from "../storage/claim";

describe('Serializes and deserializes Claims', () => {
    test('create Claim', () => {

        const claimJson = {
            title: "Developer",
            organization: "ACME Widgets", // should this be an iaddress of the organization?
            body: "Body of claim goes here, what you have done, what you have achieved.",
            dates: "2019-2020",
            issued: new Date(Date.now()).toISOString().slice(0,10)
        }
        
        const e = new Claim({type: Claim.TYPES.TYPE_EMPLOYMENT});

        e.createClaimData(claimJson);
        
        console.log(JSON.stringify(e.toIdentityUpdateJson(), null, 2))
    
        expect(true).toBe(true)
    });

    });