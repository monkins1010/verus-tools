# Requesting Attestation Information Guide

This guide demonstrates how to use the `RequestInformation` class to request specific attestation data and incorporate it into a login consent challenge for the Verus blockchain.

## Overview

The `RequestInformation` system allows you to create structured requests for specific attestation data from identity holders. This is useful when you need to verify credentials, claims, or other attestation information before granting access or completing transactions.

## Installation

```bash
yarn install https://github.com/monkins1010/verus-typescript-primitives.git#attestandvdxfobj
```

## Understanding Request Components

### RequestItem

Each request item specifies:
- **Format**: How you want the data returned (FULL_DATA, PARTIAL_DATA, COLLECTION)
- **Type**: What kind of information (ATTESTATION, CLAIM, CREDENTIAL)
- **ID**: Specific iaddress: messagevalue of datadescriptor
- **Signer**: The identity that signed the attestation
- **Requested Keys**: Optional specific iaddress keys of attestations when using PARTIAL_DATA

### Request Formats

```typescript
import { RequestedFormatFlags } from 'verus-typescript-primitives';

// Available formats:
RequestedFormatFlags.FULL_DATA     // Complete credential data
RequestedFormatFlags.PARTIAL_DATA  // Specific leaf + proof + signature
RequestedFormatFlags.COLLECTION    // Multiple FULL_DATA items
```

### Information Types

```typescript
import { InformationType, IDENTITY_NATIONALITY, ATTESTATION_NAME } from 'verus-typescript-primitives';

// Available types:
InformationType.ATTESTATION  // Attestation data
InformationType.CLAIM        // Claim data  
InformationType.CREDENTIAL   // Credential data
```

## Basic Usage

### 1. Creating a Simple Request

```typescript
import { 
    RequestInformation, 
    RequestItem, 
    RequestedFormatFlags,
    InformationType
} from 'verus-typescript-primitives';

// Create a request for a full KYC attestation
const educationRequest = new RequestItem({
    version: 1,
    format: RequestedFormatFlags.FULL_DATA,
    type: InformationType.ATTESTATION,
    id: { [ATTESTATION_NAME.vdxfid]: "Valu Proof of Humanity" },
    signer: "iKjrTCwoPFRk44fAi2nYNbPG16ZUQjv1NB",

});

// Create the request information container
const requestInfo = new RequestInformation({
    version: 1,
    items: [educationRequest]
});
```

### 2. Creating Multiple Requests

```typescript
// Request multiple different attestations
const employmentRequest = new RequestItem({
    version: 1,
    format: RequestedFormatFlags.FULL_DATA,
    type: InformationType.CLAIM,
    id: { "i3bgiLuaxTr6smF8q6xLG4jvvhF1mmrkM2": "Employment at acme widgets" }, // valu.vrsc::claims.employment
    signer: "iKjrTCwoPFRk44fAi2nYNbPG16ZUQjv1NB",
});

//request partial data 
const certificationRequest = new RequestItem({
    version: 1,
    format: RequestedFormatFlags.PARTIAL_DATA,
    type: InformationType.CREDENTIAL,
    id: { [ATTESTATION_NAME.vdxfid]: "Valu Proof of Humanity"}, // "vrsc::attestation.name" : name
    signer: "iKjrTCwoPFRk44fAi2nYNbPG16ZUQjv1NB", //valu attestations@
    requestedkeys: ["iAXYYrZaipc4DAmAKXUFYZxavsf6uBJqaj","iJ4pq4DCymfbu8SAuXyNhasLeSHFNKPr23", IDENTITY_NATIONALITY.vdxfid]  //"vrsc::identity.over21" , "vrsc::identity.email"
});

//request collection of all valu.vrsc::claims.education
const collectionRequest = new RequestItem({
    version: 1,
    format: RequestedFormatFlags.COLLECTION,
    type: InformationType.CREDENTIAL,
    id: { "i3bgiLuaxTr6smF8q6xLG4jvvhF1mmrkM2": "" }, // valu.vrsc::claims.employment
    signer: "iKjrTCwoPFRk44fAi2nYNbPG16ZUQjv1NB", //valu attestations@

});


const multipleRequestsInfo = new RequestInformation({
    version: 1,
    items: [educationRequest, employmentRequest, certificationRequest, collectionRequest]
});
```

### 3. Incorporating into Login Consent Challenge

```typescript
import { primitives, VerusId } from 'verus-typescript-primitives';

async function createLoginRequestWithAttestationRequest(
    challengeId: string,
    valuId: string,
    requestInfo: RequestInformation,
    privateKey: string
) {
    try {
        // Create the login consent challenge with attestation request
        const loginChallenge = new primitives.LoginConsentChallenge({
            challenge_id: challengeId,
            requested_access: [
                new primitives.RequestedPermission(primitives.IDENTITY_VIEW.vdxfid),
                new primitives.RequestedPermission(primitives.ATTESTATION_READ_REQUEST.vdxfid)
            ],
            redirect_uris: [],
            subject: [
                new primitives.Subject(
                    requestInfo.toBuffer().toString('base64'), //serialize the request
                    primitives.ATTESTATION_READ_REQUEST.vdxfid
                )
            ],
            provisioning_info: [],
            attestations: [],
            created_at: Number((Date.now() / 1000).toFixed(0))
        });

        // Create the login request
        const loginRequest = await VerusId.createLoginConsentRequest(
            valuId,
            loginChallenge,
            privateKey
        );

        return loginRequest.toWalletDeeplinkUri();
        
    } catch (error) {
        console.error('Error creating login request with attestation request:', error);
        throw error;
    }
}
```
