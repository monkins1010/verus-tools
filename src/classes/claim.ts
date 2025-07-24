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


// Keys for Valuverse Claims, users can create their own claim types.

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


export class Claim implements SerializableEntity {
  static VERSION_INVALID = new BN(0, 10)
  static VERSION_FIRST = new BN(1, 10)
  static VERSION_LAST = new BN(1, 10)
  static VERSION_CURRENT = new BN(1, 10)

  version: BigNumber;
  flags: BigNumber;
  type: string;
  data: any;

  constructor(input?: { data?: any, type: string, version?: BigNumber, flags?: BigNumber }) {
    this.version = input?.version || new BN(1, 10);
    this.data = input?.data ;
    this.flags = new BN(0, 10); // Default flags, can be set later
    this.type = input?.type || null;
  
  }

  setData(data: any) {
    this.data = { ...this.data, ...data };
  }

  getByteLength(): number {
    let byteLength = 0;

    byteLength += varint.encodingLength(this.version);
    byteLength += varint.encodingLength(this.flags); // flag for type presence
    byteLength += 20; // Assuming type is a 20-byte hash (e.g., hash160)
    
    // Serialize the data object to JSON string and get its byte length
    const dataJson = JSON.stringify(this.data);
    byteLength += varuint.encodingLength(Buffer.from(dataJson, 'utf-8').byteLength);
    byteLength += Buffer.from(dataJson, 'utf-8').byteLength;

    return byteLength;
  }

  toBuffer(): Buffer {
    const bufferWriter = new BufferWriter(Buffer.alloc(this.getByteLength()));

    bufferWriter.writeVarInt(this.version);
    bufferWriter.writeVarInt(this.flags); // flag for type presence
    bufferWriter.writeSlice(fromBase58Check(this.type).hash); // Write type as a slice

    // Serialize the data object to JSON and write it
    const dataJson = JSON.stringify(this.data);
    bufferWriter.writeVarSlice(Buffer.from(dataJson, 'utf-8'));

    return bufferWriter.buffer;
  }

  fromBuffer(buffer: Buffer, offset: number = 0): number {
    const reader = new BufferReader(buffer, offset);

    this.version = reader.readVarInt();
    this.flags = reader.readVarInt(); // flag for type presence
    this.type = toBase58Check(reader.readSlice(20), 102); // Read type as a 20-byte slice

    // Read the data object from JSON
    const dataJson = reader.readVarSlice().toString('utf-8');
    this.data = JSON.parse(dataJson);

    return reader.offset;
  }

  toIdentityUpdateJson(): { [key: string]: { [key: string]: [string] } } {
    if (!this.type) {
      throw new Error('Claim type is required');
    }

    // Create a single data descriptor with the claim type as label and serialized claim as data
    const claimDescriptor = new DataDescriptor({
      version: new BN(1),
      objectdata: this.toBuffer()
    });
    claimDescriptor.SetFlags();
    const contentmultimap = {};
    contentmultimap[CLAIM.vdxfid] = [{ serializedhex: claimDescriptor.toBuffer().toString('hex') }];

    return {
      contentmultimap
    }
  }

  toMMRData(recievingIdentity: String) {
    // Create a single data descriptor with the claim type as label and serialized claim as data
    const claimDescriptor = new DataDescriptor({
      version: new BN(1),
      label: CLAIM.vdxfid,
      objectdata: this.toBuffer()
    });

    claimDescriptor.SetFlags();

    const mmrdata = [];
    mmrdata.push({vdxfdata:{[DataDescriptorKey.vdxfid]: claimDescriptor.toJson()}})

    if (recievingIdentity) {
      const tmpDataDescriptor = new DataDescriptor({
        version: new BN(1),
        label: 'receiving_identity',
        objectdata: Buffer.from(recievingIdentity, 'utf-8'),
        mimeType: 'text/plain'
      });
      // Set flags for the data descriptor
      tmpDataDescriptor.SetFlags();
      mmrdata.push({vdxfdata:{[DataDescriptorKey.vdxfid]: tmpDataDescriptor.toJson()}})
    }

    return mmrdata;

  }

  static storeMultipleClaimsInID(claims: Claim[]): ContentMultiMap {
    const contentmultimap: KvContent = new Map<string, Array<VdxfUniValue>>();

    const array = new Array<VdxfUniValue>();

    claims.forEach((claim, index) => {
      const objectData = claim.toBuffer();

      const claimDescriptor = new DataDescriptor({
      version: new BN(1),
      objectdata: objectData,
      label: CLAIM.vdxfid
    });
    claimDescriptor.SetFlags();

    const uniValu = new VdxfUniValue({ values: new Array<{ [key: string]: VdxfUniType }>({ [DataDescriptorKey.vdxfid]: claimDescriptor }) });
      array.push(uniValu);

    });

    contentmultimap.set(CLAIM.vdxfid, array);

    const content = new ContentMultiMap({kv_content: contentmultimap});

    return content;
  }

}