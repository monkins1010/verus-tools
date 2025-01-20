"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Endorsement = exports.ENDORSEMENT_EMPLOYMENT_PERSONAL = void 0;
const varuint_1 = require("verus-typescript-primitives/dist/utils/varuint");
const varint_1 = require("verus-typescript-primitives/dist/utils/varint");
const bufferutils_1 = require("verus-typescript-primitives/dist/utils/bufferutils");
const bn_js_1 = require("bn.js");
const verus_typescript_primitives_1 = require("verus-typescript-primitives");
const { BufferReader, BufferWriter } = bufferutils_1.default;
exports.ENDORSEMENT_EMPLOYMENT_PERSONAL = {
    "vdxfid": "iD1JEZLLWPvrepAtngcrweeDeypeBSCjdw",
    "indexid": "xHqQhMmRMi9XGz3veNH1v3Akgdqf6kAhJb",
    "hash160result": "1a18d9f343f293d8c9569c12ccd82b6e5d028b68",
    "qualifiedname": {
        "namespace": "iNQFA8jtYe9JYq6Qr49ZxAhvWErFurWjTa",
        "name": "valu.vrsc::endorsement.employment.personal"
    }
};
class Endorsement {
    constructor(data = {}) {
        this.version = data.version || new bn_js_1.BN(1, 10);
        this.flags = data.flags || new bn_js_1.BN(0, 10);
        this.endorsee = data.endorsee || "";
        this.message = data.message || "";
        this.reference = data.reference || Buffer.alloc(0);
        this.metaData = data.metaData || null;
    }
    getByteLength() {
        let byteLength = 0;
        byteLength += varint_1.default.encodingLength(this.version);
        byteLength += varint_1.default.encodingLength(this.flags);
        byteLength += varuint_1.default.encodingLength(Buffer.from(this.endorsee, 'utf-8').length);
        byteLength += Buffer.from(this.endorsee, 'utf-8').length;
        byteLength += varuint_1.default.encodingLength(Buffer.from(this.message, 'utf-8').length);
        byteLength += Buffer.from(this.message, 'utf-8').length;
        byteLength += varuint_1.default.encodingLength(this.reference.length);
        byteLength += this.reference.length;
        if (this.metaData) {
            byteLength += this.metaData.getByteLength();
        }
        return byteLength;
    }
    toBuffer() {
        const bufferWriter = new BufferWriter(Buffer.alloc(this.getByteLength()));
        bufferWriter.writeVarInt(this.version);
        bufferWriter.writeVarInt(this.flags);
        bufferWriter.writeVarSlice(Buffer.from(this.endorsee, 'utf-8'));
        bufferWriter.writeVarSlice(Buffer.from(this.message, 'utf-8'));
        bufferWriter.writeVarSlice(this.reference);
        if (this.metaData && Endorsement.FLAGS_HAS_METADATA.and(this.flags).gt(new bn_js_1.BN(0))) {
            bufferWriter.writeSlice(this.metaData.toBuffer());
        }
        return bufferWriter.buffer;
    }
    fromBuffer(buffer, offset = 0) {
        const reader = new BufferReader(buffer, offset);
        this.version = reader.readVarInt();
        this.flags = reader.readVarInt();
        this.endorsee = reader.readVarSlice().toString('utf-8');
        this.message = reader.readVarSlice().toString('utf-8');
        this.reference = reader.readVarSlice();
        if (Endorsement.FLAGS_HAS_METADATA.and(this.flags).gt(new bn_js_1.BN(0))) {
            this.metaData = new verus_typescript_primitives_1.VdxfUniValue();
            this.metaData.fromBuffer(reader.readVarSlice());
        }
        return reader.offset;
    }
    toIdentityUpdateJson(type = exports.ENDORSEMENT_EMPLOYMENT_PERSONAL.vdxfid) {
        const contentmultimap = {};
        if (type == exports.ENDORSEMENT_EMPLOYMENT_PERSONAL.vdxfid) {
            contentmultimap[exports.ENDORSEMENT_EMPLOYMENT_PERSONAL.vdxfid] = [{ serializedhex: this.toBuffer().toString('hex') }];
        }
        else {
            throw new Error('Unsupported endorsement type');
        }
        return {
            contentmultimap: contentmultimap
        };
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
        return retVal;
    }
    static fromJson(json) {
        const flags = new bn_js_1.BN(json.flags || 0, 10);
        let metaData = null;
        if (json.metadata && Endorsement.FLAGS_HAS_METADATA.and(flags).gt(new bn_js_1.BN(0))) {
            metaData = verus_typescript_primitives_1.VdxfUniValue.fromJson(json.metadata);
        }
        return new Endorsement({
            version: new bn_js_1.BN(json.version, 10),
            flags,
            endorsee: json.endorsee,
            message: json.message,
            reference: Buffer.from(json.reference, 'hex'),
            metaData
        });
    }
}
exports.Endorsement = Endorsement;
Endorsement.VERSION_INVALID = new bn_js_1.BN(0, 10);
Endorsement.VERSION_FIRST = new bn_js_1.BN(1, 10);
Endorsement.VERSION_LAST = new bn_js_1.BN(1, 10);
Endorsement.VERSION_CURRENT = new bn_js_1.BN(1, 10);
Endorsement.FLAGS_HAS_METADATA = new bn_js_1.BN(1, 10);
