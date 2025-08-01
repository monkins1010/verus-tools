# Attestation Methods Guide

This guide explains two different approaches for sending `AttestationDetails` in the Valu API, showing how to process data from `signdata` and implement both inline and URL-based delivery methods.

## Overview

The Valu API supports two methods for delivering attestation data to users:

1. **Inline Method** (`/get-attestation`) - Embeds attestation data directly in the QR code
2. **URL-based Method** (`/get-multiple-attestations`) - Stores attestation data in database and provides download URL

## Method 1: Inline Attestation Delivery

### How it works
- Attestation data is embedded directly in the `LoginConsentRequest`
- QR code contains all attestation information
- Suitable for single, smaller attestations

### Implementation Example

```javascript
// Required imports
const primitives = require('verus-typescript-primitives');
// ... other imports

module.exports = app.post("/get-attestation", async (req, res) => {
  try {
    const { partnerUserId } = req.body;
    
    // 1. Generate attestation data
    // const attestationObject = await getPOL(partnerUserId);
    // const generatedPOL = await generatePOLAttestation(
    //   attestationObject, 
    //   "Monkins.VRSCTEST@", 
    //   "Valu Proof of Personhood"
    // );
    
    // 2. Create signData package
    const signDataPackage = {
      address: "ValuAttestation@",
      createmmr: true,
      encryptoaddress: VALU_ZADDRESS,
      mmrdata: [
        {
          "vdxfdata": {
            [primitives.DataDescriptorKey.vdxfid]: {
              "version": 1,
              "flags": 0,
              "label": "iEEjVkvM9Niz4u2WCr6QQzx1zpVSvDFub1",
              "mimetype": "text/plain",
              "objectdata": {
                "message": "Valu Proof of Humanity"
              }
            }
          }
        },
        {
          "vdxfdata": {
            [primitives.DataDescriptorKey.vdxfid]: {
              "version": 1,
              "flags": 0,
              "label": "iFa41TpKfvbjaEnP78BNpSA9KYNgED58ms",
              "mimetype": "text/plain",
              "objectdata": {
                "message": "usersID.VRSCTEST@"
              }
            }
          }
        },
        {
          "vdxfdata": {
            [primitives.DataDescriptorKey.vdxfid]: {
              "version": 1,
              "flags": 0,
              "label": "iPzSt64gwsqmxcz3Ht7zhMngLC6no6S74K",
              "mimetype": "text/plain",
              "objectdata": {
                "message": "1980/01/01"
              }
            }
          }
        },
        {
          "vdxfdata": {
            [primitives.DataDescriptorKey.vdxfid]: {
              "version": 1,
              "flags": 0,
              "label": "i6E3RQUUX3jt8CkizuLX6ihZHTegCmmbj4",
              "mimetype": "text/plain",
              "objectdata": {
                "message": "true"
              }
            }
          }
        }
      ]
    };

    // 3. Get signed data from Verus daemon
    const nodeResponse = (await privateVerusRPC.signData(signDataPackage)).result;
    
    // 4. Create AttestationDetails from node response
    const attestationDetails = AttestationDetails.fromNodeResponse(nodeResponse, {
      label: "Valu Proof of Personhood",
      id: partnerUserId,
      timestamp: Date.now()
    });

    // 5. Convert AttestationDetails to buffer for inline embedding
    const attestationBuffer = attestationDetails.toBuffer();
    
    // 6. Create LoginConsentRequest with inline attestation
    const reply = await VerusId.createLoginConsentRequest(
      VALU_ID,
      new primitives.LoginConsentChallenge({
        challenge_id: generateChallengeID(),
        requested_access: [
          new primitives.RequestedPermission(primitives.IDENTITY_VIEW.vdxfid)
        ],
        redirect_uris: [],
        subject: [],
        provisioning_info: [
          new primitives.ProvisioningInfo(
            "Valu Proof of Personhood",
            primitives.ATTESTATION_PROVISION_TYPE.vdxfid
          ),
        ],
        // KEY DIFFERENCE: Attestation data embedded inline
        attestations: [
          new primitives.Attestation(
            attestationBuffer.toString('base64'),
            primitives.ATTESTATION_PROVISION_OBJECT.vdxfid
          )
        ],
        created_at: Number((Date.now() / 1000).toFixed(0)),
      }),
      VALU_LOGIN_WIF
    );

    res.status(200).send({ data: reply.toWalletDeeplinkUri() });
    
  } catch (e) {
    console.log("Error:", e);
    res.status(500).json({ error: e.message, success: false });
  }
});
```

### Key Points for Inline Method:
- `AttestationDetails.fromNodeResponse()` creates the details object from daemon response
- `attestationDetails.toBuffer()` converts to binary format
- Buffer is base64-encoded and placed in `attestations` array
- QR code size increases with attestation data size

### Understanding the mmrdata Structure:
The `mmrdata` array contains structured attestation data with:
- **label**: Unique identifier for each data element
- **mimetype**: Format of the data (typically "text/plain")
- **objectdata.message**: The actual attestation content
- **primitives.DataDescriptorKey.vdxfid**: Standard VDXF key for data descriptors

Example data elements:
- "Valu Proof of Humanity" - Main attestation type
- "monkins.VRSCTEST@" - Attestor identity
- "1980/01/01" - Date of birth or verification date  
- "true" - Boolean verification status

## Method 2: URL-based Attestation Delivery

### How it works
- Attestation data is stored in database with unique ID
- QR code contains only a download URL
- Supports multiple attestations in bundles
- Keeps QR code size minimal

### Implementation Example

```javascript
// Required imports
const primitives = require('verus-typescript-primitives');
// ... other imports

module.exports = app.post("/get-multiple-attestations", async (req, res) => {
  try {
    const { partnerUserId, attestationTypes = ["POL"] } = req.body;

    // 1. Create master AttestationDetails container
    const masterAttestationDetails = new AttestationDetails();
    masterAttestationDetails.setLabel("ValuVerse Claims Bundle");
    masterAttestationDetails.setTimestamp(new BN(Date.now()));
    
    // 2. Process each attestation type
    for (const attestationType of attestationTypes) {
      switch (attestationType) {
        case "POL":
          const POLStatus = await checkPOLStatus(partnerUserId);
          if (POLStatus?.status === VALU_POL_PAYMENT_RECEIVED) {
            
            // Generate attestation data
            const attestationObject = await getPOL(partnerUserId);
            const generatedPOL = await generatePOLAttestation(
              attestationObject, 
              "Monkins.VRSCTEST@", 
              "Valu Proof of Personhood"
            );
            
            // Create signData package
            const signDataPackage = {
              address: "ValuAttestation@",
              createmmr: true,
              encryptoaddress: VALU_ZADDRESS,
              mmrdata: [
                {
                  "vdxfdata": {
                    [primitives.DataDescriptorKey.vdxfid]: {
                      "version": 1,
                      "flags": 0,
                      "label": "iEEjVkvM9Niz4u2WCr6QQzx1zpVSvDFub1",
                      "mimetype": "text/plain",
                      "objectdata": {
                        "message": "Valu Proof of Humanity"
                      }
                    }
                  }
                },
                {
                  "vdxfdata": {
                    [primitives.DataDescriptorKey.vdxfid]: {
                      "version": 1,
                      "flags": 0,
                      "label": "iFa41TpKfvbjaEnP78BNpSA9KYNgED58ms",
                      "mimetype": "text/plain",
                      "objectdata": {
                        "message": "monkins.VRSCTEST@"
                      }
                    }
                  }
                },
                {
                  "vdxfdata": {
                    [primitives.DataDescriptorKey.vdxfid]: {
                      "version": 1,
                      "flags": 0,
                      "label": "iPzSt64gwsqmxcz3Ht7zhMngLC6no6S74K",
                      "mimetype": "text/plain",
                      "objectdata": {
                        "message": "1980/01/01"
                      }
                    }
                  }
                },
                {
                  "vdxfdata": {
                    [primitives.DataDescriptorKey.vdxfid]: {
                      "version": 1,
                      "flags": 0,
                      "label": "i6E3RQUUX3jt8CkizuLX6ihZHTegCmmbj4",
                      "mimetype": "text/plain",
                      "objectdata": {
                        "message": "true"
                      }
                    }
                  }
                }
              ]
            };

            // Get signed data from daemon
            const nodeResponse = (await privateVerusRPC.signData(signDataPackage)).result;
            
            // Add this attestation to the master collection
            masterAttestationDetails.addAttestation(nodeResponse);
          }
          break;
        
        case "KYC":
          // Additional attestation types can be added here
          break;
      }
    }

    // 3. Store AttestationDetails in database
    const uniqueAttestationId = generateChallengeID();
    await storeAttestationData(
      uniqueAttestationId, 
      masterAttestationDetails, 
      partnerUserId
    );

    // 4. Create LoginConsentRequest with URL reference
    const reply = await VerusId.createLoginConsentRequest(
      VALU_ID,
      new primitives.LoginConsentChallenge({
        challenge_id: generateChallengeID(),
        requested_access: [
          new primitives.RequestedPermission(primitives.IDENTITY_VIEW.vdxfid)
        ],
        // KEY DIFFERENCE: URL for attestation download
        redirect_uris: [
          new primitives.RedirectUri(
            `${process.env.THIS_URL}/attestations/dl/${uniqueAttestationId}`,
            primitives.ATTESTATION_PROVISION_URL.vdxfid
          ),
        ],
        subject: [],
        provisioning_info: [
          new primitives.ProvisioningInfo(
            masterAttestationDetails.label || "ValuVerse Claims Bundle",
            primitives.ATTESTATION_PROVISION_TYPE.vdxfid
          ),
        ],
        // KEY DIFFERENCE: Empty attestations array
        attestations: [],
        created_at: Number((Date.now() / 1000).toFixed(0)),
      }),
      VALU_LOGIN_WIF
    );

    res.status(200).send({ 
      data: reply.toWalletDeeplinkUri(),
      attestationCount: masterAttestationDetails.getAttestationCount(),
      attestationUrl: `${process.env.THIS_URL}/attestations/dl/${uniqueAttestationId}`
    });

  } catch (e) {
    console.log("Error:", e);
    res.status(500).json({ error: e.message, success: false });
  }
});
```

### Download Endpoint for URL Method

```javascript
module.exports = app.post("/attestations/dl/:uniqueId", async (req, res) => {
  try {
    const { uniqueId } = req.params;
    
    // Retrieve stored AttestationDetails from database
    const attestationDetailsJson = await getAttestationData(uniqueId);
    
    if (!attestationDetailsJson) {
      return res.status(404).json({ 
        error: "Attestation not found or expired", 
        success: false 
      });
    }

    // Return the AttestationDetails as JSON
    res.status(200).json({
      success: true,
      ...attestationDetailsJson
    });
    
    // Mark as downloaded for analytics
    await markAttestationDownloaded(uniqueId);
    
  } catch (e) {
    console.log("Error downloading attestation:", e);
    res.status(500).json({ 
      error: "Failed to download attestation data", 
      success: false 
    });
  }
});
```

## Working with signData Response

### Understanding the signData Response Structure

When you call `privateVerusRPC.signData(signDataPackage)`, you get a response like:

```javascript
{
  result: {
    address: "ValuAttestation@",
    signaturedata: {
      identityid: "...",
      signature: "...",
      // ... other signature fields
    },
    mmrdescriptor: {
      mmrroot: {
        objectdata: "..." // hex string
      },
      mmrHashes: {
        objectdata: "..." // serialized hash data
      },
      dataDescriptors: [
        {
          objectdata: "...", // VDXF encoded data
          salt: "..." // hex string
        }
      ]
    }
  }
}
```

### Converting signData to AttestationDetails

#### Method 1: Using fromNodeResponse (Recommended)

```javascript
// Create AttestationDetails from the complete node response
const attestationDetails = AttestationDetails.fromNodeResponse(nodeResponse, {
  label: "Custom Attestation Label",
  id: partnerUserId,
  timestamp: Date.now()
});
```

#### Method 2: Manual Construction

```javascript
// If you need more control over the process
const attestationDetails = new AttestationDetails();
attestationDetails.setLabel("Custom Label");
attestationDetails.setTimestamp(new BN(Date.now()));

// Add the attestation data from signData response
attestationDetails.addAttestation(nodeResponse);
```

### Converting AttestationDetails to Buffer

```javascript
// For inline embedding in LoginConsentRequest
const attestationBuffer = attestationDetails.toBuffer();
const base64Attestation = attestationBuffer.toString('base64');

// Use in attestations array
const attestation = new primitives.Attestation(
  base64Attestation,
  primitives.ATTESTATION_PROVISION_OBJECT.vdxfid
);
```

### Storing AttestationDetails for URL Method

```javascript
// Convert to JSON for database storage
const attestationJson = attestationDetails.toJson();

// Store with unique identifier
await storeAttestationData(uniqueId, attestationDetails, partnerUserId);

// Later retrieve and reconstruct
const storedJson = await getAttestationData(uniqueId);
const reconstructedDetails = AttestationDetails.fromJson(storedJson);
```

## Database Schema for URL Method

The URL method requires storing attestation data. Here's the recommended schema:

```sql
CREATE TABLE attestation_storage (
  id VARCHAR(64) PRIMARY KEY,
  partner_user_id VARCHAR(255),
  attestation_data TEXT, -- JSON string of AttestationDetails.toJson()
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  downloaded_at TIMESTAMP NULL,
  expires_at TIMESTAMP,
  attestation_count INTEGER DEFAULT 1
);
```

## Comparison Summary

| Feature | Inline Method | URL Method |
|---------|---------------|------------|
| **QR Code Size** | Large (grows with data) | Small (fixed size) |
| **Multiple Attestations** | Limited by QR capacity | Unlimited |
| **Network Dependency** | No (all data in QR) | Yes (requires download) |
| **Storage Requirements** | None | Database storage needed |
| **Use Cases** | Single, small attestations | Multiple or large attestations |
| **Complexity** | Simple | More complex |

## Best Practices

1. **Choose Method Based on Use Case**:
   - Use inline for single, lightweight attestations
   - Use URL method for multiple or large attestations

2. **Security Considerations**:
   - URL method should implement proper access controls
   - Consider attestation expiration times
   - Validate attestation integrity on both methods

3. **Error Handling**:
   - Always validate `signData` responses
   - Implement proper error responses for missing attestations
   - Handle network failures gracefully in URL method

4. **Performance**:
   - Cache frequently requested attestations
   - Implement proper database indexing
   - Consider compression for large attestation bundles

5. **User Experience**:
   - Provide clear feedback on attestation status
   - Handle offline scenarios appropriately
   - Implement retry mechanisms for failed downloads

## Example Integration

Here's how a client application might handle both methods:

```javascript
// Client-side handling
async function processAttestationQR(qrData) {
  const loginRequest = primitives.LoginConsentRequest.fromWalletDeeplinkUri(qrData);
  
  if (loginRequest.challenge.attestations.length > 0) {
    // Inline method - process embedded attestations
    for (const attestation of loginRequest.challenge.attestations) {
      const attestationBuffer = Buffer.from(attestation.data, 'base64');
      const attestationDetails = AttestationDetails.fromBuffer(attestationBuffer);
      // Process attestation...
    }
  } else if (loginRequest.challenge.redirect_uris.length > 0) {
    // URL method - download attestations
    const downloadUrl = loginRequest.challenge.redirect_uris[0].uri;
    const response = await fetch(downloadUrl, { method: 'POST' });
    const attestationData = await response.json();
    // Process downloaded attestation data...
  }
}
```

This guide provides a complete reference for implementing both attestation delivery methods in the Valu API system.
