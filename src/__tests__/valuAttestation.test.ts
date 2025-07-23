import { ValuAttestation } from "../formatting/attestations/valuIdentity";
import { DataDescriptor } from 'verus-typescript-primitives';

describe('ValuAttestation Class Tests', () => {
    const mockSumSubData = {
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
        agreement: {
            createdAt: "2024-07-08 09:47:10",
            acceptedAt: "2024-07-08 09:47:10",
            source: "WebSDK",
            recordIds: [
                "66694ad59f83fd01b4e02611",
            ],
        },
        requiredIdDocs: {
            excludedCountries: [
                "ALB",
                "BHS",
                "BRB",
                "AFG",
            ],
            docSets: [
                {
                    idDocSetType: "IDENTITY",
                    types: [
                        "PASSPORT",
                        "DRIVERS",
                        "ID_CARD",
                        "RESIDENCE_PERMIT",
                    ],
                },
                {
                    idDocSetType: "APPLICANT_DATA",
                    fields: [
                        {
                            name: "country",
                            required: true,
                            prefill: null,
                            immutableIfPresent: null,
                        },
                        {
                            name: "town",
                            required: true,
                            prefill: null,
                            immutableIfPresent: null,
                        },
                        {
                            name: "state",
                            required: true,
                            prefill: null,
                            immutableIfPresent: null,
                        },
                        {
                            name: "postCode",
                            required: true,
                            prefill: null,
                            immutableIfPresent: null,
                        },
                    ],
                },
            ],
        },
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
        tags: [
            "Basic KYC Passed",
        ],
        copyOf: null,
        reuseScope: "importApiShareToken",
    };

    const mockInspectionData = {
        id: "687f537404aeebc10c3ad49a",
        inspectionDate: "2025-07-22 09:01:40",
        applicantId: "687f537404aeebc10c3ad49a",
        images: [
            {
                id: "668bb6c999a8380df1220dac",
                addedDate: "2024-07-08 09:52:09",
                creatorClientId: "WebSDK",
                creatorSubjectRole: null,
                imageHash: "e1d34cb8beaf9dee3fc3e5d6854e7ec31565ea02",
                imageFileName: "17204322707398070806701779549140.jpg",
                resizedImageId: 1361136383,
                mimeType: "jpeg",
                imageId: 1595144748,
                make: "Google",
                model: "Android SDK built for x86",
                fileSize: 425957,
                actualResolution: {
                    width: 960,
                    height: 1280,
                },
                exifResolution: {
                    width: 960,
                    height: 1280,
                },
                creationDate: "2024-07-08 10:52:04",
                modificationDate: "2024-07-08 10:52:04",
                answer: "GREEN",
                comments: null,
                imageTrust: {
                    trust: 0.6,
                },
                idDocDef: {
                    country: "SRB",
                    idDocType: "PASSPORT",
                },
                extractedInfo: {
                    ocrDocType: "gbr.passport.type5",
                    screenRecapture: false,
                    unsatisfactoryAnswer: "GREEN",
                },
                reviewResult: {
                    reviewAnswer: "GREEN",
                },
                attemptId: "IFKSG",
                copiedFrom: null,
                copiedAt: "2025-07-22 09:01:40",
            },
        ],
        checks: [
            {
                answer: "GREEN",
                checkType: "CROSS_VALIDATION",
                createdAt: "2024-07-08 09:50:59",
                id: "89be878a-c60e-4ae6-a84d-20d4ee766f12",
                attemptId: "CdpTY",
            },
            {
                answer: "GREEN",
                checkType: "SIMILAR_SEARCH",
                createdAt: "2024-07-08 09:50:59",
                id: "7ac8e10c-be77-412b-9b17-4ef3a0ffc5b4",
                attemptId: "CdpTY",
                similarSearchInfo: null,
            },
            {
                answer: "GREEN",
                checkType: "AUTO_CHECK",
                createdAt: "2024-07-08 09:50:59",
                id: "8b7f52e7-101f-40f2-883f-131e8b6e5675",
                attemptId: "CdpTY",
                autoCheckInfo: null,
            },
            {
                answer: "YELLOW",
                checkType: "AUTO_CHECK",
                createdAt: "2024-07-08 09:52:15",
                id: "e9596abf-c3bd-40d8-8381-3c4f7047bf7a",
                attemptId: "IFKSG",
                autoCheckInfo: null,
            },
        ],
    };

    test('creates ValuAttestation instance', () => {
        const attestation = new ValuAttestation(mockSumSubData);
        expect(attestation).toBeDefined();
        expect(attestation.getApplicantId()).toBe("687e6a0f2966a7f001914c25");
    });

    test('generates Verus DataDescriptors', () => {
        const attestation = new ValuAttestation(mockSumSubData);
        const dataDescriptors = attestation.generateVerusDataDescriptors();
        
        expect(dataDescriptors).toBeDefined();
        expect(Array.isArray(dataDescriptors)).toBe(true);
        expect(dataDescriptors.length).toBeGreaterThan(0);
        
        // Check that we have DataDescriptor instances
        dataDescriptors.forEach(descriptor => {
            expect(descriptor).toBeInstanceOf(DataDescriptor);
            expect(descriptor.label).toBeDefined();
            expect(descriptor.objectdata).toBeDefined();
        });
    });

    test('generates POL attestation with attestor and title', () => {
        const attestation = new ValuAttestation(mockSumSubData);
        const attestor = "ValuAttestation@";
        const title = "KYC Verification Attestation";
        
        const dataDescriptors = attestation.generatePOLAttestation(attestor, title);
        
        expect(dataDescriptors).toBeDefined();
        expect(Array.isArray(dataDescriptors)).toBe(true);
        expect(dataDescriptors.length).toBeGreaterThan(0);
        
        // Should include attestation name and recipient
        const attestationNameFound = dataDescriptors.some(desc => 
            desc.objectdata && desc.objectdata.toString('utf-8') === title
        );
        const attestorFound = dataDescriptors.some(desc => 
            desc.objectdata && desc.objectdata.toString('utf-8') === attestor
        );
        
        expect(attestationNameFound).toBe(true);
        expect(attestorFound).toBe(true);
    });

    test('gets personal information', () => {
        const attestation = new ValuAttestation(mockSumSubData);
        const personalInfo = attestation.getPersonalInfo();
        
        expect(personalInfo).toBeDefined();
        expect(personalInfo?.firstName).toBe("John");
        expect(personalInfo?.lastName).toBe("Mock-Doe");
        expect(personalInfo?.dob).toBe("2006-01-22");
        expect(personalInfo?.gender).toBe("M");
        expect(personalInfo?.nationality).toBe("SRB");
    });

    test('gets address information', () => {
        const attestation = new ValuAttestation(mockSumSubData);
        const addresses = attestation.getAddressInfo();
        
        expect(addresses).toBeDefined();
        expect(Array.isArray(addresses)).toBe(true);
        expect(addresses.length).toBe(1);
        expect(addresses[0].street).toBe("123 church street");
        expect(addresses[0].town).toBe("derby");
        expect(addresses[0].country).toBe("GBR");
    });

    test('gets verification status', () => {
        const attestation = new ValuAttestation(mockSumSubData);
        const status = attestation.getVerificationStatus();
        
        expect(status).toBe("GREEN");
    });

    test('checks if review is completed', () => {
        const attestation = new ValuAttestation(mockSumSubData);
        const isCompleted = attestation.isReviewCompleted();
        
        expect(isCompleted).toBe(true);
    });

    test('gets email address', () => {
        const attestation = new ValuAttestation(mockSumSubData);
        const email = attestation.getEmail();
        
        expect(email).toBe("monkins@yahoo.com");
    });

    test('gets tags', () => {
        const attestation = new ValuAttestation(mockSumSubData);
        const tags = attestation.getTags();
        
        expect(tags).toBeDefined();
        expect(Array.isArray(tags)).toBe(true);
        expect(tags).toContain("Basic KYC Passed");
    });

    test('checks for specific tag', () => {
        const attestation = new ValuAttestation(mockSumSubData);
        
        expect(attestation.hasTag("Basic KYC Passed")).toBe(true);
        expect(attestation.hasTag("Non-existent Tag")).toBe(false);
    });

    test('gets primary ID document', () => {
        const attestation = new ValuAttestation(mockSumSubData);
        const primaryId = attestation.getPrimaryIdDocument();
        
        expect(primaryId).toBeDefined();
        expect(primaryId?.idDocType).toBe("PASSPORT");
        expect(primaryId?.number).toBe("Mock-W3XGD01WF2");
        expect(primaryId?.country).toBe("SRB");
    });

    test('gets all ID documents', () => {
        const attestation = new ValuAttestation(mockSumSubData);
        const allIds = attestation.getAllIdDocuments();
        
        expect(allIds).toBeDefined();
        expect(Array.isArray(allIds)).toBe(true);
        expect(allIds.length).toBe(1);
        expect(allIds[0].idDocType).toBe("PASSPORT");
    });

    test('throws error for invalid POL attestation parameters', () => {
        const attestation = new ValuAttestation(mockSumSubData);
        
        expect(() => attestation.generatePOLAttestation("", "title")).toThrow();
        expect(() => attestation.generatePOLAttestation("attestor", "")).toThrow();
        expect(() => attestation.generatePOLAttestation("", "")).toThrow();
    });

    test('gets creation and review dates', () => {
        const attestation = new ValuAttestation(mockSumSubData);
        
        expect(attestation.getCreatedAt()).toBe("2025-07-21 16:25:51");
        expect(attestation.getReviewDate()).toBe("2025-07-21 16:25:52+0000");
    });

    test('creates ValuAttestation with inspection data', () => {
        const attestation = new ValuAttestation(mockSumSubData, mockInspectionData);
        expect(attestation).toBeDefined();
        expect(attestation.getInspectionData()).toBeDefined();
        expect(attestation.getInspectionDate()).toBe("2025-07-22 09:01:40");
    });

    test('sets inspection data separately', () => {
        const attestation = new ValuAttestation(mockSumSubData);
        expect(attestation.getInspectionData()).toBeNull();
        
        attestation.setInspectionData(mockInspectionData);
        expect(attestation.getInspectionData()).toBeDefined();
        expect(attestation.getInspectionDate()).toBe("2025-07-22 09:01:40");
    });

    test('gets all images from inspection data', () => {
        const attestation = new ValuAttestation(mockSumSubData, mockInspectionData);
        const images = attestation.getAllImages();
        
        expect(images).toBeDefined();
        expect(Array.isArray(images)).toBe(true);
        expect(images.length).toBe(1);
        expect(images[0].imageHash).toBe("e1d34cb8beaf9dee3fc3e5d6854e7ec31565ea02");
    });

    test('gets images by document type', () => {
        const attestation = new ValuAttestation(mockSumSubData, mockInspectionData);
        const passportImages = attestation.getImagesByDocType('PASSPORT');
        
        expect(passportImages).toBeDefined();
        expect(Array.isArray(passportImages)).toBe(true);
        expect(passportImages.length).toBe(1);
        expect(passportImages[0].idDocDef.idDocType).toBe("PASSPORT");
        expect(passportImages[0].idDocDef.country).toBe("SRB");
    });

    test('gets passport images specifically', () => {
        const attestation = new ValuAttestation(mockSumSubData, mockInspectionData);
        const passportImages = attestation.getPassportImages();
        
        expect(passportImages).toBeDefined();
        expect(Array.isArray(passportImages)).toBe(true);
        expect(passportImages.length).toBe(1);
        expect(passportImages[0].idDocDef.idDocType).toBe("PASSPORT");
    });

    test('gets passport image hash', () => {
        const attestation = new ValuAttestation(mockSumSubData, mockInspectionData);
        const imageHash = attestation.getPassportImageHash();
        
        expect(imageHash).toBe("e1d34cb8beaf9dee3fc3e5d6854e7ec31565ea02");
    });

    test('gets all checks from inspection data', () => {
        const attestation = new ValuAttestation(mockSumSubData, mockInspectionData);
        const checks = attestation.getAllChecks();
        
        expect(checks).toBeDefined();
        expect(Array.isArray(checks)).toBe(true);
        expect(checks.length).toBe(4);
    });

    test('gets checks by type', () => {
        const attestation = new ValuAttestation(mockSumSubData, mockInspectionData);
        const autoChecks = attestation.getChecksByType('AUTO_CHECK');
        
        expect(autoChecks).toBeDefined();
        expect(Array.isArray(autoChecks)).toBe(true);
        expect(autoChecks.length).toBe(2);
        expect(autoChecks.every(check => check.checkType === 'AUTO_CHECK')).toBe(true);
    });

    test('gets latest check result for specific type', () => {
        const attestation = new ValuAttestation(mockSumSubData, mockInspectionData);
        const latestAutoCheck = attestation.getLatestCheckResult('AUTO_CHECK');
        
        expect(latestAutoCheck).toBe("YELLOW"); // Latest AUTO_CHECK is YELLOW
        
        const latestCrossValidation = attestation.getLatestCheckResult('CROSS_VALIDATION');
        expect(latestCrossValidation).toBe("GREEN");
    });

    test('checks if all verification checks passed', () => {
        const attestation = new ValuAttestation(mockSumSubData, mockInspectionData);
        const allPassed = attestation.areAllChecksPassed();
        
        expect(allPassed).toBe(false); // One check is YELLOW, not all GREEN
    });

    test('generates DataDescriptors with passport fields and image hash', () => {
        const attestation = new ValuAttestation(mockSumSubData, mockInspectionData);
        const dataDescriptors = attestation.generateVerusDataDescriptors();
        
        expect(dataDescriptors).toBeDefined();
        expect(Array.isArray(dataDescriptors)).toBe(true);
        expect(dataDescriptors.length).toBeGreaterThan(0);
        
        // Check for passport-specific fields
        const passportFields = dataDescriptors.filter(desc => 
            desc.objectdata && 
            (desc.objectdata.toString('utf-8') === "Mock-W3XGD01WF2" || // passport number
             desc.objectdata.toString('utf-8') === "2026-07-12" || // expiry date
             desc.objectdata.toString('utf-8') === "2006-01-22" || // passport DOB
             desc.objectdata.toString('utf-8') === "SRB" || // passport country
             desc.objectdata.toString('utf-8') === "e1d34cb8beaf9dee3fc3e5d6854e7ec31565ea02") // image hash
        );
        
        expect(passportFields.length).toBeGreaterThan(0);
        
        // Specifically check for passport image hash
        const imageHashDescriptor = dataDescriptors.find(desc => 
            desc.objectdata && desc.objectdata.toString('utf-8') === "e1d34cb8beaf9dee3fc3e5d6854e7ec31565ea02"
        );
        expect(imageHashDescriptor).toBeDefined();
    });

    test('handles missing inspection data gracefully', () => {
        const attestation = new ValuAttestation(mockSumSubData);
        
        expect(attestation.getAllImages()).toEqual([]);
        expect(attestation.getPassportImages()).toEqual([]);
        expect(attestation.getPassportImageHash()).toBeNull();
        expect(attestation.getAllChecks()).toEqual([]);
        expect(attestation.getInspectionDate()).toBeNull();
        expect(attestation.getImageReferences()).toEqual([]);
        expect(attestation.getPassportImageReferences()).toEqual([]);
    });

    test('extracts image references from inspection data', () => {
        const attestation = new ValuAttestation(mockSumSubData, mockInspectionData);
        const imageReferences = attestation.getImageReferences();
        
        expect(imageReferences).toBeDefined();
        expect(Array.isArray(imageReferences)).toBe(true);
        expect(imageReferences.length).toBe(1);
        expect(imageReferences[0]).toBe("668bb6c999a8380df1220dac");
    });

    test('gets image references by document type', () => {
        const attestation = new ValuAttestation(mockSumSubData, mockInspectionData);
        const passportImageRefs = attestation.getImageReferencesByDocType('PASSPORT');
        
        expect(passportImageRefs).toBeDefined();
        expect(Array.isArray(passportImageRefs)).toBe(true);
        expect(passportImageRefs.length).toBe(1);
        expect(passportImageRefs[0]).toBe("668bb6c999a8380df1220dac");
    });

    test('gets passport image references specifically', () => {
        const attestation = new ValuAttestation(mockSumSubData, mockInspectionData);
        const passportImageRefs = attestation.getPassportImageReferences();
        
        expect(passportImageRefs).toBeDefined();
        expect(Array.isArray(passportImageRefs)).toBe(true);
        expect(passportImageRefs.length).toBe(1);
        expect(passportImageRefs[0]).toBe("668bb6c999a8380df1220dac");
    });

    test('updates image references when setting inspection data separately', () => {
        const attestation = new ValuAttestation(mockSumSubData);
        expect(attestation.getImageReferences()).toEqual([]);
        
        attestation.setInspectionData(mockInspectionData);
        const imageReferences = attestation.getImageReferences();
        
        expect(imageReferences.length).toBe(1);
        expect(imageReferences[0]).toBe("668bb6c999a8380df1220dac");
    });

    test('returns copy of image references to prevent external modification', () => {
        const attestation = new ValuAttestation(mockSumSubData, mockInspectionData);
        const imageRefs1 = attestation.getImageReferences();
        const imageRefs2 = attestation.getImageReferences();
        
        // Should be equal but not the same reference
        expect(imageRefs1).toEqual(imageRefs2);
        expect(imageRefs1).not.toBe(imageRefs2);
        
        // Modifying one should not affect the other
        imageRefs1.push("test");
        expect(attestation.getImageReferences()).not.toContain("test");
    });

    test('generates MMR data with proper formatting', () => {
        const attestation = new ValuAttestation(mockSumSubData, mockInspectionData);
        
        const identityFor = "identity1@";
        const title = "KYC Verification Attestation";
        const publicAddress = "ValuAttestation@";
        
        const mmrData = attestation.generateMMRData(identityFor, title, publicAddress);
        
        expect(mmrData).toBeDefined();
        expect(Array.isArray(mmrData)).toBe(true);
        expect(mmrData.length).toBeGreaterThan(0);
        
        // Check format of MMR data objects
        mmrData.forEach(item => {
            expect(item).toHaveProperty('vdxfdata');
            expect(typeof item.vdxfdata).toBe('object');
        });
        
        // Check that metadata descriptors are at the beginning
        const firstItem = mmrData[0];
        expect(firstItem.vdxfdata).toBeDefined();
        
        // Should contain title and public address in the data
        const allDataAsString = JSON.stringify(mmrData);
        expect(allDataAsString).toContain(title);
        expect(allDataAsString).toContain(publicAddress);
    });

    test('throws error for invalid MMR data parameters', () => {
        const attestation = new ValuAttestation(mockSumSubData, mockInspectionData);
        
        expect(() => attestation.generateMMRData("", "title", "address")).toThrow();
        expect(() => attestation.generateMMRData("identity", "", "address")).toThrow();
        expect(() => attestation.generateMMRData("identity", "title", "")).toThrow();
        expect(() => attestation.generateMMRData("", "", "")).toThrow();
    });

    test('MMR data includes both metadata and personal data', () => {
        const attestation = new ValuAttestation(mockSumSubData, mockInspectionData);
        
        const mmrData = attestation.generateMMRData("identity1@", "Test Attestation", "ValuAttestation@");
        
        // Should have more than just metadata (2 metadata + personal data)
        expect(mmrData.length).toBeGreaterThan(2);
        
        // Convert to string to check contents
        const dataString = JSON.stringify(mmrData);
        
        // Should contain metadata
        expect(dataString).toContain("Test Attestation");
        expect(dataString).toContain("ValuAttestation@");
        
        // Should contain personal data
        expect(dataString).toContain("John");
        expect(dataString).toContain("Mock-Doe");
        expect(dataString).toContain("monkins@yahoo.com");
    });
});
