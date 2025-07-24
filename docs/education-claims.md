# Education Claim Creation and Signing Guide

This guide demonstrates how to create Education claims using the verus-tools library and sign them for attestation on the Verus blockchain.

## Overview

The Education class allows you to create structured education claims that can be signed and verified on the Verus blockchain. These claims contain information about educational qualifications, including degrees, certifications, and other educational achievements.

## Installation

```bash
yarn install verus-tools
```

## Basic Usage

### 1. Creating an Education Object

First, create an education data object with the required fields:

```typescript
import { Education } from 'verus-tools';

// Define the education data
const educationJson = {
    "qualification": "Degree",
    "field": "Field of Study", 
    "startdate": "Start Date",
    "enddate": "End Date",
    "person": "Name of the person",
    "description": "Description",
    "status": "pending | complete",
    "id": "dc2c2c5a44fab0b62c4f1403bc9870824c246493a517d162e153ce2ab5fd9f22"
}

// Create an instance of Education with the data and an optional identity
const education = new Education(educationJson, "identity1@");
```

### 2. Creating MMR Data for Signing

Generate the MMR (Merkle Mountain Range) data that will be used in the signing process:

```typescript
// Create MMR data for the education claim
const mmrData = education.createMMRdata("identity1@");
```

### 3. Preparing the Sign Data Package

Create the package that will be sent to the Verus daemon for signing:

```typescript
// Define your encryption address (z-address)
const VALU_ZADDRESS = "your_z_address_here";

// Create the sign data package
const signDataPackage = {
    address: "ValuAttestation@",
    createmmr: true,
    encryptoaddress: VALU_ZADDRESS,
    mmrdata: education.toJson()  // Convert education to JSON format
}
```

### 4. Signing the Data

Send the package to the Verus daemon for signing:

```typescript
// Sign the data using the Verus daemon
const attestationFromDaemon = await signdata([signDataPackage]);
```

### 5. Creating VDXF Data Object

Create a VDXF (Verus Data Exchange Format) object with the signed data:

```typescript
import { VDXF_Data } from 'verus-typescript-primitives';

// Create VDXF data object with MMR descriptor and signature data
const vdxfDataObj = {
    [VDXF_Data.MMRDescriptorKey.vdxfid]: attestationFromDaemon.mmrdescriptor,
    [VDXF_Data.SignatureDataKey.vdxfid]: attestationFromDaemon.signaturedata
};
```

### 6. Verifying the Signature

Verify the signature and validate the MMR:

```typescript
import { primitives, VerusId, VdxfUniValue } from 'verus-typescript-primitives';

// Create signature object from JSON
const sigobject = primitives.SignatureData.fromJson(attestationFromDaemon.signaturedata);

// Get signature information
const sigInfo = await VerusId.getSignatureInfo(
    attestationFromDaemon.address, 
    attestationFromDaemon.signaturedata.signature
);

// Verify the signature
const signatureverified = await VerusId.verifyHash(
    attestationFromDaemon.signaturedata.identityid,
    attestationFromDaemon.signaturedata.signature,
    sigobject.getIdentityHash({ 
        version: sigInfo.version, 
        hash_type: sigInfo.hashtype, 
        height: sigInfo.height 
    })
);

// Create objects buffer from VDXF data
const objectsBuffer = VdxfUniValue.fromJson(vdxfDataObj);

// Validate the MMR
const validMMR = validateMMR(
    objectsBuffer, 
    Buffer.from(attestationFromDaemon.mmrdescriptor.mmrroot.objectdata, 'hex')
);
```

## Complete Example

Here's a complete example that puts it all together:

```typescript
import { Education } from 'verus-tools';
import { 
    primitives, 
    VerusId, 
    VdxfUniValue
} from 'verus-typescript-primitives';
const VDXF_Data = require("verus-typescript-primitives/dist/vdxf/vdxfdatakeys");

async function createAndSignEducationClaim() {
    try {
        // 1. Create education data
        const educationJson = {
            "qualification": "Bachelor of Science",
            "field": "Computer Science",
            "startdate": "2024-09-01",
            "enddate": "2027-05-15",
            "person": "John Doe",
            "status": "PENDING",
            "description": "Bachelor's degree in Computer Science",
            "id": "dc2c2c5a44fab0b62c4f1403bc9870824c246493a517d162e153ce2ab5fd9f22"
        }

        // 2. Create Education instance
        const education = new Education(educationJson, "identity1@");
        
        // 3. Prepare sign data package
        const VALU_ZADDRESS = "your_z_address_here";
        const signDataPackage = {
            address: "ValuAttestation@",
            createmmr: true,
            encryptoaddress: VALU_ZADDRESS,
            mmrdata: education.toJson()
        }

        // 4. Sign the data this is the same as ./verus signdata {signDataPackage}
        // you may have to implment your own signdata
        const attestationFromDaemon = await signdata([signDataPackage]);
        
        // 5. Create VDXF data object for the login challenge
        const vdxfDataObj = {
            [VDXF_Data.MMRDescriptorKey.vdxfid]: attestationFromDaemon.mmrdescriptor,
            [VDXF_Data.SignatureDataKey.vdxfid]: attestationFromDaemon.signaturedata
        };

        const objectsBuffer = VdxfUniValue.fromJson(vdxfDataObj);

        // 6. Create Login request with Education Attestation
        const reply = await VerusId.createLoginConsentRequest(
        VALU_ID,  // valuattestation@
        new primitives.LoginConsentChallenge({
        challenge_id: challenge_id,
        requested_access: [
          new primitives.RequestedPermission(primitives.IDENTITY_VIEW.vdxfid)
        ],
        redirect_uris: [],
        subject: [],
        provisioning_info: [],
        attestations: [
          new primitives.Attestation(objectsBuffer.toBuffer().toString("hex"), primitives.ATTESTATION_PROVISION_OBJECT.vdxfid)
        ],
        created_at: Number((Date.now() / 1000).toFixed(0)),
      }),
      VALU_LOGIN_WIF //private key for VALU_ID
    );
        
    return  reply.toWalletDeeplinkUri();
        
    } catch (error) {
        console.error('Error creating and signing education claim:', error);
        throw error;
    }
}

// Usage
createAndSignEducationClaim()
    .then(result => {
        console.log('Education claim created and signed successfully:', result);
    })
    .catch(error => {
        console.error('Failed to create education claim:', error);
    });
```

## Education Data Fields

The education object requires the following fields:

- **qualification**: The type of qualification (e.g., "Degree", "Certificate", "Diploma")
- **field**: The field of study (e.g., "Computer Science", "Medicine")
- **startdate**: The start date of the education program
- **enddate**: The end date or graduation date
- **person**: The name of the person who earned the qualification
- **description**: Additional description or details about the education
- **id**: A unique identifier for this education record

## Methods Available

### Education Class Methods

- `constructor(data: EducationData, identity?: string)`: Creates a new Education instance
- `createMMRdata(identity?: string)`: Creates MMR data for signing
- `createIdentityUpdateJson()`: Creates identity update JSON format
- `toJson()`: Converts the education claim to JSON format

## Error Handling

Always wrap your education claim creation and signing in try-catch blocks to handle potential errors:

```typescript
try {
    const education = new Education(educationJson, "identity1@");
    const result = await signdata([signDataPackage]);
    // Process result
} catch (error) {
    console.error('Error processing education claim:', error);
    // Handle error appropriately
}
```

## Security Considerations

1. **Private Keys**: Ensure your private keys and z-addresses are kept secure
2. **Data Validation**: Validate all input data before creating education claims
3. **Signature Verification**: Always verify signatures before trusting attestation data
4. **MMR Validation**: Validate MMR data to ensure integrity

## Contributing

For issues, feature requests, or contributions, please visit the [GitHub repository](https://github.com/Monkins1010/verus-tools).

## License

This project is licensed under the MIT License.
