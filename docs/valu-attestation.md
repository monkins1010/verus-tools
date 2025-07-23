# ValuAttestation Class Documentation

The `ValuAttestation` class is designed to convert SumSub KYC (Know Your Customer) JSON data into Verus DataDescriptors for use in blockchain attestations and identity verification.

## Overview

This class provides a seamless way to transform third-party KYC data from SumSub into standardized Verus blockchain data structures, enabling identity attestations and verification on the Verus network.

## Installation

```bash
npm install verus-tools
```

## Basic Usage

```typescript
import { ValuAttestation } from 'verus-tools';

// Create ValuAttestation instance with SumSub data
const attestation = new ValuAttestation(sumSubData);

// Generate MMR data for blockchain storage
const identityFor = "identity1@";
const title = "SumSub KYC Verification";
const publicAddress = "RTqQe58LSj2yr5CrwYFwcsAQ1edQwmrkUU";

const mmrData = attestation.generateMMRData(identityFor, title, publicAddress);
console.log('MMR data generated:', mmrData.length, 'items');
```

## Complete Example: Creating Signed Attestation

Here's a complete example showing how to use ValuAttestation in the signing process:

```typescript


import { ValuAttestation } from 'verus-tools';
import { 
    primitives, 
    VerusId, 
    VdxfUniValue, 
    VDXF_Data 
} from 'verus-typescript-primitives';
import { VerusIdInterface } = from 'verusid-ts-client';
const baseURL = `${process.env.REMOTE_PROTOCOL}://${process.env.REMOTE_HOST}:${process.env.REMOTE_PORT}`;

const config = {
  auth: {
    username: process.env.REMOTE_USER,
    password: process.env.REMOTE_PASS
  }
};

const privateVerusRPC = new VerusdRpcInterface(process.env.VERUS_RPC_NETWORK, baseURL, config);
async function createAndSignValuAttestation(sumSubData: any) {
    try {
        // 1. Create ValuAttestation instance
        const attestation = new ValuAttestation(sumSubData);
        
        // 2. Generate MMR data with metadata for blockchain storage
        const identityFor = "identity1@";
        const attestor = "ValuAttestation@";
        const title = "SumSub KYC Verification";
        
        const mmrData = attestation.generateMMRData(identityFor, title, attestor);
        
        // 3. Prepare sign data package
        const VALU_ZADDRESS = "your_z_address_here";
        const signDataPackage = {
            address: attestor,
            createmmr: true,
            encryptoaddress: VALU_ZADDRESS,
            mmrdata: mmrData
        };

        // 4. Sign the data
        const attestationFromDaemon = await signdata([signDataPackage]);
        
        // 5. Create VDXF data object
        const vdxfDataObj = {
            [VDXF_Data.MMRDescriptorKey.vdxfid]: attestationFromDaemon.mmrdescriptor,
            [VDXF_Data.SignatureDataKey.vdxfid]: attestationFromDaemon.signaturedata
        };

        // 6. Verify signature
        const sigobject = primitives.SignatureData.fromJson(attestationFromDaemon.signaturedata);
        const sigInfo = await VerusId.getSignatureInfo(
            attestationFromDaemon.address, 
            attestationFromDaemon.signaturedata.signature
        );
        
        const signatureverified = await VerusId.verifyHash(
            attestationFromDaemon.signaturedata.identityid,
            attestationFromDaemon.signaturedata.signature,
            sigobject.getIdentityHash({ 
                version: sigInfo.version, 
                hash_type: sigInfo.hashtype, 
                height: sigInfo.height 
            })
        );

        // 7. Validate MMR
        const objectsBuffer = VdxfUniValue.fromJson(vdxfDataObj);
        const validMMR = validateMMR(
            objectsBuffer, 
            Buffer.from(attestationFromDaemon.mmrdescriptor.mmrroot.objectdata, 'hex')
        );

        console.log('Signature verified:', signatureverified);
        console.log('MMR valid:', validMMR);
        console.log('Applicant ID:', attestation.getApplicantId());
        console.log('Verification Status:', attestation.getVerificationStatus());
        
        return {
            attestation,
            attestationData: attestationFromDaemon,
            signatureVerified: signatureverified,
            mmrValid: validMMR,
            mmrData
        };
        
    } catch (error) {
        console.error('Error creating and signing VALU attestation:', error);
        throw error;
    }
}

// Usage
createAndSignValuAttestation(sumSubData)
    .then(result => {
        console.log('VALU attestation created and signed successfully:', result);
    })
    .catch(error => {
        console.error('Failed to create VALU attestation:', error);
    });
```

## SumSub Data Reference

The `sumSubData` object should follow this structure:

```typescript
const sumSubData = {
  id: "687e6a0f2966a7f001914c25",
  createdAt: "2025-07-21 16:25:51",
  key: "FWLTUDCVEHJBJQ",
  clientId: "arkeytyp.com_100370",
  inspectionId: "687e6a0f2966a7f001914c25",
  externalUserId: "copy-e2ed3c09-5ed0-4bd0-ad17-546392faa5b0",
  info: {
    firstName: "John",
    firstNameEn: "John",
    lastName: "Mock-Doe",
    lastNameEn: "Mock-Doe",
    dob: "2006-01-22",
    gender: "M",
    country: "SRB",
    nationality: "SRB",
    idDocs: [
      {
        idDocType: "PASSPORT",
        country: "SRB",
        firstName: "John",
        firstNameEn: "John",
        lastName: "Mock-Doe",
        lastNameEn: "Mock-Doe",
        validUntil: "2026-07-12",
        number: "Mock-W3XGD01WF2",
        dob: "2006-01-22",
        mrzLine1: "P<BLRLEANEN<<GEORGIA<<<<<<<<<<<<<<<<<<<<<<<<",
        mrzLine2: "U2HZWN97A1BLR0704113F3309276<<<<<<<<<<<<<<08",
      },
    ],
  },
  fixedInfo: {
    country: "GBR",
    addresses: [
      {
        street: "123 church street",
        streetEn: "123 church street",
        state: "derbyshire",
        stateEn: "derbyshire",
        town: "derby",
        townEn: "derby",
        postCode: "de23 1AA",
        country: "GBR",
        formattedAddress: "123 church street, derby, derbyshire, United Kingdom, de23 1AA",
      },
    ],
  },
  email: "monkins@yahoo.com",
  applicantPlatform: "Web",
  ipCountry: "GBR",
  review: {
    reviewId: "YuHVK",
    attemptId: "eVBHU",
    attemptCnt: 1,
    elapsedSincePendingMs: 537,
    elapsedSinceQueuedMs: 537,
    reprocessing: true,
    levelAutoCheckMode: null,
    createDate: "2025-07-21 16:25:51+0000",
    reviewDate: "2025-07-21 16:25:52+0000",
    reviewResult: {
      reviewAnswer: "GREEN",
    },
    reviewStatus: "completed",
    priority: 0,
  },
  lang: "en",
  type: "individual",
  notes: [],
  tags: ["Basic KYC Passed"],
  copyOf: null,
  reuseScope: "importApiShareToken",
};
```

## License

This project is licensed under the MIT License.
