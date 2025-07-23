"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Claim = exports.ATTESTATION_ID = exports.CLAIM = exports.CLAIM_EXPERIENCE = exports.CLAIM_SKILL = exports.CLAIM_EDUCATION = exports.CLAIM_CERTIFICATION = exports.CLAIM_ACHIEVEMENT = exports.CLAIM_EMPLOYMENT = void 0;
const varuint_1 = require("verus-typescript-primitives/dist/utils/varuint");
const varint_1 = require("verus-typescript-primitives/dist/utils/varint");
const bufferutils_1 = require("verus-typescript-primitives/dist/utils/bufferutils");
const bn_js_1 = require("bn.js");
const verus_typescript_primitives_1 = require("verus-typescript-primitives");
const { BufferReader, BufferWriter } = bufferutils_1.default;
const { randomBytes } = require('crypto');
exports.CLAIM_EMPLOYMENT = {
    "vdxfid": "i3bgiLuaxTr6smF8q6xLG4jvvhF1mmrkM2",
    "indexid": "x8RoB9Lfon4mVw8AgncVETGTxMG2jfebR7",
    "hash160result": "3efffa2be6e73fd7320b7c3d035266359fa85a01",
    "qualifiedname": {
        "namespace": "iNQFA8jtYe9JYq6Qr49ZxAhvWErFurWjTa",
        "name": "valu.vrsc::claim.employment"
    }
};
exports.CLAIM_ACHIEVEMENT = {
    "vdxfid": "i51jfK8wZrKa5LgF7pkbow8hV1Hv6nBm2K",
    "indexid": "x9qr87a2RAYEhWZGyWQknKfEWfJw51yvxx",
    "hash160result": "75c441fa22d809f7f213ac9476e2ed8d6b3adf10",
    "qualifiedname": {
        "namespace": "iNQFA8jtYe9JYq6Qr49ZxAhvWErFurWjTa",
        "name": "valu.vrsc::claim.achievement"
    }
};
exports.CLAIM_CERTIFICATION = {
    "vdxfid": "iPkJZJiwZSJrgnmunhQPnkWsyY28tngW2W",
    "indexid": "xUaR27A2QkXXJxeweP4Ym93R1C39mLRF52",
    "hash160result": "3bf5d779348c057ff91cd978418dd3ef5a6c5ede",
    "qualifiedname": {
        "namespace": "iNQFA8jtYe9JYq6Qr49ZxAhvWErFurWjTa",
        "name": "valu.vrsc::claim.certification"
    }
};
exports.CLAIM_EDUCATION = {
    "vdxfid": "iJ5sikvjEbSkijSxwWQ2J197XVTzunm6kP",
    "indexid": "xNuzBZMp5ufRLuKzoC4BGPfeZ9V1nwEu4R",
    "hash160result": "603c2e5af4e38e6270277a80393510d53f4141a0",
    "qualifiedname": {
        "namespace": "iNQFA8jtYe9JYq6Qr49ZxAhvWErFurWjTa",
        "name": "valu.vrsc::claim.education"
    }
};
exports.CLAIM_SKILL = {
    "vdxfid": "iEpYe4cC73H7i9ay3G8geAjD1tFAhWscvj",
    "indexid": "xKef6s3GxMVnLKTztwnqcZFk3YGBZqbnP7",
    "hash160result": "53c4491d3168594da785eb6e3c7bbed4cab5727c",
    "qualifiedname": {
        "namespace": "iNQFA8jtYe9JYq6Qr49ZxAhvWErFurWjTa",
        "name": "valu.vrsc::claim.skill"
    }
};
exports.CLAIM_EXPERIENCE = {
    "vdxfid": "iFqtB6XGZmuUKW3Bzongrnum4QAf25Hgfu",
    "indexid": "xLfzdtxMR688wfvDrVSqqBSJ64BfzAv3s9",
    "hash160result": "4570c7949267c52bfdedd9d1147d91db148fab87",
    "qualifiedname": {
        "namespace": "iNQFA8jtYe9JYq6Qr49ZxAhvWErFurWjTa",
        "name": "valu.vrsc::claim.experience"
    }
};
exports.CLAIM = {
    "vdxfid": "i4d7U1aZhmoxZbWx8AVezh6z1YewAnuw3V",
    "indexid": "x9TDvp1eZ62dBmPyyr9oy5dX3Cfx6naxiE",
    "hash160result": "46d2c3d56026b9bf861d2cb4ae735f1bf3dc970c",
    "qualifiedname": {
        "namespace": "iNQFA8jtYe9JYq6Qr49ZxAhvWErFurWjTa",
        "name": "valu.vrsc::claim"
    }
};
exports.ATTESTATION_ID = {
    "vdxfid": "iAttestationId123456789", // placeholder - replace with actual VDXF key
};
class Claim {
    constructor(input) {
        this.version = (input === null || input === void 0 ? void 0 : input.version) || new bn_js_1.BN(1, 10);
        this.data = input === null || input === void 0 ? void 0 : input.data;
        this.flags = new bn_js_1.BN(0, 10); // Default flags, can be set later
        this.type = (input === null || input === void 0 ? void 0 : input.type) || null;
    }
    setData(data) {
        this.data = Object.assign(Object.assign({}, this.data), data);
    }
    getByteLength() {
        let byteLength = 0;
        byteLength += varint_1.default.encodingLength(this.version);
        byteLength += varint_1.default.encodingLength(this.flags); // flag for type presence
        byteLength += varint_1.default.encodingLength(this.type);
        // Serialize the data object to JSON string and get its byte length
        const dataJson = JSON.stringify(this.data);
        byteLength += varuint_1.default.encodingLength(Buffer.from(dataJson, 'utf-8').byteLength);
        byteLength += Buffer.from(dataJson, 'utf-8').byteLength;
        return byteLength;
    }
    toBuffer() {
        const bufferWriter = new BufferWriter(Buffer.alloc(this.getByteLength()));
        bufferWriter.writeVarInt(this.version);
        bufferWriter.writeVarInt(this.flags); // flag for type presence
        bufferWriter.writeVarInt(this.type);
        // Serialize the data object to JSON and write it
        const dataJson = JSON.stringify(this.data);
        bufferWriter.writeVarSlice(Buffer.from(dataJson, 'utf-8'));
        return bufferWriter.buffer;
    }
    fromBuffer(buffer, offset = 0) {
        const reader = new BufferReader(buffer, offset);
        this.version = reader.readVarInt();
        this.flags = reader.readVarInt(); // flag for type presence
        this.type = reader.readVarInt();
        // Read the data object from JSON
        const dataJson = reader.readVarSlice().toString('utf-8');
        this.data = JSON.parse(dataJson);
        return reader.offset;
    }
    toIdentityUpdateJson() {
        if (!this.type) {
            throw new Error('Claim type is required');
        }
        // Create a single data descriptor with the claim type as label and serialized claim as data
        const claimDescriptor = new verus_typescript_primitives_1.DataDescriptor({
            version: new bn_js_1.BN(1),
            objectdata: this.toBuffer()
        });
        claimDescriptor.SetFlags();
        const contentmultimap = {};
        contentmultimap[exports.CLAIM.vdxfid] = [{ serializedhex: claimDescriptor.toBuffer().toString('hex') }];
        return {
            contentmultimap
        };
    }
    toMMRData(recievingIdentity) {
        // Create a single data descriptor with the claim type as label and serialized claim as data
        const claimDescriptor = new verus_typescript_primitives_1.DataDescriptor({
            version: new bn_js_1.BN(1),
            label: exports.CLAIM.vdxfid,
            objectdata: this.toBuffer()
        });
        claimDescriptor.SetFlags();
        const mmrdata = [];
        mmrdata.push({ vdxfdata: { ["i4GC1YGEVD21afWudGoFJVdnfjJ5XWnCQv"]: claimDescriptor.toJson() } });
        if (recievingIdentity) {
            const tmpDataDescriptor = new verus_typescript_primitives_1.DataDescriptor({
                version: new bn_js_1.BN(1),
                label: 'receiving_identity',
                objectdata: Buffer.from(recievingIdentity, 'utf-8'),
                mimeType: 'text/plain'
            });
            // Set flags for the data descriptor
            tmpDataDescriptor.SetFlags();
            mmrdata.push({ vdxfdata: { ["i4GC1YGEVD21afWudGoFJVdnfjJ5XWnCQv"]: tmpDataDescriptor.toJson() } });
        }
        return mmrdata;
    }
    static storeMultipleClaimsInID(claims) {
        const contentmultimap = new Map();
        const array = new Array();
        claims.forEach((claim, index) => {
            const objectData = claim.toBuffer();
            const claimDescriptor = new verus_typescript_primitives_1.DataDescriptor({
                version: new bn_js_1.BN(1),
                objectdata: objectData,
                label: exports.CLAIM.vdxfid
            });
            claimDescriptor.SetFlags();
            const uniValu = new verus_typescript_primitives_1.VdxfUniValue({ values: new Array({ [verus_typescript_primitives_1.DataDescriptorKey.vdxfid]: claimDescriptor }) });
            array.push(uniValu);
        });
        contentmultimap.set(exports.CLAIM.vdxfid, array);
        const content = new verus_typescript_primitives_1.ContentMultiMap({ kv_content: contentmultimap });
        return content;
    }
}
exports.Claim = Claim;
Claim.VERSION_INVALID = new bn_js_1.BN(0, 10);
Claim.VERSION_FIRST = new bn_js_1.BN(1, 10);
Claim.VERSION_LAST = new bn_js_1.BN(1, 10);
Claim.VERSION_CURRENT = new bn_js_1.BN(1, 10);
Claim.TYPES = {
    TYPE_EXPERIENCE: new bn_js_1.BN(0, 10),
    TYPE_ACHIEVEMENT: new bn_js_1.BN(1, 10),
    TYPE_CERTIFICATION: new bn_js_1.BN(2, 10),
    TYPE_EDUCATION: new bn_js_1.BN(3, 10),
    TYPE_EMPLOYMENT: new bn_js_1.BN(4, 10),
    TYPE_SKILL: new bn_js_1.BN(5, 10)
};
