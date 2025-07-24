import { BN } from "bn.js";
import { Education } from "../formatting/claims/education";
import { randomBytes } from "crypto";
import { ContentMultiMap, DataDescriptor, DataDescriptorJson, PartialIdentity, VdxfUniType, VdxfUniValue, KvContent, DataDescriptorKey } from 'verus-typescript-primitives';


describe('Serializes and deserializes Education Claims', () => {
    test('create Education Claim', () => {

        const educationJson = {
            "qualification": "Degree",
            "field": "Field of Study",
            "startdate": "Start Date",
            "enddate": "End Date",
            "person": "Name of the person",
            "status": "Status of the education", 
            "description": "Description",
            "id": "dc2c2c5a44fab0b62c4f1403bc9870824c246493a517d162e153ce2ab5fd9f22"
        }

        // Create an instance of Education with the data and an optional identity.
        const education = new Education(educationJson, "identity1@");
        
        const mmrData = education.createMMRdata("identity1@");
        expect(mmrData).toBeDefined();
        expect(mmrData.length).toBeGreaterThan(0);

        const mmrdataJson = education.createMMRdata();

        const staticmmrJSon = [
        {
          "vdxfdata": {
            "i4GC1YGEVD21afWudGoFJVdnfjJ5XWnCQv": {
              "version": 1,
              "flags": 32,
              "objectdata": "0100a041413fd5103539807a2770628ee3f45a2e3c60fd06017b227175616c696669636174696f6e223a22446567726565222c226669656c64223a224669656c64206f66205374756479222c22737461727464617465223a2253746172742044617465222c22656e6464617465223a22456e642044617465222c22706572736f6e223a224e616d65206f662074686520706572736f6e222c22737461747573223a22537461747573206f662074686520656475636174696f6e222c226465736372697074696f6e223a224465736372697074696f6e222c226964223a2264633263326335613434666162306236326334663134303362633938373038323463323436343933613531376431363265313533636532616235666439663232227d",
              "label": "i4d7U1aZhmoxZbWx8AVezh6z1YewAnuw3V"
            }
          }
        }
      ]
    expect(mmrdataJson).toEqual(staticmmrJSon);

    const fromSerialized = new VdxfUniValue();
    fromSerialized.fromBuffer(Buffer.from(staticmmrJSon[0].vdxfdata["i4GC1YGEVD21afWudGoFJVdnfjJ5XWnCQv"].objectdata, 'hex'));
    expect(fromSerialized.toBuffer().toString('hex')).toEqual(staticmmrJSon[0].vdxfdata["i4GC1YGEVD21afWudGoFJVdnfjJ5XWnCQv"].objectdata);
    });
});