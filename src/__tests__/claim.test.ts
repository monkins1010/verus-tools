import { BN } from "bn.js";
import { Claim, CLAIM_EMPLOYMENT } from "../classes/claim";
import { randomBytes } from "crypto";
import { ContentMultiMap, DataDescriptor, DataDescriptorJson, PartialIdentity, VdxfUniType, VdxfUniValue, KvContent, DataDescriptorKey } from 'verus-typescript-primitives';


describe('Serializes and deserializes Claims', () => {
    test('create Claim', () => {

        const claimJson = {
            title: "Developer",
            organization: "ACME Widgets", // should this be an iaddress of the organization?
            body: "Body of claim goes here, what you have done, what you have achieved.",
            dates: "2019-2020",
            issued: "2025-02-01",
            referenceID: "938fc1df5764fd59d66b274b495617e09678dbbd3467fc740a2eb298cce729c5"
        }

        const e = new Claim({ type: Claim.TYPES.TYPE_EMPLOYMENT, data: claimJson });

        expect(e.version.toString()).toBe("1");
        expect(e.type.toNumber()).toBe(Claim.TYPES.TYPE_EMPLOYMENT.toNumber());
        expect(e.data).toEqual({
            title: claimJson.title,
            organization: claimJson.organization,
            body: claimJson.body,
            dates: claimJson.dates,
            issued: claimJson.issued,
            referenceID: claimJson.referenceID
        });
       

    });

    test('create multiple claims and put in ID in one transaction', () => {
        const serialized = "8f02030000000774657374696431010c97dcf31b5f73aeb42c1d86bfb92660d5c3d24602fd350108a2ebb2c55f83a8e2a426a53320ed4d42124f4d01fd1d010120f7010004f37b227469746c65223a22446576656c6f706572222c226f7267616e697a6174696f6e223a2241434d452057696467657473222c22626f6479223a22426f6479206f6620636c61696d20676f657320686572652c207768617420796f75206861766520646f6e652c207768617420796f7520686176652061636869657665642e222c226461746573223a22323031392d32303230222c22697373756564223a22323032352d30322d3032222c226964223a2237303864306562656464373165383462313965346234336139626636373935343762613032353733396365303261663031643065383738633962353861336662227d22693464375531615a686d6f785a625778384156657a68367a31596577416e75773356fd3d0108a2ebb2c55f83a8e2a426a53320ed4d42124f4d01fd25010120fdfd00010004f97b227469746c65223a22436869656620446576656c6f706572222c226f7267616e697a6174696f6e223a2241434d452057696467657473222c22626f6479223a22426f6479206f6620636c61696d20676f657320686572652c207768617420796f75206861766520646f6e652c207768617420796f7520686176652061636869657665642e222c226461746573223a22323032312d32303234222c22697373756564223a22323032352d30322d3032222c226964223a2266393162313032356339623465363565343666613936376465653038336665373263646137333534333464303366353166643864313431616165666136333633227d22693464375531615a686d6f785a625778384156657a68367a31596577416e75773356"

        const claimJson1 = {
            title: "Developer",
            organization: "ACME Widgets", // should this be an iaddress of the organization?
            body: "Body of claim goes here, what you have done, what you have achieved.",
            dates: "2019-2020",
            issued: "2025-02-02",
            id: "708d0ebedd71e84b19e4b43a9bf679547ba025739ce02af01d0e878c9b58a3fb"
        }

        const claimJson2 = {
            title: "Chief Developer",
            organization: "ACME Widgets", // should this be an iaddress of the organization?
            body: "Body of claim goes here, what you have done, what you have achieved.",
            dates: "2021-2024",
            issued: "2025-02-02",
            id: "f91b1025c9b4e65e46fa967dee083fe72cda735434d03f51fd8d141aaefa6363"
        }

        const e1 = new Claim({ type: Claim.TYPES.TYPE_EMPLOYMENT, data: claimJson1 });

        const e2 = new Claim({ type: Claim.TYPES.TYPE_EMPLOYMENT, data: claimJson2 });

        const multiUpdate = Claim.storeMultipleClaimsInID([e1, e2]);

        const fromBuffer = new PartialIdentity();

        fromBuffer.fromBuffer(Buffer.from(serialized, 'hex'));

        //console.log("fromBuffer", JSON.stringify(fromBuffer.toJson(), null, 2))

        const partial = new PartialIdentity({ content_multimap: multiUpdate, name: "testid1", version: new BN(3) })

        expect(partial.toBuffer().toString('hex')).toBe(serialized)
    });

    test('create multiple claims and put into Identity update', () => {

        const claimJson1 = {
            title: "Developer",
            organization: "ACME Widgets", // should this be an iaddress of the organization?
            body: "Body of claim goes here, what you have done, what you have achieved.",
            dates: "2019-2020",
            issued: "2025-02-02",
            referenceID: "f91b1025c9b4e65e46fa967dee083fe72cda735434d03f51fd8d141aaefa6363"
        }

        const claimJson2 = {
            title: "Chief Developer",
            organization: "ACME Widgets", // should this be an iaddress of the organization?
            body: "Body of claim goes here, what you have done, what you have achieved.",
            dates: "2021-2024",
            issued: "2025-02-02",
            referenceID: "79e51a3dc43dc4943fd52652103f3b3360c3d0f55e519310ed8bacebdb7cd48d"
        }

        const e1 = new Claim({ type: Claim.TYPES.TYPE_EMPLOYMENT, data: claimJson1 });
        const e2 = new Claim({ type: Claim.TYPES.TYPE_EMPLOYMENT, data: claimJson2 });

        const multiUpdate = Claim.storeMultipleClaimsInID([e1, e2])

        const partial = new PartialIdentity({ content_multimap: multiUpdate, name: "testid1", version: new BN(3) })

        const checkbuf = new PartialIdentity();

        const orignalBuf = partial.toBuffer();

        checkbuf.fromBuffer(orignalBuf, 0, true);

        //console.log(JSON.stringify(partial.toJson(), null, 2))

        expect(partial.toJson()).toStrictEqual(checkbuf.toJson())
        expect(partial.toBuffer().toString('hex')).toBe(checkbuf.toBuffer().toString('hex'))
    });


});