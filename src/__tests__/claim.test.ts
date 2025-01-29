import { BN } from "bn.js";
import { Endorsement, ENDORSEMENT_EMPLOYMENT_PERSONAL } from "../storage/endorsement";
import { Claim, CLAIM_EMPLOYMENT } from "../storage/claim";
import { randomBytes } from "crypto";

describe('Serializes and deserializes Claims', () => {
    test('create Claim', () => {

        const claimJson = {
            title: "Developer",
            organization: "ACME Widgets", // should this be an iaddress of the organization?
            body: "Body of claim goes here, what you have done, what you have achieved.",
            dates: "2019-2020",
            issued: new Date(Date.now()).toISOString().slice(0, 10),
            txref: "0 starting Index" //TODO: implment txref
        }

        const e = new Claim({ type: Claim.TYPES.TYPE_EMPLOYMENT });

        e.createClaimData(claimJson);

        //console.log(JSON.stringify(e.toIdentityUpdateJson(), null, 2))

        // once the claim json has been made it us put into the claimants contentmultimap


        expect(true).toBe(true)
    });

    test('create multiple claims and put in ID in one transaction', () => {

        const claimJson1 = {
            title: "Developer",
            organization: "ACME Widgets", // should this be an iaddress of the organization?
            body: "Body of claim goes here, what you have done, what you have achieved.",
            dates: "2019-2020",
            issued: new Date(Date.now()).toISOString().slice(0, 10),
            txref: "2ebb2c55f83a8e2a426a53320ed4d42124f4d011d016009323032312d3230323"
        }

        const claimJson2 = {
            title: "Chief Developer",
            organization: "ACME Widgets", // should this be an iaddress of the organization?
            body: "Body of claim goes here, what you have done, what you have achieved.",
            dates: "2021-2024",
            issued: new Date(Date.now()).toISOString().slice(0, 10),
            txref: "d20676f657320686572652c207768617420796f75206861766520646f6e652c2" 
        }

        const e1 = new Claim({ type: Claim.TYPES.TYPE_EMPLOYMENT });
        e1.createClaimData(claimJson1);

        const e2 = new Claim({ type: Claim.TYPES.TYPE_EMPLOYMENT });
        e2.createClaimData(claimJson2);

        const multiUpdate = Claim.storeMultipleClaims([e1, e2])
        
        console.log(JSON.stringify(multiUpdate, null, 2))

        expect(true).toBe(true)
    });

});