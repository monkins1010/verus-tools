
import { Endorsement, ENDORSEMENT_SKILL } from "../storage/endorsement";
import { VerusIdInterface, primitives, } from 'verusid-ts-client';
import { SignDataArgs } from "verus-typescript-primitives/dist/api/classes/SignData/SignDataRequest";
import { BN } from "bn.js";
import { Buffer } from 'buffer';
import bs58 from 'bs58';

const { SignatureData } = primitives;
const VerusId = new VerusIdInterface("VRSCTEST", "https://api.verustest.net")

describe('Serializes and deserializes Endorsement', () => {
    test('(de)serialize Endorsement', () => {

        const endorsementJson = {
            version: 1,
            endorsee: "candidate.vrsctest@",
            reference: "f0e88c0a40e1681634faa6e6b23d5c60b413a4669817df55574a47086dd7e924", //blockchain txid
            txref: "493a5f8b457a44beb7ae0c9399192448b6e2576f399aff11c63228481628a8b7" //claim ref inside the txid
        }

        const e = Endorsement.fromJson(endorsementJson);

        const r = e.toBuffer();
        const rFromBuf = new Endorsement;
        rFromBuf.fromBuffer(r);

        expect(rFromBuf.toBuffer().toString('hex')).toBe(r.toString('hex'))
    });
    test('create Endorsement Identity Update', async () => {

        const endorsementJson = {
            version: 1,
            endorsee: "candidate.vrsctest@",
            reference: "d425c5dfd8074260a2143e31382a25f3eb82a9eecd21dc63f025bff37cbd3628",
            txref: "dcf012d856fead4d729b1e5f1b829e23e9198fb288e6c990f1d7ea9fb12c28a7" //claim ref inside the txid
        }

        const e = Endorsement.fromJson(endorsementJson);

        const hash = e.createHash("endorsetest@");

        const signature = await VerusId.signHash("endorsetest@", hash, "Uwh2uGN6RBCSuNpjaiRake1CqDciVZstYBatNAbyz1uB7ivDKiSN");

        const sigInputObj = {
            version: SignatureData.DEFAULT_VERSION,
            signature_as_vch: Buffer.from(signature, 'base64'),
            system_ID: "iJhCezBExJHvtyH3fGhNnt2NhU4Ztkf2yq",
            identity_ID: "i4M7ar436N7wKHgZodjGAWdsBSNjG7cz8s"
        }

        const signatureData = new SignatureData(sigInputObj);

        e.signature = signatureData;

        e.setFlags();

        const contentmultimap = e.toIdentityUpdateJson(ENDORSEMENT_SKILL);

        expect((Object.keys(contentmultimap.contentmultimap))[0]).toBe(ENDORSEMENT_SKILL.vdxfid)
        expect(contentmultimap.contentmultimap[ENDORSEMENT_SKILL.vdxfid]).toStrictEqual([{ serializedhex: e.toBuffer().toString('hex') }])
    });
    test('create Endorsement off chain and sign', async () => {

        const endorsementJson = {
            version: 1,
            endorsee: "candidate.vrsctest@",
            reference: "39ff122ee5f3da3a4761db630d6b7bdb081d6a0fcafec126a56b1d59c93a1371",
            txid: "7bc1e107a0882ef67c644701762fc8e569bac0bd2405b79aed89cc0a35ee345f"
        }

        const e = Endorsement.fromJson(endorsementJson);

        const hash = e.createHash("endorsetest@");

        const signature = await VerusId.signHash("endorsetest@", hash, "Uwh2uGN6RBCSuNpjaiRake1CqDciVZstYBatNAbyz1uB7ivDKiSN");

        const sigInputObj = {
            version: SignatureData.DEFAULT_VERSION,
            signature_as_vch: Buffer.from(signature, 'base64'),
            system_ID: "iJhCezBExJHvtyH3fGhNnt2NhU4Ztkf2yq",
            identity_ID: "i4M7ar436N7wKHgZodjGAWdsBSNjG7cz8s" //endorsetest@
        }

        const signatureData = new SignatureData(sigInputObj);

        e.signature = signatureData;

        e.setFlags();

        const offChainObject = { [ENDORSEMENT_SKILL.vdxfid]: [{ serializedhex: e.toBuffer().toString('hex') }] }

        expect(e.toJson()).toStrictEqual({
            "endorsee":"candidate.vrsctest@",
            "flags":"2",
            "message":"",
            "reference":"39ff122ee5f3da3a4761db630d6b7bdb081d6a0fcafec126a56b1d59c93a1371",
            "signature":{
               "boundhashes":[
                  
               ],
               "hashtype":"0",
               "identityid":"i4M7ar436N7wKHgZodjGAWdsBSNjG7cz8s",
               "signature": signature,
               "signaturehash":"",
               "signaturetype":"0",
               "systemid":"iJhCezBExJHvtyH3fGhNnt2NhU4Ztkf2yq",
               "vdxfkeynames":[
                  
               ],
               "vdxfkeys":[
                  
               ],
               "version":"1"
            },
            "version":"1"
         })

    });
});