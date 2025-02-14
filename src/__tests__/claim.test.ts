import { BN } from "bn.js";
import { Claim, CLAIM_EMPLOYMENT, ClaimJson } from "../storage/claim";
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

        const e = new Claim({ type: Claim.TYPES.TYPE_EMPLOYMENT });

        e.createClaimData(claimJson);

        const output = e.data.map((v) => (v as VdxfUniValue).toJson())

        expect((output[0]["i4GC1YGEVD21afWudGoFJVdnfjJ5XWnCQv"] as DataDescriptorJson).objectdata).toBe("01");
        expect((output[0]["i4GC1YGEVD21afWudGoFJVdnfjJ5XWnCQv"] as DataDescriptorJson).label).toBe("version");
        expect((output[1]["i4GC1YGEVD21afWudGoFJVdnfjJ5XWnCQv"] as DataDescriptorJson).objectdata).toStrictEqual({ "message": "employment" });
        expect((output[1]["i4GC1YGEVD21afWudGoFJVdnfjJ5XWnCQv"] as DataDescriptorJson).label).toStrictEqual("type");
        expect((output[2]["i4GC1YGEVD21afWudGoFJVdnfjJ5XWnCQv"] as DataDescriptorJson).objectdata).toStrictEqual({ "message": "Developer" });
        expect((output[2]["i4GC1YGEVD21afWudGoFJVdnfjJ5XWnCQv"] as DataDescriptorJson).label).toStrictEqual("title");
        expect((output[3]["i4GC1YGEVD21afWudGoFJVdnfjJ5XWnCQv"] as DataDescriptorJson).objectdata).toStrictEqual({ "message": "ACME Widgets" });
        expect((output[3]["i4GC1YGEVD21afWudGoFJVdnfjJ5XWnCQv"] as DataDescriptorJson).label).toStrictEqual("organization");

    });

    test('create multiple claims and put in ID in one transaction', () => {
        const serialized = "02030000000774657374696431010c97dcf31b5f73aeb42c1d86bfb92660d5c3d24602fd1f0208a2ebb2c55f83a8e2a426a53320ed4d42124f4d01fd07020120fddf0108a2ebb2c55f83a8e2a426a53320ed4d42124f4d010c012001010776657273696f6e08a2ebb2c55f83a8e2a426a53320ed4d42124f4d011d01600a656d706c6f796d656e7404747970650a746578742f706c61696e08a2ebb2c55f83a8e2a426a53320ed4d42124f4d011d016009446576656c6f706572057469746c650a746578742f706c61696e08a2ebb2c55f83a8e2a426a53320ed4d42124f4d012701600c41434d4520576964676574730c6f7267616e697a6174696f6e0a746578742f706c61696e08a2ebb2c55f83a8e2a426a53320ed4d42124f4d0157016044426f6479206f6620636c61696d20676f657320686572652c207768617420796f75206861766520646f6e652c207768617420796f7520686176652061636869657665642e04626f64790a746578742f706c61696e08a2ebb2c55f83a8e2a426a53320ed4d42124f4d011d016009323031392d323032300564617465730a746578742f706c61696e08a2ebb2c55f83a8e2a426a53320ed4d42124f4d011f01600a323032352d30322d3032066973737565640a746578742f706c61696e08a2ebb2c55f83a8e2a426a53320ed4d42124f4d012f012020708d0ebedd71e84b19e4b43a9bf679547ba025739ce02af01d0e878c9b58a3fb0b7265666572656e636549442269336267694c756178547236736d46387136784c47346a76766846316d6d726b4d32fd250208a2ebb2c55f83a8e2a426a53320ed4d42124f4d01fd0d020120fde50108a2ebb2c55f83a8e2a426a53320ed4d42124f4d010c012001010776657273696f6e08a2ebb2c55f83a8e2a426a53320ed4d42124f4d011d01600a656d706c6f796d656e7404747970650a746578742f706c61696e08a2ebb2c55f83a8e2a426a53320ed4d42124f4d012301600f436869656620446576656c6f706572057469746c650a746578742f706c61696e08a2ebb2c55f83a8e2a426a53320ed4d42124f4d012701600c41434d4520576964676574730c6f7267616e697a6174696f6e0a746578742f706c61696e08a2ebb2c55f83a8e2a426a53320ed4d42124f4d0157016044426f6479206f6620636c61696d20676f657320686572652c207768617420796f75206861766520646f6e652c207768617420796f7520686176652061636869657665642e04626f64790a746578742f706c61696e08a2ebb2c55f83a8e2a426a53320ed4d42124f4d011d016009323032312d323032340564617465730a746578742f706c61696e08a2ebb2c55f83a8e2a426a53320ed4d42124f4d011f01600a323032352d30322d3032066973737565640a746578742f706c61696e08a2ebb2c55f83a8e2a426a53320ed4d42124f4d012f012020f91b1025c9b4e65e46fa967dee083fe72cda735434d03f51fd8d141aaefa63630b7265666572656e636549442269336267694c756178547236736d46387136784c47346a76766846316d6d726b4d32"

        const claimJson1: ClaimJson = {
            title: "Developer",
            organization: "ACME Widgets", // should this be an iaddress of the organization?
            body: "Body of claim goes here, what you have done, what you have achieved.",
            dates: "2019-2020",
            issued: "2025-02-02",
            referenceID: "708d0ebedd71e84b19e4b43a9bf679547ba025739ce02af01d0e878c9b58a3fb"
        }

        const claimJson2: ClaimJson = {
            title: "Chief Developer",
            organization: "ACME Widgets", // should this be an iaddress of the organization?
            body: "Body of claim goes here, what you have done, what you have achieved.",
            dates: "2021-2024",
            issued: "2025-02-02",
            referenceID: "f91b1025c9b4e65e46fa967dee083fe72cda735434d03f51fd8d141aaefa6363"
        }

        const e1 = new Claim({ type: Claim.TYPES.TYPE_EMPLOYMENT });
        e1.createClaimData(claimJson1);

        const e2 = new Claim({ type: Claim.TYPES.TYPE_EMPLOYMENT });
        e2.createClaimData(claimJson2);

        const multiUpdate = Claim.storeMultipleClaims([e1, e2]);

        //console.log("contentmultimap update", JSON.stringify(multiUpdate.toJson(), null, 2))

        const fromBuffer = new PartialIdentity();

        fromBuffer.fromBuffer(Buffer.from(serialized, 'hex'));

        //console.log("fromBuffer", JSON.stringify(fromBuffer.toJson(), null, 2))

        const partial = new PartialIdentity({ content_multimap: multiUpdate, name: "testid1", version: new BN(3) })

        expect(partial.toBuffer().toString('hex')).toBe(serialized)
    });

    test('create multiple claims and put into Identity update', () => {

        const claimJson1: ClaimJson = {
            title: "Developer",
            organization: "ACME Widgets", // should this be an iaddress of the organization?
            body: "Body of claim goes here, what you have done, what you have achieved.",
            dates: "2019-2020",
            issued: "2025-02-02",
            referenceID: "f91b1025c9b4e65e46fa967dee083fe72cda735434d03f51fd8d141aaefa6363"
        }

        const claimJson2: ClaimJson = {
            title: "Chief Developer",
            organization: "ACME Widgets", // should this be an iaddress of the organization?
            body: "Body of claim goes here, what you have done, what you have achieved.",
            dates: "2021-2024",
            issued: "2025-02-02",
            referenceID: "79e51a3dc43dc4943fd52652103f3b3360c3d0f55e519310ed8bacebdb7cd48d"
        }

        const e1 = new Claim({ type: Claim.TYPES.TYPE_EMPLOYMENT });
        e1.createClaimData(claimJson1);

        const e2 = new Claim({ type: Claim.TYPES.TYPE_EMPLOYMENT });
        e2.createClaimData(claimJson2);

        const multiUpdate = Claim.storeMultipleClaims([e1, e2])

        const partial = new PartialIdentity({ content_multimap: multiUpdate, name: "testid1", version: new BN(3) })

        const checkbuf = new PartialIdentity();

        const orignalBuf = partial.toBuffer();

        checkbuf.fromBuffer(orignalBuf, 0, true);

        //console.log(JSON.stringify(partial.toJson(), null, 2))

        expect(partial.toJson()).toStrictEqual(checkbuf.toJson())
        expect(partial.toBuffer().toString('hex')).toBe(checkbuf.toBuffer().toString('hex'))
    });

    test('create stringify', () => {

        const claimJson: ClaimJson = {
            title: "Developer",
            organization: "ACME Widgets", // should this be an iaddress of the organization?
            body: "Body of claim goes here, what you have done, what you have achieved.",
            dates: "2019-2020",
            issued: "2025-02-01",
            referenceID: "938fc1df5764fd59d66b274b495617e09678dbbd3467fc740a2eb298cce729c5"
        }

        const e = new Claim({ type: Claim.TYPES.TYPE_EMPLOYMENT });

        const dataDesc = new DataDescriptor({ version: new BN(1), label: Claim.TYPES.TYPE_EMPLOYMENT, 
            mimeType: "application/json", objectdata: Buffer.from(JSON.stringify(claimJson), 'utf8') });

        const contentmultimap: KvContent = new Map<string, Array<VdxfUniValue>>();

        const array = new Array<VdxfUniValue>();

        array.push(new VdxfUniValue({ values: new Array<{ [key: string]: VdxfUniType }>({ [DataDescriptorKey.vdxfid]: dataDesc }) }));

        contentmultimap.set(CLAIM_EMPLOYMENT.vdxfid, array);
        
        const content = new ContentMultiMap({kv_content: contentmultimap});

        //console.log("contentmultimap", JSON.stringify(content.toJson(), null, 2))

        const foundKeys = Array.from(content.kv_content.keys());

        expect(foundKeys[0]).toStrictEqual("i3bgiLuaxTr6smF8q6xLG4jvvhF1mmrkM2")

    });

});