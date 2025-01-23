"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Claim = exports.CLAIM_SKILL = exports.CLAIM_EDUCATION = exports.CLAIM_CERTIFICATION = exports.CLAIM_ACHIEVEMENT = exports.CLAIM_EMPLOYMENT = void 0;
const bufferutils_1 = require("verus-typescript-primitives/dist/utils/bufferutils");
const bn_js_1 = require("bn.js");
const VDXF_Data = require("verus-typescript-primitives/dist/vdxf/vdxfdatakeys");
const verus_typescript_primitives_1 = require("verus-typescript-primitives");
const { BufferReader, BufferWriter } = bufferutils_1.default;
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
class Claim {
    constructor(input) {
        this.data = input.data;
        if (this.data == null) {
            this.initialize();
        }
        this.type = input.type || null;
    }
    initialize() {
        const descriptor = verus_typescript_primitives_1.DataDescriptor.fromJson({
            version: new bn_js_1.BN(1),
            label: 'version',
            objectdata: '01'
        });
        const newMap = new Map();
        newMap.set(VDXF_Data.DataDescriptorKey.vdxfid, descriptor);
        this.data = [new verus_typescript_primitives_1.VdxfUniValue()];
        this.data[0].values = newMap;
    }
    appendDataDescriptor(descriptor) {
        const newMap = new Map();
        newMap.set(VDXF_Data.DataDescriptorKey.vdxfid, descriptor);
        this.data.push(new verus_typescript_primitives_1.VdxfUniValue());
        this.data[this.data.length - 1].values = newMap;
    }
    createClaimData(data) {
        if (!this.type) {
            throw new Error('Claim type is required');
        }
        const typeDescriptor = verus_typescript_primitives_1.DataDescriptor.fromJson({
            version: new bn_js_1.BN(1),
            label: 'type',
            mimetype: 'text/plain',
            objectdata: { message: this.type }
        });
        this.appendDataDescriptor(typeDescriptor);
        if (!data.title || data.title.length == 0) {
            throw new Error('Claim title is required');
        }
        const titleDescriptor = verus_typescript_primitives_1.DataDescriptor.fromJson({
            version: new bn_js_1.BN(1),
            label: 'title',
            mimetype: 'text/plain',
            objectdata: { message: data.title }
        });
        this.appendDataDescriptor(titleDescriptor);
        if (!data.body || data.body.length == 0) {
            throw new Error('Claim body is required');
        }
        const bodyDescriptor = verus_typescript_primitives_1.DataDescriptor.fromJson({
            version: new bn_js_1.BN(1),
            label: 'body',
            mimetype: 'text/plain',
            objectdata: { message: data.body }
        });
        this.appendDataDescriptor(bodyDescriptor);
        if (data.dates) {
            const datesDescriptor = verus_typescript_primitives_1.DataDescriptor.fromJson({
                version: new bn_js_1.BN(1),
                label: 'dates',
                mimetype: 'text/plain',
                objectdata: { message: data.dates }
            });
            this.appendDataDescriptor(datesDescriptor);
        }
        if (data.issued) {
            const issuedDescriptor = verus_typescript_primitives_1.DataDescriptor.fromJson({
                version: new bn_js_1.BN(1),
                label: 'issued',
                mimetype: 'text/plain',
                objectdata: { message: data.issued }
            });
            this.appendDataDescriptor(issuedDescriptor);
        }
    }
    typeToVdxfid(type) {
        switch (type) {
            case 'experience':
                return exports.CLAIM_EMPLOYMENT.vdxfid;
            case 'achievement':
                return exports.CLAIM_ACHIEVEMENT.vdxfid;
            case 'certification':
                return exports.CLAIM_CERTIFICATION.vdxfid;
            case 'education':
                return exports.CLAIM_EDUCATION.vdxfid;
            case 'employment':
                return exports.CLAIM_EMPLOYMENT.vdxfid;
            case 'skill':
                return exports.CLAIM_SKILL.vdxfid;
            default:
                throw new Error('Unsupported claim type');
        }
    }
    toIdentityUpdateJson() {
        const contentmultimap = {};
        contentmultimap[this.typeToVdxfid(this.type)] = this.data.map((value) => {
            return value.toJson();
        });
        return {
            contentmultimap
        };
    }
}
exports.Claim = Claim;
Claim.TYPES = {
    TYPE_EXPERIENCE: 'experience',
    TYPE_ACHIEVEMENT: 'achievement',
    TYPE_CERTIFICATION: 'certification',
    TYPE_EDUCATION: 'education',
    TYPE_EMPLOYMENT: 'employment',
    TYPE_SKILL: 'skill'
};
