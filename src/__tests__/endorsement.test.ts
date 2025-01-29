
import { Endorsement, ENDORSEMENT_EMPLOYMENT_PERSONAL } from "../storage/endorsement";


describe('Serializes and deserializes Endorsement', () => {
    test('(de)serialize Endorsement', () => {

        const endorsementJson = {
            version: 1,
            endorsee: "candidate.vrsctest@",
            message: "I endorse X has done Y.",
            reference: "f0e88c0a40e1681634faa6e6b23d5c60b413a4669817df55574a47086dd7e924", //blockchain txid
            txref: "493a5f8b457a44beb7ae0c9399192448b6e2576f399aff11c63228481628a8b7" //claim ref inside the txid
        }
        
        const e = Endorsement.fromJson(endorsementJson);

        const r = e.toBuffer();
        const rFromBuf = new  Endorsement;
        rFromBuf.fromBuffer(r);
    
        expect(rFromBuf.toBuffer().toString('hex')).toBe(r.toString('hex'))
    });
    test('create Endorsement Identity Update', () => {

        const endorsementJson = {
            version: 1,
            endorsee: "candidate.vrsctest@",
            message: "I endorse X has done Y.",
            reference: "f0e88c0a40e1681634faa6e6b23d5c60b413a4669817df55574a47086dd7e924"
        }
        
        const e = Endorsement.fromJson(endorsementJson);

        const r = e.toIdentityUpdateJson(ENDORSEMENT_EMPLOYMENT_PERSONAL.vdxfid);
    
        expect((Object.keys(r.contentmultimap))[0]).toBe(ENDORSEMENT_EMPLOYMENT_PERSONAL.vdxfid)
        expect(r.contentmultimap[ENDORSEMENT_EMPLOYMENT_PERSONAL.vdxfid]).toStrictEqual([{serializedhex: e.toBuffer().toString('hex')}])
    });
    });