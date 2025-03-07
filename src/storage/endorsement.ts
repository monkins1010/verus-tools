import { Identity } from 'verus-typescript-primitives';

import varuint from 'verus-typescript-primitives/dist/utils/varuint'
import varint from 'verus-typescript-primitives/dist/utils/varint'
import { fromBase58Check, toBase58Check } from "verus-typescript-primitives/dist/utils/address";
import bufferutils from 'verus-typescript-primitives/dist/utils/bufferutils'
import { BN } from 'bn.js';
import { BigNumber } from 'verus-typescript-primitives/dist/utils/types/BigNumber';
import { I_ADDR_VERSION } from 'verus-typescript-primitives/dist/constants/vdxf';
import { SerializableEntity } from 'verus-typescript-primitives/dist/utils/types/SerializableEntity';
import { VdxfUniValue, SignatureData, SignatureJsonDataInterface, VDXFKeyInterface } from 'verus-typescript-primitives'
import { VerusIdInterface, primitives } from 'verusid-ts-client';
import { createHash } from 'crypto';

const verusd = new VerusIdInterface('VRSC', 'https://api.verustest.net');


const { BufferReader, BufferWriter } = bufferutils

export const ENDORSEMENT: VDXFKeyInterface = {
  "vdxfid": "iDbPhzm8g7mQ94Cy2VNn7dJPVk5zcDRhPS",
  "indexid": "xJRWAoCDXRz4mE5ztB2w61pvXQ71WSXnGu",
  "hash160result": "dbfcb74829379cb79d39d9dbe81a76627bb8fd6e",
  "qualifiedname": {
    "namespace": "iNQFA8jtYe9JYq6Qr49ZxAhvWErFurWjTa",
    "name": "valu.vrsc::endorsement"
  }
}

export const ENDORSEMENT_SKILL: VDXFKeyInterface = {
  "vdxfid": "iBJqQMRzpCW1WVYoU2Ty2VbCJnvyTEsE1C",
  "indexid": "xG8ws9s5fWig8fRqKi87zt7jLSwzNoJ3s7",
  "hash160result": "309091e8f181bd19279b6cd8873aaafaf4d8eb55",
  "qualifiedname": {
    "namespace": "iNQFA8jtYe9JYq6Qr49ZxAhvWErFurWjTa",
    "name": "valu.vrsc::endorsement.skill"
  }
}

export const ENDORSEMENT_QUALIFICATION: VDXFKeyInterface = {
  "vdxfid": "iGW3WFP1h8ZDsJWLFMvTF3ZqLuiMRBK6jV",
  "indexid": "xML9y3p6YSmtVUPN73acDS6NNZjNE6JbQo",
  "hash160result": "d2f91effc976eee2d9574d4ab5e4f0456827e38e",
  "qualifiedname": {
    "namespace": "iNQFA8jtYe9JYq6Qr49ZxAhvWErFurWjTa",
    "name": "valu.vrsc::endorsement.qualification"
  }
}

export const ENDORSEMENT_REFERENCE: VDXFKeyInterface = {
  "vdxfid": "iArNtGt8xYWBQaDtYATfhdR1NXq1ecZgRp",
  "indexid": "xFgVM5KDorir2k6vPr7pg1wYQBr2VEywYv",
  "hash160result": "ebc99d117c8e67fa10dfdd6a3295d40458e5ea50",
  "qualifiedname": {
    "namespace": "iNQFA8jtYe9JYq6Qr49ZxAhvWErFurWjTa",
    "name": "valu.vrsc::endorsement.reference"
  }
}


export const ENDORSEMENT_PROJECT: VDXFKeyInterface = {
  "vdxfid": "i7tTikSbJcLDBFpZyb8Uk3UfVjsLxz25Q4",
  "indexid": "xCiaBYsg9vYsoRhbqGndiS1CXPtMpCtFg3",
  "hash160result": "0ff2447acd00a1c5494156edee5481591c636730",
  "qualifiedname": {
    "namespace": "iNQFA8jtYe9JYq6Qr49ZxAhvWErFurWjTa",
    "name": "valu.vrsc::endorsement.project"
  }
}

const ENDORSEMENT_TYPES = [ENDORSEMENT_SKILL, ENDORSEMENT_QUALIFICATION, ENDORSEMENT_REFERENCE, ENDORSEMENT_PROJECT];

export interface EndorsementJson {
  version: number;
  flags?: number;
  endorsee: string;
  message?: string;
  reference: string;
  metadata?: any;
  signature?: SignatureJsonDataInterface;
  txid?: string;

}

export class Endorsement implements SerializableEntity {

  static VERSION_INVALID = new BN(0, 10)
  static VERSION_FIRST = new BN(1, 10)
  static VERSION_LAST = new BN(1, 10)
  static VERSION_CURRENT = new BN(1, 10)

  static FLAGS_HAS_METADATA = new BN(1, 10)
  static FLAGS_HAS_SIGNATURE = new BN(2, 10)
  static FLAGS_HAS_TXID = new BN(4, 10)
  static FLAGS_HAS_MESSAGE = new BN(8, 10)

  version: BigNumber;
  flags: BigNumber;
  endorsee: string;
  message: string;
  reference: Buffer;
  txid: Buffer;
  metaData: VdxfUniValue | null;
  signature: SignatureData | null;

  constructor(data: {
    version?: BigNumber, flags?: BigNumber, endorsee?: string, message?: string, reference?: Buffer, metaData?: VdxfUniValue | null,
    signature?: SignatureData | null, txid?: Buffer
  } = {}) {
    this.version = data.version || new BN(1, 10);
    this.flags = data.flags || new BN(0, 10);
    this.endorsee = data.endorsee || "";
    this.message = data.message || "";
    this.reference = data.reference || Buffer.alloc(0);
    this.metaData = data.metaData || null;
    this.signature = data.signature || null;
    this.txid = data.txid || Buffer.alloc(0);

  }

  getByteLength() {
    let byteLength = 0;

    byteLength += varint.encodingLength(this.version);
    byteLength += varint.encodingLength(this.flags);
    byteLength += varuint.encodingLength(Buffer.from(this.endorsee, 'utf-8').length);
    byteLength += Buffer.from(this.endorsee, 'utf-8').length;
    byteLength += varuint.encodingLength(this.reference.length);
    byteLength += this.reference.length;

    if (this.message && this.message.length > 0) {
      byteLength += varuint.encodingLength(Buffer.from(this.message, 'utf-8').length);
      byteLength += Buffer.from(this.message, 'utf-8').length;
    }

    if (this.metaData && Endorsement.FLAGS_HAS_METADATA.and(this.flags).gt(new BN(0))) {
      byteLength += this.metaData.getByteLength();
    }

    if (this.signature && Endorsement.FLAGS_HAS_SIGNATURE.and(this.flags).gt(new BN(0))) {
      byteLength += this.signature.getByteLength();
    }

    if (this.txid && Endorsement.FLAGS_HAS_TXID.and(this.flags).gt(new BN(0))) {
      byteLength += varuint.encodingLength(this.txid.length);
      byteLength += this.txid.length;
    }

    return byteLength
  }

  setFlags() {

    let flags = new BN(0, 10);

    if (this.metaData) {
      flags = flags.or(Endorsement.FLAGS_HAS_METADATA);
    }

    if (this.signature && this.signature.isValid()) {
      flags = flags.or(Endorsement.FLAGS_HAS_SIGNATURE);
    }

    if (this.txid && this.txid.length == 32) {
      flags = flags.or(Endorsement.FLAGS_HAS_TXID);
    }

    if (this.message && this.message.length > 0) {
      flags = flags.or(Endorsement.FLAGS_HAS_MESSAGE);
    }

    this.flags = flags;

  }

  toBuffer() {
    this.setFlags();
    const bufferWriter = new BufferWriter(Buffer.alloc(this.getByteLength()))

    bufferWriter.writeVarInt(this.version);
    bufferWriter.writeVarInt(this.flags);
    bufferWriter.writeVarSlice(Buffer.from(this.endorsee, 'utf-8'));
    bufferWriter.writeVarSlice(this.reference);
    
    if (this.message && this.message.length > 0) {
      bufferWriter.writeVarSlice(Buffer.from(this.message, 'utf-8'));
    }

    if (this.metaData && Endorsement.FLAGS_HAS_METADATA.and(this.flags).gt(new BN(0))) {
      bufferWriter.writeSlice(this.metaData.toBuffer());
    }

    if (this.signature && Endorsement.FLAGS_HAS_SIGNATURE.and(this.flags).gt(new BN(0))) {
      bufferWriter.writeVarSlice(this.signature.toBuffer());
    }

    if (this.txid && Endorsement.FLAGS_HAS_TXID.and(this.flags).gt(new BN(0))) {
      bufferWriter.writeSlice(this.txid);
    }

    return bufferWriter.buffer
  }

  fromBuffer(buffer: Buffer, offset: number = 0) {
    const reader = new BufferReader(buffer, offset);

    this.version = reader.readVarInt();
    this.flags = reader.readVarInt();
    this.endorsee = reader.readVarSlice().toString('utf-8');
    this.reference = reader.readVarSlice();

    if (Endorsement.FLAGS_HAS_MESSAGE.and(this.flags).gt(new BN(0))) {
      this.message = reader.readVarSlice().toString('utf-8');
    }

    if (Endorsement.FLAGS_HAS_METADATA.and(this.flags).gt(new BN(0))) {
      this.metaData = new VdxfUniValue();
      this.metaData.fromBuffer(reader.readVarSlice());
    }

    if (Endorsement.FLAGS_HAS_SIGNATURE.and(this.flags).gt(new BN(0))) {
      this.signature = new SignatureData();
      this.signature.fromBuffer(reader.readVarSlice());
    }

    if (Endorsement.FLAGS_HAS_TXID.and(this.flags).gt(new BN(0))) {
      this.txid = reader.readSlice(32);
    }

    return reader.offset;
  }

  toIdentityUpdateJson(type: VDXFKeyInterface): { [key: string]: { [key: string]: [string] } } {

    const contentmultimap = {};

    if (!type) {
      throw new Error('Type is required')
    }

    if (!this.signature || !this.signature.isValid()) {
      throw new Error('Signature is required')
    }

    if (!ENDORSEMENT_TYPES.includes(type)) {
      throw new Error('Unsupported endorsement type');
    }
    contentmultimap[type.vdxfid] = [{ serializedhex: this.toBuffer().toString('hex') }];

    return {
      contentmultimap: contentmultimap
    }

  }

  createHash(name) {

    if (!name) {
      throw new Error('Type is required')
    }

    if (this.signature) {
      throw new Error('Signature should be removed before creating a new one')
    }
    const data = this.toBuffer();

    return createHash('sha256').update(data).digest();

  }

  toJson() {

    let retVal = {
      version: this.version.toString(),
      flags: this.flags.toString(),
      endorsee: this.endorsee,
      message: this.message,
      reference: this.reference.toString('hex')
    }

    if (this.metaData && Endorsement.FLAGS_HAS_METADATA.and(this.flags).gt(new BN(0))) {
      retVal['metadata'] = this.metaData.toJson();
    }

    if (this.signature && Endorsement.FLAGS_HAS_SIGNATURE.and(this.flags).gt(new BN(0))) {
      retVal['signature'] = this.signature.toJson();
    }

    if (this.txid && Endorsement.FLAGS_HAS_TXID.and(this.flags).gt(new BN(0))) {
      retVal['txid'] = this.txid.toString('hex');
    }

    return retVal

  }

  static fromJson(json: EndorsementJson): Endorsement {

    const flags = new BN(json.flags || 0, 10);
    let metaData: VdxfUniValue | null = null;

    if (json.metadata && Endorsement.FLAGS_HAS_METADATA.and(flags).gt(new BN(0))) {
      metaData = VdxfUniValue.fromJson(json.metadata);
    }

    let signature: SignatureData | null = null;

    if (json.signature && Endorsement.FLAGS_HAS_SIGNATURE.and(flags).gt(new BN(0))) {
      signature = SignatureData.fromJson(json.signature);
    }

    let txid: Buffer = Buffer.alloc(0);

    if (json.txid) {
      txid = Buffer.from(json.txid, 'hex');
    }

    return new Endorsement({
      version: new BN(json.version, 10),
      flags,
      endorsee: json.endorsee,
      message: json.message,
      reference: Buffer.from(json.reference, 'hex'),
      metaData,
      signature,
      txid
    })
  }
}