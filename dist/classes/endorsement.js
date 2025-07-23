"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Endorsement = exports.ENDORSEMENT_PROJECT = exports.ENDORSEMENT_REFERENCE = exports.ENDORSEMENT_QUALIFICATION = exports.ENDORSEMENT_SKILL = exports.ENDORSEMENT = void 0;
const varuint_1 = require("verus-typescript-primitives/dist/utils/varuint");
const varint_1 = require("verus-typescript-primitives/dist/utils/varint");
const bufferutils_1 = require("verus-typescript-primitives/dist/utils/bufferutils");
const bn_js_1 = require("bn.js");
const verus_typescript_primitives_1 = require("verus-typescript-primitives");
const verusid_ts_client_1 = require("verusid-ts-client");
const crypto_1 = require("crypto");
const verusd = new verusid_ts_client_1.VerusIdInterface('VRSC', 'https://api.verustest.net');
const { BufferReader, BufferWriter } = bufferutils_1.default;
exports.ENDORSEMENT = {
    "vdxfid": "iDbPhzm8g7mQ94Cy2VNn7dJPVk5zcDRhPS",
    "indexid": "xJRWAoCDXRz4mE5ztB2w61pvXQ71WSXnGu",
    "hash160result": "dbfcb74829379cb79d39d9dbe81a76627bb8fd6e",
    "qualifiedname": {
        "namespace": "iNQFA8jtYe9JYq6Qr49ZxAhvWErFurWjTa",
        "name": "valu.vrsc::endorsement"
    }
};
exports.ENDORSEMENT_SKILL = {
    "vdxfid": "iBJqQMRzpCW1WVYoU2Ty2VbCJnvyTEsE1C",
    "indexid": "xG8ws9s5fWig8fRqKi87zt7jLSwzNoJ3s7",
    "hash160result": "309091e8f181bd19279b6cd8873aaafaf4d8eb55",
    "qualifiedname": {
        "namespace": "iNQFA8jtYe9JYq6Qr49ZxAhvWErFurWjTa",
        "name": "valu.vrsc::endorsement.skill"
    }
};
exports.ENDORSEMENT_QUALIFICATION = {
    "vdxfid": "iGW3WFP1h8ZDsJWLFMvTF3ZqLuiMRBK6jV",
    "indexid": "xML9y3p6YSmtVUPN73acDS6NNZjNE6JbQo",
    "hash160result": "d2f91effc976eee2d9574d4ab5e4f0456827e38e",
    "qualifiedname": {
        "namespace": "iNQFA8jtYe9JYq6Qr49ZxAhvWErFurWjTa",
        "name": "valu.vrsc::endorsement.qualification"
    }
};
exports.ENDORSEMENT_REFERENCE = {
    "vdxfid": "iArNtGt8xYWBQaDtYATfhdR1NXq1ecZgRp",
    "indexid": "xFgVM5KDorir2k6vPr7pg1wYQBr2VEywYv",
    "hash160result": "ebc99d117c8e67fa10dfdd6a3295d40458e5ea50",
    "qualifiedname": {
        "namespace": "iNQFA8jtYe9JYq6Qr49ZxAhvWErFurWjTa",
        "name": "valu.vrsc::endorsement.reference"
    }
};
exports.ENDORSEMENT_PROJECT = {
    "vdxfid": "i7tTikSbJcLDBFpZyb8Uk3UfVjsLxz25Q4",
    "indexid": "xCiaBYsg9vYsoRhbqGndiS1CXPtMpCtFg3",
    "hash160result": "0ff2447acd00a1c5494156edee5481591c636730",
    "qualifiedname": {
        "namespace": "iNQFA8jtYe9JYq6Qr49ZxAhvWErFurWjTa",
        "name": "valu.vrsc::endorsement.project"
    }
};
const ENDORSEMENT_TYPES = [exports.ENDORSEMENT_SKILL, exports.ENDORSEMENT_QUALIFICATION, exports.ENDORSEMENT_REFERENCE, exports.ENDORSEMENT_PROJECT];
class Endorsement {
    constructor(data = {}) {
        this.version = data.version || new bn_js_1.BN(1, 10);
        this.flags = data.flags || new bn_js_1.BN(0, 10);
        this.endorsee = data.endorsee || "";
        this.message = data.message || "";
        this.reference = data.reference || Buffer.alloc(0);
        this.metaData = data.metaData || null;
        this.signature = data.signature || null;
        this.txid = data.txid || Buffer.alloc(0);
    }
    getByteLength() {
        let byteLength = 0;
        byteLength += varint_1.default.encodingLength(this.version);
        byteLength += varint_1.default.encodingLength(this.flags);
        byteLength += varuint_1.default.encodingLength(Buffer.from(this.endorsee, 'utf-8').length);
        byteLength += Buffer.from(this.endorsee, 'utf-8').length;
        byteLength += varuint_1.default.encodingLength(this.reference.length);
        byteLength += this.reference.length;
        if (this.message && this.message.length > 0) {
            byteLength += varuint_1.default.encodingLength(Buffer.from(this.message, 'utf-8').length);
            byteLength += Buffer.from(this.message, 'utf-8').length;
        }
        if (this.metaData && Endorsement.FLAGS_HAS_METADATA.and(this.flags).gt(new bn_js_1.BN(0))) {
            byteLength += this.metaData.getByteLength();
        }
        if (this.signature && Endorsement.FLAGS_HAS_SIGNATURE.and(this.flags).gt(new bn_js_1.BN(0))) {
            byteLength += this.signature.getByteLength();
        }
        if (this.txid && Endorsement.FLAGS_HAS_TXID.and(this.flags).gt(new bn_js_1.BN(0))) {
            byteLength += this.txid.length;
        }
        return byteLength;
    }
    setFlags() {
        let flags = new bn_js_1.BN(0, 10);
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
        const bufferWriter = new BufferWriter(Buffer.alloc(this.getByteLength()));
        this.setFlags();
        bufferWriter.writeVarInt(this.version);
        bufferWriter.writeVarInt(this.flags);
        bufferWriter.writeVarSlice(Buffer.from(this.endorsee, 'utf-8'));
        bufferWriter.writeVarSlice(this.reference);
        if (this.message && this.message.length > 0) {
            bufferWriter.writeVarSlice(Buffer.from(this.message, 'utf-8'));
        }
        if (this.metaData && Endorsement.FLAGS_HAS_METADATA.and(this.flags).gt(new bn_js_1.BN(0))) {
            bufferWriter.writeSlice(this.metaData.toBuffer());
        }
        if (this.signature && Endorsement.FLAGS_HAS_SIGNATURE.and(this.flags).gt(new bn_js_1.BN(0))) {
            bufferWriter.writeSlice(this.signature.toBuffer());
        }
        if (this.txid && Endorsement.FLAGS_HAS_TXID.and(this.flags).gt(new bn_js_1.BN(0))) {
            bufferWriter.writeSlice(this.txid);
        }
        return bufferWriter.buffer;
    }
    fromBuffer(buffer, offset = 0) {
        const reader = new BufferReader(buffer, offset);
        this.version = reader.readVarInt();
        this.flags = reader.readVarInt();
        this.endorsee = reader.readVarSlice().toString('utf-8');
        this.reference = reader.readVarSlice();
        if (Endorsement.FLAGS_HAS_MESSAGE.and(this.flags).gt(new bn_js_1.BN(0))) {
            this.message = reader.readVarSlice().toString('utf-8');
        }
        if (Endorsement.FLAGS_HAS_METADATA.and(this.flags).gt(new bn_js_1.BN(0))) {
            this.metaData = new verus_typescript_primitives_1.VdxfUniValue();
            this.metaData.fromBuffer(reader.readVarSlice());
        }
        if (Endorsement.FLAGS_HAS_SIGNATURE.and(this.flags).gt(new bn_js_1.BN(0))) {
            this.signature = new verus_typescript_primitives_1.SignatureData();
            this.signature.fromBuffer(reader.readVarSlice());
        }
        if (Endorsement.FLAGS_HAS_TXID.and(this.flags).gt(new bn_js_1.BN(0))) {
            this.txid = reader.readSlice(32);
        }
        return reader.offset;
    }
    toIdentityUpdateJson(type) {
        const contentmultimap = {};
        if (!type) {
            throw new Error('Type is required');
        }
        if (!this.signature || !this.signature.isValid()) {
            throw new Error('Signature is required');
        }
        if (!ENDORSEMENT_TYPES.includes(type)) {
            throw new Error('Unsupported endorsement type');
        }
        contentmultimap[type.vdxfid] = [{ serializedhex: this.toBuffer().toString('hex') }];
        return {
            contentmultimap: contentmultimap
        };
    }
    createHash(name) {
        if (!name) {
            throw new Error('Type is required');
        }
        if (this.signature) {
            throw new Error('Signature should be removed before creating a new one');
        }
        const data = this.toBuffer();
        return (0, crypto_1.createHash)('sha256').update(data).digest();
    }
    toJson() {
        let retVal = {
            version: this.version.toString(),
            flags: this.flags.toString(),
            endorsee: this.endorsee,
            message: this.message,
            reference: this.reference.toString('hex')
        };
        if (this.metaData && Endorsement.FLAGS_HAS_METADATA.and(this.flags).gt(new bn_js_1.BN(0))) {
            retVal['metadata'] = this.metaData.toJson();
        }
        if (this.signature && Endorsement.FLAGS_HAS_SIGNATURE.and(this.flags).gt(new bn_js_1.BN(0))) {
            retVal['signature'] = this.signature.toJson();
        }
        if (this.txid && Endorsement.FLAGS_HAS_TXID.and(this.flags).gt(new bn_js_1.BN(0))) {
            retVal['txid'] = this.txid.toString('hex');
        }
        return retVal;
    }
    static fromJson(json) {
        const flags = new bn_js_1.BN(json.flags || 0, 10);
        let metaData = null;
        if (json.metadata && Endorsement.FLAGS_HAS_METADATA.and(flags).gt(new bn_js_1.BN(0))) {
            metaData = verus_typescript_primitives_1.VdxfUniValue.fromJson(json.metadata);
        }
        let signature = null;
        if (json.signature && Endorsement.FLAGS_HAS_SIGNATURE.and(flags).gt(new bn_js_1.BN(0))) {
            signature = verus_typescript_primitives_1.SignatureData.fromJson(json.signature);
        }
        let txid = Buffer.alloc(0);
        if (json.txid && Endorsement.FLAGS_HAS_TXID.and(flags).gt(new bn_js_1.BN(0))) {
            txid = Buffer.from(json.txid, 'hex');
        }
        return new Endorsement({
            version: new bn_js_1.BN(json.version, 10),
            flags,
            endorsee: json.endorsee,
            message: json.message,
            reference: Buffer.from(json.reference, 'hex'),
            metaData,
            signature,
            txid
        });
    }
}
exports.Endorsement = Endorsement;
Endorsement.VERSION_INVALID = new bn_js_1.BN(0, 10);
Endorsement.VERSION_FIRST = new bn_js_1.BN(1, 10);
Endorsement.VERSION_LAST = new bn_js_1.BN(1, 10);
Endorsement.VERSION_CURRENT = new bn_js_1.BN(1, 10);
Endorsement.FLAGS_HAS_METADATA = new bn_js_1.BN(1, 10);
Endorsement.FLAGS_HAS_SIGNATURE = new bn_js_1.BN(2, 10);
Endorsement.FLAGS_HAS_TXID = new bn_js_1.BN(4, 10);
Endorsement.FLAGS_HAS_MESSAGE = new bn_js_1.BN(8, 10);
