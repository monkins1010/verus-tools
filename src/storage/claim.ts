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
  title: string;
  body: string;
  dates?: string;
  issued?: string;
  organization?: string;
  referenceID?: string;
}

export type ClaimType = 'experience' | 'achievement' | 'certification' | 'education' | 'employment' | 'skill';

export class Claim {
  type: ClaimType;
  data: Array<VdxfUniValue | null>;

  static readonly TYPES = {
    TYPE_EXPERIENCE: 'experience',
    TYPE_ACHIEVEMENT: 'achievement',
    TYPE_CERTIFICATION: 'certification',
    TYPE_EDUCATION: 'education',
    TYPE_EMPLOYMENT: 'employment',
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

  createClaimData(data: ClaimJson) {

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

    if (!data.title || data.title.length == 0) {
      throw new Error('Claim title is required');
    }

    const titleDescriptor = DataDescriptor.fromJson({
      version: new BN(1),
      label: 'title',
      mimetype: 'text/plain',
      objectdata: { message: data.title }
    });

    this.appendDataDescriptor(titleDescriptor);

    if (!data.organization || data.organization.length == 0) {
      throw new Error('Organization is required');
    }

    const organizationDescriptor = DataDescriptor.fromJson({
      version: new BN(1),
      label: 'organization',
      mimetype: 'text/plain',
      objectdata: { message: data.organization }
    });

    this.appendDataDescriptor(organizationDescriptor);

    if (!data.body || data.body.length == 0) {
      throw new Error('Claim body is required');
    }

    const bodyDescriptor = DataDescriptor.fromJson({
      version: new BN(1),
      label: 'body',
      mimetype: 'text/plain',
      objectdata: { message: data.body }
    });

    this.appendDataDescriptor(bodyDescriptor);

    if (data.dates) {
      const datesDescriptor = DataDescriptor.fromJson({
        version: new BN(1),
        label: 'dates',
        mimetype: 'text/plain',
        objectdata: { message: data.dates }
      });

      this.appendDataDescriptor(datesDescriptor);
    }

    if (data.issued) {
      const issuedDescriptor = DataDescriptor.fromJson({
        version: new BN(1),
        label: 'issued',
        mimetype: 'text/plain',
        objectdata: { message: data.issued }
      });

      this.appendDataDescriptor(issuedDescriptor);
    }

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