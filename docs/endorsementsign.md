# Endorsement Signing with Verus ID

This document explains how to implement endorsement signing using the Verus ID system. The code example demonstrates creating endorsement requests and handling signed endorsements from Verus wallets.

## API Endpoints

### Request Endorsement Signature

**Endpoint:** `POST /request-endorsement-signature`

This endpoint creates a login consent request that asks users to sign an endorsement.

```javascript
module.exports = app.post("/request-endorsement-signature", async (req, res) => {
  const API = VERUS_MAINNET_API;
  const VRSCRPC = new VerusIdInterface("VRSC", API);
  
  try {
    const challenge_id = generateChallengeID();

    // Create endorsement object
    const endorsementJson = {
      version: new BN(1),
      endorsee: "ValuLogin@",
      message: "Please sign john@'s Skill 1 Claim",
      reference: "1234556678909"
    }

    const endorsement = Endorsement.fromJson(endorsementJson);

    // Create subject with endorsement data
    const subject = new primitives.Subject(
      endorsement.toBuffer().toString('base64'),
      primitives.IDENTITY_SIGNDATA_REQUEST.vdxfid
    );

    // Create login consent request
    const reply = await VRSCRPC.createLoginConsentRequest(
      MAINNET_VALU_LOGIN_IADDRESS,
      new primitives.LoginConsentChallenge({
        challenge_id: challenge_id,
        requested_access: [
          new primitives.RequestedPermission(primitives.IDENTITY_VIEW.vdxfid),
          new primitives.RequestedPermission(primitives.IDENTITY_SIGNDATA_REQUEST.vdxfid),
        ],
        redirect_uris: [
          new primitives.RedirectUri(
            `${process.env.THIS_URL}/sendendorsement`,
            primitives.LOGIN_CONSENT_WEBHOOK_VDXF_KEY.vdxfid
          ),
        ],
        subject: [subject],
        provisioning_info: [],
        attestations: [],
        created_at: Number((Date.now() / 1000).toFixed(0)),
      }),
      MAINNET_VALU_LOGIN_WIF
    );

    // Verify the request
    const verify = await VRSCRPC.verifyLoginConsentRequest(reply);

    res.status(200).send({
      data: reply.toWalletDeeplinkUri()
    });

  } catch (e) {
    console.log("Error generating endorsement request:", e);
    res.status(500).json({ error: e.message, success: false });
  }
});
```

### Handle Signed Endorsement

**Endpoint:** `POST /sendendorsement`

This webhook endpoint receives the signed endorsement from the wallet. e.g.
```json
{
  "serializekey": true,
  "vdxfkey": "i5fvfsaTFKtrHCPYQHTXRaXcyxHmJMxTMe",
  "version": "01",
  "system_id": "i5w5MuNik5NtLcYmNzcvaoixooEebB6MGV",
  "signing_id": "iG7FeZmCf1TXYa5oQr6z8vGkqBnwZ7pBeY",
  "decision": {
    "serializekey": true,
    "vdxfkey": "iQP5eKQaYDV3FFXsq7276LyWxk4ttjuSdm",
    "version": "01",
    "decision_id": "i7iSNi3Z5UPUejt8zJ3iEAWJXxrXMvsewK",
    "request": {
      "serializekey": true,
      "vdxfkey": "i3dQmgjq8L8XFGQUrs9Gpo8zvPWqs1KMtV",
      "version": "01",
      "system_id": "i5w5MuNik5NtLcYmNzcvaoixooEebB6MGV",
      "signing_id": "i8mq7inkLvNRwYQNTtt3uaaJCs5YkKxjGg",
      "signature": {
        "serializekey": true,
        "vdxfkey": "iPi1DPgDDu7hP1mAp5xJ8rHBWwXSzc6yA8",
        "version": "01",
        "signature": "AgVTnjgAAUEfrtO6ukMdMTJz/0DdRBWCS0G94MpSsyw+GXTfA14pTNt5aMhrinXlwx1Jy8dixmJGXFoJ653Miw4F6eaA04LvAg=="
      },
      "challenge": {
        "serializekey": true,
        "vdxfkey": "i5maLnB62WmKKXFZniqDRU1JiC2Hd1xpVb",
        "version": "01",
        "challenge_id": "i7iSNi3Z5UPUejt8zJ3iEAWJXxrXMvsewK",
        "requested_access": [
          {
            "serializekey": true,
            "vdxfkey": "iLUrA89mDKnwxZcMiPadfNB9TLp58A2TKU",
            "version": "01",
            "encoding": "utf-8",
            "data": ""
          },
          {
            "serializekey": true,
            "vdxfkey": "i8pWCPRLoGD9MgL7HM13xo5Bhr9TsXjGxs",
            "version": "01",
            "encoding": "utf-8",
            "data": ""
          }
        ],
        "requested_access_audience": [],
        "subject": [
          {
            "serializekey": true,
            "vdxfkey": "i8pWCPRLoGD9MgL7HM13xo5Bhr9TsXjGxs",
            "version": "01",
            "base58Keys": {
              "i3a3M9n7uVtRYv1vhjmyb4DxY825AVAwic": true,
              "i6aJSTKfNiDZ4rPxj1pPh4Y8xDmh1GqYm9": true,
              "iMZTNkNBgBXNHkMLipQw9wQb56pxBSEp3k": true
            },
            "data": "AQgKVmFsdUxvZ2luQAYSNFVmeJAhUGxlYXNlIHNpZ24gam9obkAncyBTa2lsbCAxIENsYWlt"
          }
        ],
        "provisioning_info": [],
        "alt_auth_factors": [],
        "session_id": null,
        "attestations": [],
        "redirect_uris": [
          {
            "serializekey": true,
            "vdxfkey": "iSaBWByu4zqhEZ6HQmFxvfR1HyiFuhnJfL",
            "version": "01",
            "uri": "https://api.valu.earth/sendendorsement"
          }
        ],
        "created_at": 1756746820,
        "salt": null,
        "context": {
          "serializekey": true,
          "vdxfkey": "iBMochrKPSQfua5yZYWyd6p4QnREakqU44",
          "version": "01",
          "kv": {}
        },
        "skip": false
      }
    },
    "context": {
      "serializekey": true,
      "vdxfkey": "iBMochrKPSQfua5yZYWyd6p4QnREakqU44",
      "version": "01",
      "kv": {}
    },
    "created_at": 1756746950,
    "skipped": false
  },
  "signature": {
    "serializekey": true,
    "vdxfkey": "iPi1DPgDDu7hP1mAp5xJ8rHBWwXSzc6yA8",
    "version": "01",
    "signature": "AgVXnjgAAUEg3w5Paiw1lajBWfMFB2ngd0pBi3Q/Xo7rPdhsOBXAHxMVHpjU9aJIYblo99XKx6WGXGlPlLkJz203tzIpQg9+5Q=="
  },
  "signedMessage": {
    "endorsement": {
      "version": "1",
      "flags": "2",
      "endorsee": "ValuLogin@",
      "message": "Please sign john@'s Skill 1 Claim",
      "reference": "123455667890",
      "signature": {
        "version": 1,
        "systemid": "i5w5MuNik5NtLcYmNzcvaoixooEebB6MGV",
        "hashtype": 0,
        "signaturehash": "2b8dfaa83d47da731818a1233e08ee411394bc2a7a3dc5f48aba8c99a6a8cccc",
        "identityid": "iG7FeZmCf1TXYa5oQr6z8vGkqBnwZ7pBeY",
        "signaturetype": 0,
        "signature": "AgVXnjgAAUEfE84paI5orWJ39IgA8TDTxoibrBkmgTEGYmhiCOIhpQYhW9b0/KRdtBnhNqTafJUcjBdy1t/R/RT1LXeVH5rzhw=="
      }
    }
  }
}```
