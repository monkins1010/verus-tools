import { Identity } from 'verus-typescript-primitives';

import varuint from 'verus-typescript-primitives/dist/utils/varuint'
import varint from 'verus-typescript-primitives/dist/utils/varint'
import { fromBase58Check, toBase58Check } from "verus-typescript-primitives/dist/utils/address";
import bufferutils from 'verus-typescript-primitives/dist/utils/bufferutils'
import { BN } from 'bn.js';
import { BigNumber } from 'verus-typescript-primitives/dist/utils/types/BigNumber';
import { I_ADDR_VERSION } from 'verus-typescript-primitives/dist/constants/vdxf';
import { SerializableEntity } from 'verus-typescript-primitives/dist/utils/types/SerializableEntity';
import * as VDXF_Data from 'verus-typescript-primitives/dist/vdxf/vdxfdatakeys';
import { VdxfUniValue, ContentMultiMap, DataDescriptor, KvContent, VdxfUniType, DataDescriptorKey } from 'verus-typescript-primitives'
const { BufferReader, BufferWriter } = bufferutils
const { randomBytes } = require('crypto');

export const CLAIM_EMPLOYMENT = {
  "vdxfid": "i3bgiLuaxTr6smF8q6xLG4jvvhF1mmrkM2",
  "indexid": "x8RoB9Lfon4mVw8AgncVETGTxMG2jfebR7",
  "hash160result": "3efffa2be6e73fd7320b7c3d035266359fa85a01",
  "qualifiedname": {
    "namespace": "iNQFA8jtYe9JYq6Qr49ZxAhvWErFurWjTa",
    "name": "valu.vrsc::claim.employment"
  }
}

export const CLAIM_ACHIEVEMENT = {
  "vdxfid": "i51jfK8wZrKa5LgF7pkbow8hV1Hv6nBm2K",
  "indexid": "x9qr87a2RAYEhWZGyWQknKfEWfJw51yvxx",
  "hash160result": "75c441fa22d809f7f213ac9476e2ed8d6b3adf10",
  "qualifiedname": {
    "namespace": "iNQFA8jtYe9JYq6Qr49ZxAhvWErFurWjTa",
    "name": "valu.vrsc::claim.achievement"
  }
}

export const CLAIM_CERTIFICATION = {
  "vdxfid": "iPkJZJiwZSJrgnmunhQPnkWsyY28tngW2W",
  "indexid": "xUaR27A2QkXXJxeweP4Ym93R1C39mLRF52",
  "hash160result": "3bf5d779348c057ff91cd978418dd3ef5a6c5ede",
  "qualifiedname": {
    "namespace": "iNQFA8jtYe9JYq6Qr49ZxAhvWErFurWjTa",
    "name": "valu.vrsc::claim.certification"
  }
}

export const CLAIM_EDUCATION = {
  "vdxfid": "iJ5sikvjEbSkijSxwWQ2J197XVTzunm6kP",
  "indexid": "xNuzBZMp5ufRLuKzoC4BGPfeZ9V1nwEu4R",
  "hash160result": "603c2e5af4e38e6270277a80393510d53f4141a0",
  "qualifiedname": {
    "namespace": "iNQFA8jtYe9JYq6Qr49ZxAhvWErFurWjTa",
    "name": "valu.vrsc::claim.education"
  }
}

export const CLAIM_SKILL = {
  "vdxfid": "iEpYe4cC73H7i9ay3G8geAjD1tFAhWscvj",
  "indexid": "xKef6s3GxMVnLKTztwnqcZFk3YGBZqbnP7",
  "hash160result": "53c4491d3168594da785eb6e3c7bbed4cab5727c",
  "qualifiedname": {
    "namespace": "iNQFA8jtYe9JYq6Qr49ZxAhvWErFurWjTa",
    "name": "valu.vrsc::claim.skill"
  }
}

export const CLAIM_EXPERIENCE = {
  "vdxfid": "iFqtB6XGZmuUKW3Bzongrnum4QAf25Hgfu",
  "indexid": "xLfzdtxMR688wfvDrVSqqBSJ64BfzAv3s9",
  "hash160result": "4570c7949267c52bfdedd9d1147d91db148fab87",
  "qualifiedname": {
    "namespace": "iNQFA8jtYe9JYq6Qr49ZxAhvWErFurWjTa",
    "name": "valu.vrsc::claim.experience"
  }
}

export const CLAIM_STATEMENT = {
  "vdxfid": "i9SktCWXuit2RLSy25K8ijvRKojuXgMJ2o",
  "indexid": "xEGsLzwcm36h3WKzskyHh8SxMTkvRC6DEd",
  "hash160result": "d241d5b51f7be94b38d21d2b23d7e1928d267b41",
  "qualifiedname": {
    "namespace": "iNQFA8jtYe9JYq6Qr49ZxAhvWErFurWjTa",
    "name": "valu.vrsc::claim.statement"
  }
}

export const CLAIM_SOCIAL_ACCOUNT = {
  "vdxfid": "i97vLHSG3CnZU1jifqsxxg2p38e5DgPRup",
  "indexid": "xDx2o5sLtX1E6BckXXY7w4ZM4nf61QrQwe",
  "hash160result": "221fd3f420cae8074d1e5b1181bef0b1b422eb3d",
  "qualifiedname": {
    "namespace": "iNQFA8jtYe9JYq6Qr49ZxAhvWErFurWjTa",
    "name": "valu.vrsc::claim.socialAccount"
  }
}

export const CLAIM_WORK_EXPERIENCE = {
  "vdxfid": "i6pQWU1Y3Z1addNdnB99ytvBMkbDbwT5Tk",
  "indexid": "xBeWyGSctsEFFoFfdroJxHSiPQcEUos2RJ",
  "hash160result": "ccb9b7ac5fa2696e0e31b1a8bb8807279deaaa24",
  "qualifiedname": {
    "namespace": "iNQFA8jtYe9JYq6Qr49ZxAhvWErFurWjTa",
    "name": "valu.vrsc::claim.workExperience"
  }
}

export const CLAIM_ATTESTATION_BLOCK = {
  "vdxfid": "iPfcXMw6afcW7Sjia9dk4hGDsKxEJfU5iz",
  "indexid": "xUVizANBRyqAjcckRqHu35nktyyFBfhXW1",
  "hash160result": "857583c7b918f72b4c98c1ef472040e552577bdd",
  "qualifiedname": {
    "namespace": "iNQFA8jtYe9JYq6Qr49ZxAhvWErFurWjTa",
    "name": "valu.vrsc::claim.attestationBlock"
  }
}

export const CLAIM = {
  "vdxfid": "i4d7U1aZhmoxZbWx8AVezh6z1YewAnuw3V",
  "indexid": "x9TDvp1eZ62dBmPyyr9oy5dX3Cfx6naxiE",
  "hash160result": "46d2c3d56026b9bf861d2cb4ae735f1bf3dc970c",
  "qualifiedname": {
    "namespace": "iNQFA8jtYe9JYq6Qr49ZxAhvWErFurWjTa",
    "name": "valu.vrsc::claim"
  }
}


export interface ClaimJson {
  // title: string;
  // body: string;
  // dates?: string;
  // issued?: string;
  // organization?: string;
  referenceID?: string;
}

export type ClaimType = 'experience' | 'achievement' | 'certification' | 'education' | 'employment' | 'skill' |
    'statement' | 'socialAccount' | 'workExperience' | 'attestationBlock';

export class Claim {
  type: ClaimType;
  data: Array<VdxfUniValue | null>;

  static readonly TYPES = {
    TYPE_EXPERIENCE: 'experience',
    TYPE_EMPLOYMENT: 'employment',
    TYPE_CERTIFICATION: 'certification',
    TYPE_STATEMENT: 'statement',
    TYPE_SOCIAL_ACCOUNT: 'socialAccount',
    TYPE_WORK_EXPERIENCE: 'workExperience',
    TYPE_ATTESTATION_BLOCK: 'attestationBlock',
    TYPE_ACHIEVEMENT: 'achievement',
    TYPE_EDUCATION: 'education',
    TYPE_SKILL: 'skill'
  } as const;

  constructor(input?: { data?: [VdxfUniValue], type?: ClaimType }) {
    this.data = input.data;
    if (this.data == null) {
      this.initialize();
    }
    this.type = input.type || null;
  }

  initialize() {

    const descriptor = DataDescriptor.fromJson({
      version: new BN(1),
      label: 'version',
      objectdata: '01'
    })

    const newArray = new Array<{[key: string]: VdxfUniType}>;
    newArray.push({[VDXF_Data.DataDescriptorKey.vdxfid]: descriptor});

    this.data = [new VdxfUniValue()];
    this.data[0].values = newArray;

  }

  appendDataDescriptor(descriptor: DataDescriptor) {

    const newArray = new Array<{[key: string]: VdxfUniType}>;
    newArray.push({[VDXF_Data.DataDescriptorKey.vdxfid]: descriptor});
    this.data.push(new VdxfUniValue());
    this.data[this.data.length - 1].values = newArray;

  }

  createClaimData(data: Record<string, any>) {

    if (!this.type) {
      throw new Error('Claim type is required');
    }

    const typeDescriptor = DataDescriptor.fromJson({
      version: new BN(1),
      label: 'type',
      mimetype: 'text/plain',
      objectdata: { message: this.type }
    });

    this.appendDataDescriptor(typeDescriptor);

    let referenceID = data.referenceID || '';

    if (!referenceID || referenceID.length == 0) {
      referenceID = randomBytes(32).toString('hex');
    }

    const referenceIDDescriptor = DataDescriptor.fromJson({
      version: new BN(1),
      label: 'referenceID',
      objectdata: { serializedhex: referenceID }
    });

    this.appendDataDescriptor(referenceIDDescriptor);

    Object.keys(data).forEach((key) => {
      if (key != 'referenceID' && key != 'type') {
        const newDescriptor = DataDescriptor.fromJson({
          version: new BN(1),
          label: key,
          mimetype: 'text/plain',
          objectdata: {message: data[key] || " "}
        });

        this.appendDataDescriptor(newDescriptor);
      }
    });
  }

  typeToVdxfid(type: ClaimType): string {
    switch (type) {
      case 'experience':
        return CLAIM_EXPERIENCE.vdxfid;
      case 'achievement':
        return CLAIM_ACHIEVEMENT.vdxfid;
      case 'certification':
        return CLAIM_CERTIFICATION.vdxfid;
      case 'education':
        return CLAIM_EDUCATION.vdxfid;
      case 'employment':
        return CLAIM_EMPLOYMENT.vdxfid;
      case 'skill':
        return CLAIM_SKILL.vdxfid;
      case 'statement':
        return CLAIM_STATEMENT.vdxfid;
      case 'socialAccount':
        return CLAIM_SOCIAL_ACCOUNT.vdxfid;
      case 'workExperience':
        return CLAIM_WORK_EXPERIENCE.vdxfid;
      case 'attestationBlock':
        return CLAIM_ATTESTATION_BLOCK.vdxfid;
      default:
        throw new Error('Unsupported claim type');
    }
  }

  toIdentityUpdateJson(): { [key: string]: { [key: string]: [string] } } {

    const contentmultimap = {}

    contentmultimap[this.typeToVdxfid(this.type)] = this.data.map((value) => {
      return value.toJson();

    });

    return {
      contentmultimap
    }
  }

  static storeMultipleClaims(claims: Claim[]):ContentMultiMap {
    const contentmultimap:KvContent = new Map<string, Array<VdxfUniValue>>();

    const array = new Array<VdxfUniValue>();

    claims.forEach((claim, index) => {

      const objectData = claim.data.reduce((acc, value) => {
        return Buffer.concat([acc, value.toBuffer()]);
      }, Buffer.alloc(0));

      const contentDataDescriptor = new DataDescriptor({
        version: new BN(1),
        flags: new BN(32),
        label: claim.typeToVdxfid(claim.type),
        objectdata: objectData 
      }); 

      array.push(new VdxfUniValue({values: new Array<{[key:string]: VdxfUniType}>({[DataDescriptorKey.vdxfid]: contentDataDescriptor})}));

    });

    contentmultimap.set(CLAIM.vdxfid, array);

    const content = new ContentMultiMap({kv_content: contentmultimap});

    return content;
  }

}