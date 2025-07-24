# Generic Claim Creation and Signing Guide

This guide demonstrates how to create custom claims of any type using the verus-tools library with custom VDXFIDs and sign them for attestation on the Verus blockchain.

## Overview

The Claim class allows you to create structured claims with custom types that can be signed and verified on the Verus blockchain. Unlike predefined claim types (like Education), you can create claims for any purpose by generating your own VDXFID type identifier.

## Installation

```bash
yarn install verus-tools
```

## Creating a Custom VDXFID

First, you need to create a custom VDXFID for your claim type using the Verus CLI:

```bash
./verus getvdxfid "valu.vrsc::rooms.description"
```

This will return a VDXFID object that you can use as your claim type:

```json
{
  "vdxfid": "iRxRwFwZz31aPbFgqVkZBxa4uodARsfbEU",
  "indexid": "xWnYQ4NeqMEF1m8ihBQiAM6bwTeBJmSwaJ",
  "hash160result": "1b1c302281e746268001e4240e59d1c85bd399f6",
  "qualifiedname": {
    "namespace": "iNQFA8jtYe9JYq6Qr49ZxAhvWErFurWjTa",
    "name": "valu.vrsc::rooms.description"
  }
}
```

You can use the `vdxfid` from this result as your claim type identifier.

## Basic Usage

### 1. Creating a Generic Claim Object

First, create a claim data object with your custom fields and the custom VDXFID:

```typescript
import { Claim } from 'verus-tools';

// Your custom VDXFID obtained from the CLI
const CUSTOM_ROOM_DESCRIPTION_TYPE = "iRxRwFwZz31aPbFgqVkZBxa4uodARsfbEU";

// Define your custom claim data - this can be any structure you need
const roomDescriptionData = {
    "room_name": "Conference Room A",
    "capacity": 25,
    "amenities": ["Projector", "Whiteboard", "WiFi", "Coffee Machine"],
    "location": "Building 1, Floor 3",
    "available_hours": "9:00 AM - 6:00 PM",
    "booking_contact": "facilities@company.com",
    "accessibility": "Wheelchair accessible",
    "id": "room_a_building_1_floor_3"
}

// Create an instance of Claim with your custom data and type
const roomClaim = new Claim({
    data: roomDescriptionData,
    type: CUSTOM_ROOM_DESCRIPTION_TYPE
});
```

### 2. Creating MMR Data for Signing

Generate the MMR (Merkle Mountain Range) data that will be used in the signing process:

```typescript
// Create MMR data for the custom claim
const mmrData = roomClaim.toMMRData("identity1@");
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
    mmrdata: mmrData  // Use the MMR data from your claim
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
import { Claim } from 'verus-tools';
import { 
    primitives, 
    VerusId, 
    VdxfUniValue
} from 'verus-typescript-primitives';
const VDXF_Data = require("verus-typescript-primitives/dist/vdxf/vdxfdatakeys");

async function createAndSignGenericClaim() {
    try {
        // 1. Define your custom VDXFID (obtained from CLI)
        const CUSTOM_PRODUCT_REVIEW_TYPE = "iMyCustomVdxfId123456789012345"; // Replace with your actual VDXFID
        
        // 2. Create your custom claim data
        const productReviewData = {
            "product_name": "Wireless Headphones Pro",
            "reviewer": "John Doe",
            "rating": 4.5,
            "review_text": "Excellent sound quality and comfortable fit",
            "verified_purchase": true,
            "review_date": "2024-01-15",
            "helpful_votes": 23,
            "product_id": "WHPro-2024-001",
            "id": "review_whpro_001_johndoe"
        }

        // 3. Create Claim instance with custom type
        const productReviewClaim = new Claim({
            data: productReviewData,
            type: CUSTOM_PRODUCT_REVIEW_TYPE
        });
        
        // 4. Prepare sign data package
        const VALU_ZADDRESS = "your_z_address_here";
        const signDataPackage = {
            address: "ValuAttestation@",
            createmmr: true,
            encryptoaddress: VALU_ZADDRESS,
            mmrdata: productReviewClaim.toMMRData("identity1@")
        }

        // 5. Sign the data this is the same as ./verus signdata {signDataPackage}
        // you may have to implement your own signdata
        const attestationFromDaemon = await signdata([signDataPackage]);
        
        // 6. Create VDXF data object for the login challenge
        const vdxfDataObj = {
            [VDXF_Data.MMRDescriptorKey.vdxfid]: attestationFromDaemon.mmrdescriptor,
            [VDXF_Data.SignatureDataKey.vdxfid]: attestationFromDaemon.signaturedata
        };

        const objectsBuffer = VdxfUniValue.fromJson(vdxfDataObj);

        // 7. Create Login request with Custom Attestation
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
        console.error('Error creating and signing generic claim:', error);
        throw error;
    }
}

// Usage
createAndSignGenericClaim()
    .then(result => {
        console.log('Generic claim created and signed successfully:', result);
    })
    .catch(error => {
        console.error('Failed to create generic claim:', error);
    });
```

## Creating Custom VDXFIDs for Different Claim Types

You can create VDXFIDs for any type of claim. Here are some examples:

### Product Reviews
```bash
./verus getvdxfid "valu.vrsc::claim.product_review"
```

### Service Ratings
```bash
./verus getvdxfid "valu.vrsc::claim.service_rating"
```

### Property Listings
```bash
./verus getvdxfid "valu.vrsc::claim.property_listing"
```

### Event Attendance
```bash
./verus getvdxfid "valu.vrsc::claim.event_attendance"
```

### Medical Records
```bash
./verus getvdxfid "valu.vrsc::claim.medical_record"
```

### Asset Ownership
```bash
./verus getvdxfid "valu.vrsc::claim.asset_ownership"
```

## Predefined Claim Types

The verus-tools library also includes several predefined claim types you can use:

- `CLAIM_EMPLOYMENT` - For employment-related claims
- `CLAIM_ACHIEVEMENT` - For achievement and accomplishment claims  
- `CLAIM_CERTIFICATION` - For certification and license claims
- `CLAIM_EDUCATION` - For education and degree claims
- `CLAIM_SKILL` - For skill and competency claims
- `CLAIM_EXPERIENCE` - For experience and work history claims

```typescript
import { CLAIM_EMPLOYMENT, CLAIM_ACHIEVEMENT, Claim } from 'verus-tools';

// Using a predefined type
const achievementClaim = new Claim({
    data: yourAchievementData,
    type: CLAIM_ACHIEVEMENT.vdxfid
});
```

## Data Structure Guidelines

Your claim data can contain any fields that make sense for your use case, but consider these best practices:

- **Include an ID**: Always include a unique identifier for your claim
- **Use consistent naming**: Use consistent field naming conventions (e.g., snake_case or camelCase)
- **Include metadata**: Consider including creation date, version, or other metadata
- **Validate data types**: Ensure your data types are JSON-serializable
- **Document your schema**: Maintain documentation of your custom claim schema

### Example Data Structures

**Location Check-in Claim:**
```typescript
const locationData = {
    "location_name": "Central Park",
    "coordinates": { "lat": 40.7829, "lng": -73.9654 },
    "check_in_time": "2024-01-15T14:30:00Z",
    "user_id": "user123",
    "accuracy": "10m",
    "id": "checkin_centralpark_20240115"
}
```

**Asset Transfer Claim:**
```typescript
const assetTransferData = {
    "asset_type": "vehicle",
    "asset_id": "VIN123456789",
    "from_owner": "Alice Smith",
    "to_owner": "Bob Johnson",
    "transfer_date": "2024-01-15",
    "sale_price": 25000,
    "currency": "USD",
    "id": "transfer_vin123456789_20240115"
}
```

## Methods Available

### Claim Class Methods

- `constructor(input: { data?: any, type: string, version?: BigNumber, flags?: BigNumber })`: Creates a new Claim instance
- `setData(data: any)`: Updates the claim data
- `toMMRData(receivingIdentity?: string)`: Creates MMR data for signing
- `toBuffer()`: Serializes the claim to a buffer
- `fromBuffer(buffer: Buffer)`: Deserializes a claim from a buffer
- `getByteLength()`: Returns the byte length of the serialized claim

### Static Methods

- `storeMultipleClaimsInID(claims: Claim[])`: Stores multiple claims in a ContentMultiMap for identity updates

## Error Handling

Always wrap your claim creation and signing in try-catch blocks to handle potential errors:

```typescript
try {
    const customClaim = new Claim({
        data: yourCustomData,
        type: yourCustomVdxfid
    });
    const result = await signdata([signDataPackage]);
    // Process result
} catch (error) {
    console.error('Error processing custom claim:', error);
    // Handle error appropriately
}
```

## Security Considerations

1. **Private Keys**: Ensure your private keys and z-addresses are kept secure
2. **Data Validation**: Validate all input data before creating claims
3. **Type Verification**: Verify that your custom VDXFID is correct and properly formatted
4. **Signature Verification**: Always verify signatures before trusting attestation data
5. **MMR Validation**: Validate MMR data to ensure integrity
6. **Data Privacy**: Be mindful of what data you include in claims as they may be publicly verifiable

## Advanced Usage

### Multiple Claims in One Identity

You can store multiple claims of different types in a single identity:

```typescript
const claims = [
    new Claim({ data: reviewData, type: CUSTOM_REVIEW_TYPE }),
    new Claim({ data: ratingData, type: CUSTOM_RATING_TYPE }),
    new Claim({ data: endorsementData, type: CUSTOM_ENDORSEMENT_TYPE })
];

const contentMultiMap = Claim.storeMultipleClaimsInID(claims);
```

### Custom Namespaces

You can organize your custom claim types under specific namespaces:

```bash
# Company-specific claims
./verus getvdxfid "mycompany.vrsc::employee.performance"
./verus getvdxfid "mycompany.vrsc::project.completion"

# Application-specific claims  
./verus getvdxfid "myapp.vrsc::user.preferences"
./verus getvdxfid "myapp.vrsc::activity.log"
```

## Contributing

For issues, feature requests, or contributions, please visit the [GitHub repository](https://github.com/Monkins1010/verus-tools).

## License

This project is licensed under the MIT License.
