"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValuAttestation = void 0;
const bn_js_1 = require("bn.js");
const verus_typescript_primitives_1 = require("verus-typescript-primitives");
const primitives = require("verus-typescript-primitives");
const verus_typescript_primitives_2 = require("verus-typescript-primitives");
const verus_typescript_primitives_3 = require("verus-typescript-primitives");
class ValuAttestation {
    constructor(sumSubData, inspectionData) {
        this.imageReferences = [];
        this.data = sumSubData;
        this.inspectionData = inspectionData || sumSubData.inspectionData;
        this.extractImageReferences();
    }
    /**
     * Extracts image IDs from inspection data and stores them in imageReferences
     */
    extractImageReferences() {
        this.imageReferences = [];
        if (this.inspectionData && this.inspectionData.images) {
            this.imageReferences = this.inspectionData.images.map(image => image.id);
        }
    }
    /**
     * Gets all image references (IDs) from inspection data
     */
    getImageReferences() {
        return [...this.imageReferences]; // Return a copy to prevent external modification
    }
    /**
     * Gets image references filtered by document type
     */
    getImageReferencesByDocType(docType) {
        var _a;
        if (!((_a = this.inspectionData) === null || _a === void 0 ? void 0 : _a.images))
            return [];
        return this.inspectionData.images
            .filter(image => image.idDocDef && image.idDocDef.idDocType === docType)
            .map(image => image.id);
    }
    /**
     * Gets passport image references specifically
     */
    getPassportImageReferences() {
        return this.getImageReferencesByDocType('PASSPORT');
    }
    /**
     * Helper function to create a DataDescriptor
     */
    createDataDescriptor(vdxfKey, value, mimeType = 'text/plain') {
        if (value === null || value === undefined || value === '')
            return null;
        const tempDataDescriptor = new verus_typescript_primitives_1.DataDescriptor();
        tempDataDescriptor.label = vdxfKey.vdxfid;
        tempDataDescriptor.objectdata = Buffer.from(String(value), 'utf-8');
        tempDataDescriptor.mimeType = mimeType;
        tempDataDescriptor.SetFlags();
        return tempDataDescriptor;
    }
    /**
     * Maps SumSub KYC JSON data to Verus DataDescriptors
     */
    mapSumSubToDataDescriptors() {
        const dataDescriptorsArray = [];
        // Map basic identity information
        if (this.data.info) {
            const info = this.data.info;
            // First Name
            const firstNameDescriptor = this.createDataDescriptor(verus_typescript_primitives_2.IDENTITY_FIRSTNAME, info.firstName || info.firstNameEn);
            if (firstNameDescriptor)
                dataDescriptorsArray.push(firstNameDescriptor);
            // Last Name
            const lastNameDescriptor = this.createDataDescriptor(verus_typescript_primitives_2.IDENTITY_LASTNAME, info.lastName || info.lastNameEn);
            if (lastNameDescriptor)
                dataDescriptorsArray.push(lastNameDescriptor);
            // Date of Birth
            const dobDescriptor = this.createDataDescriptor(verus_typescript_primitives_2.IDENTITY_DATEOFBIRTH, info.dob);
            if (dobDescriptor)
                dataDescriptorsArray.push(dobDescriptor);
            // Gender
            const genderDescriptor = this.createDataDescriptor(verus_typescript_primitives_2.IDENTITY_GENDER, info.gender);
            if (genderDescriptor)
                dataDescriptorsArray.push(genderDescriptor);
            // Nationality
            const nationalityDescriptor = this.createDataDescriptor(verus_typescript_primitives_2.IDENTITY_NATIONALITY, info.nationality);
            if (nationalityDescriptor)
                dataDescriptorsArray.push(nationalityDescriptor);
            // ID Document information
            if (info.idDocs && info.idDocs.length > 0) {
                const idDoc = info.idDocs[0]; // Use first ID document
                // Map passport-specific fields
                if (idDoc.idDocType === 'PASSPORT') {
                    // Passport ID Number
                    const passportIdDescriptor = this.createDataDescriptor(verus_typescript_primitives_2.IDENTITY_PASSPORT_IDNUMBER, idDoc.number);
                    if (passportIdDescriptor)
                        dataDescriptorsArray.push(passportIdDescriptor);
                    // Passport Expiry Date
                    const passportExpiryDescriptor = this.createDataDescriptor(verus_typescript_primitives_2.IDENTITY_PASSPORT_EXPIRATIONDATE, idDoc.validUntil);
                    if (passportExpiryDescriptor)
                        dataDescriptorsArray.push(passportExpiryDescriptor);
                    // Passport Date of Birth
                    const passportDobDescriptor = this.createDataDescriptor(verus_typescript_primitives_2.IDENTITY_PASSPORT_DATEOFBIRTH, idDoc.dob);
                    if (passportDobDescriptor)
                        dataDescriptorsArray.push(passportDobDescriptor);
                    // Passport Country
                    const passportCountryDescriptor = this.createDataDescriptor(verus_typescript_primitives_2.IDENTITY_PASSPORT_ADDRESS_COUNTRY, idDoc.country);
                    if (passportCountryDescriptor)
                        dataDescriptorsArray.push(passportCountryDescriptor);
                }
            }
        }
        // Map image information from inspection data
        if (this.inspectionData && this.inspectionData.images && this.inspectionData.images.length > 0) {
            // Find passport images
            const passportImages = this.inspectionData.images.filter(image => image.idDocDef && image.idDocDef.idDocType === 'PASSPORT');
            if (passportImages.length > 0) {
                // Use the first passport image for the front
                const frontImage = passportImages[0];
                const passportFrontDescriptor = this.createDataDescriptor(verus_typescript_primitives_2.IDENTITY_PASSPORT_ORIGINALFRONT, frontImage.imageHash);
                if (passportFrontDescriptor)
                    dataDescriptorsArray.push(passportFrontDescriptor);
            }
        }
        // Map contact information
        // Email
        const emailDescriptor = this.createDataDescriptor(verus_typescript_primitives_2.IDENTITY_EMAIL, this.data.email);
        if (emailDescriptor)
            dataDescriptorsArray.push(emailDescriptor);
        // Phone (if available in the data)
        if (this.data.phone) {
            const phoneDescriptor = this.createDataDescriptor(verus_typescript_primitives_2.IDENTITY_PHONENUMBER, this.data.phone);
            if (phoneDescriptor)
                dataDescriptorsArray.push(phoneDescriptor);
        }
        // Map address information
        if (this.data.fixedInfo && this.data.fixedInfo.addresses && this.data.fixedInfo.addresses.length > 0) {
            const address = this.data.fixedInfo.addresses[0]; // Use first address
            // Street Address
            const streetDescriptor = this.createDataDescriptor(verus_typescript_primitives_2.IDENTITY_HOMEADDRESS_STREET1, address.street || address.streetEn);
            if (streetDescriptor)
                dataDescriptorsArray.push(streetDescriptor);
            // City
            const cityDescriptor = this.createDataDescriptor(verus_typescript_primitives_2.IDENTITY_HOMEADDRESS_CITY, address.town || address.townEn);
            if (cityDescriptor)
                dataDescriptorsArray.push(cityDescriptor);
            // State/Region
            const regionDescriptor = this.createDataDescriptor(verus_typescript_primitives_2.IDENTITY_HOMEADDRESS_REGION, address.state || address.stateEn);
            if (regionDescriptor)
                dataDescriptorsArray.push(regionDescriptor);
            // Postal Code
            const postcodeDescriptor = this.createDataDescriptor(verus_typescript_primitives_2.IDENTITY_HOMEADDRESS_POSTCODE, address.postCode);
            if (postcodeDescriptor)
                dataDescriptorsArray.push(postcodeDescriptor);
            // Country
            const countryDescriptor = this.createDataDescriptor(verus_typescript_primitives_2.IDENTITY_HOMEADDRESS_COUNTRY, address.country);
            if (countryDescriptor)
                dataDescriptorsArray.push(countryDescriptor);
        }
        // Map account information
        // Account ID
        const accountIdDescriptor = this.createDataDescriptor(verus_typescript_primitives_2.IDENTITY_ACCOUNT_ID, this.data.id);
        if (accountIdDescriptor)
            dataDescriptorsArray.push(accountIdDescriptor);
        // Created At
        const createdAtDescriptor = this.createDataDescriptor(verus_typescript_primitives_2.IDENTITY_ACCOUNT_CREATEDAT, this.data.createdAt);
        if (createdAtDescriptor)
            dataDescriptorsArray.push(createdAtDescriptor);
        // Verification Status
        if (this.data.review && this.data.review.reviewResult) {
            const statusDescriptor = this.createDataDescriptor(verus_typescript_primitives_2.IDENTITY_VERIFICATION_STATUS, this.data.review.reviewResult.reviewAnswer);
            if (statusDescriptor)
                dataDescriptorsArray.push(statusDescriptor);
        }
        // Completion Date (if review is completed)
        if (this.data.review && this.data.review.reviewStatus === 'completed' && this.data.review.reviewDate) {
            const completedAtDescriptor = this.createDataDescriptor(verus_typescript_primitives_2.IDENTITY_ACCOUNT_COMPLETEDAT, this.data.review.reviewDate);
            if (completedAtDescriptor)
                dataDescriptorsArray.push(completedAtDescriptor);
        }
        return dataDescriptorsArray;
    }
    /**
     * Generates a POL (Proof of Life) Attestation with attestor and title
     */
    generatePOLDataDescriptors(attestor, title) {
        if (!attestor || !title) {
            throw new Error('Invalid attestor or title data');
        }
        try {
            const dataDescriptors = this.mapSumSubToDataDescriptors();
            // Add the name of the attestation
            const attestationNameDescriptor = new verus_typescript_primitives_1.DataDescriptor({
                label: verus_typescript_primitives_3.ATTESTATION_NAME.vdxfid,
                objectdata: Buffer.from(title, 'utf-8'),
                mimeType: 'text/plain',
                flags: new bn_js_1.BN(96),
            });
            dataDescriptors.push(attestationNameDescriptor);
            // Add the attestor of the attestation
            const attestationRecipientDescriptor = new verus_typescript_primitives_1.DataDescriptor({
                label: verus_typescript_primitives_2.IDENTITY_ATTESTATION_RECIPIENT.vdxfid,
                objectdata: Buffer.from(attestor, 'utf-8'),
                mimeType: 'text/plain',
                flags: new bn_js_1.BN(96),
            });
            dataDescriptors.push(attestationRecipientDescriptor);
            return dataDescriptors;
        }
        catch (error) {
            throw new Error(`Failed to generate POL attestation: ${error}`);
        }
    }
    /**
     * Generates Verus DataDescriptors from SumSub applicant data
     */
    generateVerusDataDescriptors() {
        try {
            // Map SumSub data to Verus DataDescriptors
            const dataDescriptors = this.mapSumSubToDataDescriptors();
            return dataDescriptors;
        }
        catch (error) {
            throw new Error(`Failed to generate Verus DataDescriptors: ${error}`);
        }
    }
    /**
     * Generates MMR data formatted for blockchain storage with metadata
     * @param identityFor - The identity this attestation is for
     * @param title - The title/name of the attestation
     * @param publicAddress - The public address/attestor
     * @returns Array of formatted MMR data objects
     */
    generateMMRData(identityIdFor, title, publicAddress) {
        if (!identityIdFor || !title || !publicAddress) {
            throw new Error('Invalid parameters: identityFor, title, and publicAddress are required');
        }
        try {
            // Get base data descriptors
            const baseDataDescriptors = this.mapSumSubToDataDescriptors();
            // Create metadata descriptors that go at the beginning
            const metadataDescriptors = [];
            // Add attestation name/title
            metadataDescriptors.push(new verus_typescript_primitives_1.DataDescriptor({
                label: verus_typescript_primitives_3.ATTESTATION_NAME.vdxfid,
                objectdata: Buffer.from(title, 'utf-8'),
                mimeType: 'text/plain',
                flags: new bn_js_1.BN(96),
            }));
            // Add attestation recipient (public address/attestor)
            metadataDescriptors.push(new verus_typescript_primitives_1.DataDescriptor({
                label: verus_typescript_primitives_2.IDENTITY_ATTESTATION_RECIPIENT.vdxfid,
                objectdata: Buffer.from(identityIdFor, 'utf-8'),
                mimeType: 'text/plain',
                flags: new bn_js_1.BN(96),
            }));
            metadataDescriptors.push(new verus_typescript_primitives_1.DataDescriptor({
                label: verus_typescript_primitives_2.IDENTITY_ATTESTATION_RECIPIENT.vdxfid,
                objectdata: Buffer.from(publicAddress, 'utf-8'),
                mimeType: 'text/plain',
                flags: new bn_js_1.BN(96),
            }));
            // Combine metadata and base descriptors (metadata first)
            const allDataDescriptors = [...metadataDescriptors, ...baseDataDescriptors];
            // Format for MMR using DataDescriptorKey
            const { DataDescriptorKey } = primitives;
            return allDataDescriptors.map((item) => {
                return {
                    vdxfdata: {
                        [DataDescriptorKey.vdxfid]: item.toJson()
                    }
                };
            });
        }
        catch (error) {
            throw new Error(`Failed to generate MMR data: ${error}`);
        }
    }
    /**
     * Gets the raw SumSub data
     */
    getData() {
        return this.data;
    }
    /**
     * Gets specific information from the SumSub data
     */
    getPersonalInfo() {
        return this.data.info || null;
    }
    /**
     * Gets address information from the SumSub data
     */
    getAddressInfo() {
        var _a;
        return ((_a = this.data.fixedInfo) === null || _a === void 0 ? void 0 : _a.addresses) || [];
    }
    /**
     * Gets verification status
     */
    getVerificationStatus() {
        var _a, _b;
        return ((_b = (_a = this.data.review) === null || _a === void 0 ? void 0 : _a.reviewResult) === null || _b === void 0 ? void 0 : _b.reviewAnswer) || null;
    }
    /**
     * Gets the applicant ID
     */
    getApplicantId() {
        return this.data.id;
    }
    /**
     * Gets the email address
     */
    getEmail() {
        return this.data.email;
    }
    /**
     * Checks if the review is completed
     */
    isReviewCompleted() {
        var _a;
        return ((_a = this.data.review) === null || _a === void 0 ? void 0 : _a.reviewStatus) === 'completed';
    }
    /**
     * Gets the review date
     */
    getReviewDate() {
        var _a;
        return ((_a = this.data.review) === null || _a === void 0 ? void 0 : _a.reviewDate) || null;
    }
    /**
     * Gets the creation date
     */
    getCreatedAt() {
        return this.data.createdAt;
    }
    /**
     * Gets all tags associated with the applicant
     */
    getTags() {
        return this.data.tags || [];
    }
    /**
     * Checks if a specific tag exists
     */
    hasTag(tag) {
        var _a;
        return ((_a = this.data.tags) === null || _a === void 0 ? void 0 : _a.includes(tag)) || false;
    }
    /**
     * Gets the first ID document if available
     */
    getPrimaryIdDocument() {
        var _a, _b;
        return ((_b = (_a = this.data.info) === null || _a === void 0 ? void 0 : _a.idDocs) === null || _b === void 0 ? void 0 : _b[0]) || null;
    }
    /**
     * Gets all ID documents
     */
    getAllIdDocuments() {
        var _a;
        return ((_a = this.data.info) === null || _a === void 0 ? void 0 : _a.idDocs) || [];
    }
    /**
     * Sets inspection data separately if not provided in constructor
     */
    setInspectionData(inspectionData) {
        this.inspectionData = inspectionData;
        this.extractImageReferences(); // Update image references when new inspection data is set
    }
    /**
     * Gets inspection data
     */
    getInspectionData() {
        return this.inspectionData || null;
    }
    /**
     * Gets all images from inspection data
     */
    getAllImages() {
        var _a;
        return ((_a = this.inspectionData) === null || _a === void 0 ? void 0 : _a.images) || [];
    }
    /**
     * Gets images filtered by document type
     */
    getImagesByDocType(docType) {
        return this.getAllImages().filter(image => image.idDocDef && image.idDocDef.idDocType === docType);
    }
    /**
     * Gets passport images specifically
     */
    getPassportImages() {
        return this.getImagesByDocType('PASSPORT');
    }
    /**
     * Gets the primary passport image hash
     */
    getPassportImageHash() {
        const passportImages = this.getPassportImages();
        return passportImages.length > 0 ? passportImages[0].imageHash : null;
    }
    /**
     * Gets all checks from inspection data
     */
    getAllChecks() {
        var _a;
        return ((_a = this.inspectionData) === null || _a === void 0 ? void 0 : _a.checks) || [];
    }
    /**
     * Gets checks filtered by type
     */
    getChecksByType(checkType) {
        return this.getAllChecks().filter(check => check.checkType === checkType);
    }
    /**
     * Gets the latest check result for a specific type
     */
    getLatestCheckResult(checkType) {
        const checks = this.getChecksByType(checkType);
        if (checks.length === 0)
            return null;
        // Sort by creation date and get the latest
        const sortedChecks = checks.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        return sortedChecks[0].answer;
    }
    /**
     * Checks if all verification checks passed (GREEN)
     */
    areAllChecksPassed() {
        const checks = this.getAllChecks();
        return checks.every(check => check.answer === 'GREEN');
    }
    /**
     * Gets inspection date
     */
    getInspectionDate() {
        var _a;
        return ((_a = this.inspectionData) === null || _a === void 0 ? void 0 : _a.inspectionDate) || null;
    }
}
exports.ValuAttestation = ValuAttestation;
