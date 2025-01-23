import { Identity } from 'verus-typescript-primitives';

import varuint from 'verus-typescript-primitives/dist/utils/varuint'
import varint from 'verus-typescript-primitives/dist/utils/varint'
import { fromBase58Check, toBase58Check } from "verus-typescript-primitives/dist/utils/address";
import bufferutils from 'verus-typescript-primitives/dist/utils/bufferutils'
import { BN } from 'bn.js';
import { BigNumber } from 'verus-typescript-primitives/dist/utils/types/BigNumber';
import { I_ADDR_VERSION } from 'verus-typescript-primitives/dist/constants/vdxf';
import { SerializableEntity } from 'verus-typescript-primitives/dist/utils/types/SerializableEntity';
import { VdxfUniValue, SignatureData, SignatureJsonDataInterface  } from 'verus-typescript-primitives' 

const { BufferReader, BufferWriter } = bufferutils

export const ENDORSEMENT_EMPLOYMENT_PERSONAL = {
  "vdxfid": "iD1JEZLLWPvrepAtngcrweeDeypeBSCjdw",
  "indexid": "xHqQhMmRMi9XGz3veNH1v3Akgdqf6kAhJb",
  "hash160result": "1a18d9f343f293d8c9569c12ccd82b6e5d028b68",
  "qualifiedname": {
    "namespace": "iNQFA8jtYe9JYq6Qr49ZxAhvWErFurWjTa",
    "name": "valu.vrsc::endorsement.employment.personal"
  }
}


export interface EndorsementJson {
  version: number;
  flags?: number;
  endorsee: string;
  message: string;
  reference: string;
  metadata?: any;
  signature?: SignatureJsonDataInterface;

}

export class Endorsement implements SerializableEntity {

  static VERSION_INVALID = new BN(0, 10)
  static VERSION_FIRST = new BN(1, 10)
  static VERSION_LAST = new BN(1, 10)
  static VERSION_CURRENT = new BN(1, 10)

  static FLAGS_HAS_METADATA = new BN(1, 10)
  static FLAGS_HAS_SIGNATURE = new BN(2, 10)

  version: BigNumber;
  flags: BigNumber;
  endorsee: string;
  message: string;
  reference: Buffer;
  metaData: VdxfUniValue | null;
  signature: SignatureData | null;

  constructor(data: { version?: BigNumber, flags?: BigNumber, endorsee?: string, message?: string, reference?: Buffer, metaData?: VdxfUniValue | null,
                signature?: SignatureData | null } = {}) {
    this.version = data.version || new BN(1, 10);
    this.flags = data.flags || new BN(0, 10);
    this.endorsee = data.endorsee || "";
    this.message = data.message || "";
    this.reference = data.reference || Buffer.alloc(0);
    this.metaData = data.metaData || null;
    this.signature = data.signature || null;

  }

  getByteLength() {
    let byteLength = 0;

    byteLength += varint.encodingLength(this.version);
    byteLength += varint.encodingLength(this.flags);
    byteLength += varuint.encodingLength(Buffer.from(this.endorsee, 'utf-8').length);
    byteLength += Buffer.from(this.endorsee, 'utf-8').length;
    byteLength += varuint.encodingLength(Buffer.from(this.message, 'utf-8').length);
    byteLength += Buffer.from(this.message, 'utf-8').length;

    byteLength += varuint.encodingLength(this.reference.length);
    byteLength += this.reference.length;

    if (this.metaData && Endorsement.FLAGS_HAS_METADATA.and(this.flags).gt(new BN(0))) {
      byteLength += this.metaData.getByteLength();
    }

    if (this.signature && Endorsement.FLAGS_HAS_SIGNATURE.and(this.flags).gt(new BN(0))) {
      byteLength += this.signature.getByteLength();
    }

    return byteLength
  }

  setFlags(){

    let flags = new BN(0, 10);

    if (this.metaData) {
      flags = flags.or(Endorsement.FLAGS_HAS_METADATA);
    }

    if (this.signature && this.signature.isValid()) {
      flags = flags.or(Endorsement.FLAGS_HAS_SIGNATURE);
    }

    this.flags = flags;

  }

  toBuffer() {
    const bufferWriter = new BufferWriter(Buffer.alloc(this.getByteLength()))

    this.setFlags();
    bufferWriter.writeVarInt(this.version);
    bufferWriter.writeVarInt(this.flags);
    bufferWriter.writeVarSlice(Buffer.from(this.endorsee, 'utf-8'));
    bufferWriter.writeVarSlice(Buffer.from(this.message, 'utf-8'));
    bufferWriter.writeVarSlice(this.reference);

    if (this.metaData && Endorsement.FLAGS_HAS_METADATA.and(this.flags).gt(new BN(0))) {
      bufferWriter.writeSlice(this.metaData.toBuffer());
    }

    if (this.signature && Endorsement.FLAGS_HAS_SIGNATURE.and(this.flags).gt(new BN(0))) {
      bufferWriter.writeSlice(this.signature.toBuffer());
    }

    return bufferWriter.buffer
  }

  fromBuffer(buffer: Buffer, offset: number = 0) {
    const reader = new BufferReader(buffer, offset);

    this.version = reader.readVarInt();
    this.flags = reader.readVarInt();
    this.endorsee = reader.readVarSlice().toString('utf-8');
    this.message = reader.readVarSlice().toString('utf-8');
    this.reference = reader.readVarSlice();

    if(Endorsement.FLAGS_HAS_METADATA.and(this.flags).gt(new BN(0))) {
      this.metaData = new VdxfUniValue();
      this.metaData.fromBuffer(reader.readVarSlice());
    }

    if(Endorsement.FLAGS_HAS_SIGNATURE.and(this.flags).gt(new BN(0))) {
      this.signature = new SignatureData();
      this.signature.fromBuffer(reader.readVarSlice());
    }

    return reader.offset;
  }

  toIdentityUpdateJson(type = ENDORSEMENT_EMPLOYMENT_PERSONAL.vdxfid ): {[key: string]: {[key: string]:[string]}} {

    const contentmultimap = {};

    if (type == ENDORSEMENT_EMPLOYMENT_PERSONAL.vdxfid) {

      contentmultimap[ENDORSEMENT_EMPLOYMENT_PERSONAL.vdxfid] = [{serializedhex: this.toBuffer().toString('hex')}];
    }
    else {
      throw new Error('Unsupported endorsement type')
    }

    return {
      contentmultimap: contentmultimap
    }

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

    return retVal

  }

  static fromJson(json: EndorsementJson) {

    const flags = new BN(json.flags || 0, 10);
    let metaData:VdxfUniValue | null = null;

    if (json.metadata && Endorsement.FLAGS_HAS_METADATA.and(flags).gt(new BN(0))) {
      metaData = VdxfUniValue.fromJson(json.metadata);
    }

    let signature:SignatureData | null = null;

    if (json.signature && Endorsement.FLAGS_HAS_SIGNATURE.and(flags).gt(new BN(0))) {
      signature = SignatureData.fromJson(json.signature);
    }

    return new Endorsement({
      version: new BN(json.version, 10),
      flags,
      endorsee: json.endorsee,
      message: json.message,
      reference: Buffer.from(json.reference, 'hex'),
      metaData,
      signature
    })
  }
}