import { BN } from 'bn.js';
import { DataDescriptor } from 'verus-typescript-primitives';
import * as primitives from 'verus-typescript-primitives';
import {
    IDENTITY_FIRSTNAME,
    IDENTITY_LASTNAME,
    IDENTITY_MIDDLENAME,
    IDENTITY_DATEOFBIRTH,
    IDENTITY_GENDER,
    IDENTITY_NATIONALITY,
    IDENTITY_EMAIL,
    IDENTITY_PHONENUMBER,
    IDENTITY_HOMEADDRESS_STREET1,
    IDENTITY_HOMEADDRESS_STREET2,
    IDENTITY_HOMEADDRESS_CITY,
    IDENTITY_HOMEADDRESS_REGION,
    IDENTITY_HOMEADDRESS_POSTCODE,
    IDENTITY_HOMEADDRESS_COUNTRY,
    IDENTITY_IDNUMBER_VALUE,
    IDENTITY_IDNUMBER_TYPE,
    IDENTITY_VERIFICATION_STATUS,
    IDENTITY_ACCOUNT_ID,
    IDENTITY_ACCOUNT_CREATEDAT,
    IDENTITY_ACCOUNT_COMPLETEDAT,
    IDENTITY_ATTESTATION_RECIPIENT,
    IDENTITY_PASSPORT_IDNUMBER,
    IDENTITY_PASSPORT_EXPIRATIONDATE,
    IDENTITY_PASSPORT_DATEOFBIRTH,
    IDENTITY_PASSPORT_ADDRESS_COUNTRY,
    IDENTITY_PASSPORT_ORIGINALFRONT
} from 'verus-typescript-primitives';
import { ATTESTATION_NAME } from 'verus-typescript-primitives';

export interface SumSubIdDoc {
    idDocType: string;
    country: string;
    firstName: string;
    firstNameEn: string;
    lastName: string;
    lastNameEn: string;
    validUntil: string;
    number: string;
    dob: string;
    mrzLine1: string;
    mrzLine2: string;
}

export interface SumSubInfo {
    firstName: string;
    firstNameEn: string;
    lastName: string;
    lastNameEn: string;
    dob: string;
    gender: string;
    country: string;
    nationality: string;
    idDocs: SumSubIdDoc[];
}

export interface SumSubAddress {
    street: string;
    streetEn: string;
    state: string;
    stateEn: string;
    town: string;
    townEn: string;
    postCode: string;
    country: string;
    formattedAddress: string;
}

export interface SumSubFixedInfo {
    country: string;
    addresses: SumSubAddress[];
}

export interface SumSubAgreement {
    createdAt: string;
    acceptedAt: string;
    source: string;
    recordIds: string[];
}

export interface SumSubRequiredIdDocField {
    name: string;
    required: boolean;
    prefill: any;
    immutableIfPresent: any;
}

export interface SumSubRequiredIdDocSet {
    idDocSetType: string;
    types?: string[];
    fields?: SumSubRequiredIdDocField[];
}

export interface SumSubRequiredIdDocs {
    excludedCountries: string[];
    docSets: SumSubRequiredIdDocSet[];
}

export interface SumSubReviewResult {
    reviewAnswer: string;
}

export interface SumSubReview {
    reviewId: string;
    attemptId: string;
    attemptCnt: number;
    elapsedSincePendingMs: number;
    elapsedSinceQueuedMs: number;
    reprocessing: boolean;
    levelAutoCheckMode: any;
    createDate: string;
    reviewDate: string;
    reviewResult: SumSubReviewResult;
    reviewStatus: string;
    priority: number;
}

export interface SumSubImageResolution {
    width: number;
    height: number;
}

export interface SumSubImageTrust {
    trust: number;
}

export interface SumSubIdDocDef {
    country: string;
    idDocType: string;
}

export interface SumSubExtractedInfo {
    ocrDocType: string;
    screenRecapture: boolean;
    unsatisfactoryAnswer: string;
}

export interface SumSubImageReviewResult {
    reviewAnswer: string;
}

export interface SumSubImage {
    id: string;
    addedDate: string;
    creatorClientId: string;
    creatorSubjectRole: any;
    imageHash: string;
    imageFileName: string;
    resizedImageId: number;
    mimeType: string;
    imageId: number;
    make: string;
    model: string;
    fileSize: number;
    actualResolution: SumSubImageResolution;
    exifResolution: SumSubImageResolution;
    creationDate: string;
    modificationDate: string;
    answer: string;
    comments: any;
    imageTrust: SumSubImageTrust;
    idDocDef: SumSubIdDocDef;
    extractedInfo: SumSubExtractedInfo;
    reviewResult: SumSubImageReviewResult;
    attemptId: string;
    copiedFrom: any;
    copiedAt: string;
}

export interface SumSubCheck {
    answer: string;
    checkType: string;
    createdAt: string;
    id: string;
    attemptId: string;
    similarSearchInfo?: any;
    autoCheckInfo?: any;
}

export interface SumSubInspectionData {
    id: string;
    inspectionDate: string;
    applicantId: string;
    images: SumSubImage[];
    checks: SumSubCheck[];
}

export interface SumSubData {
    id: string;
    createdAt: string;
    key: string;
    clientId: string;
    inspectionId: string;
    externalUserId: string;
    info: SumSubInfo;
    fixedInfo: SumSubFixedInfo;
    email: string;
    applicantPlatform: string;
    ipCountry: string;
    agreement: SumSubAgreement;
    requiredIdDocs: SumSubRequiredIdDocs;
    review: SumSubReview;
    lang: string;
    type: string;
    notes: any[];
    tags: string[];
    copyOf: any;
    reuseScope: string;
    phone?: string;
    inspectionData?: SumSubInspectionData;
}

export class ValuAttestation {
    private data: SumSubData;
    private inspectionData?: SumSubInspectionData;
    private imageReferences: string[] = [];

    constructor(sumSubData: SumSubData, inspectionData?: SumSubInspectionData) {
        this.data = sumSubData;
        this.inspectionData = inspectionData || sumSubData.inspectionData;
        this.extractImageReferences();
    }

    /**
     * Extracts image IDs from inspection data and stores them in imageReferences
     */
    private extractImageReferences(): void {
        this.imageReferences = [];
        if (this.inspectionData && this.inspectionData.images) {
            this.imageReferences = this.inspectionData.images.map(image => image.id);
        }
    }

    /**
     * Gets all image references (IDs) from inspection data
     */
    getImageReferences(): string[] {
        return [...this.imageReferences]; // Return a copy to prevent external modification
    }

    /**
     * Gets image references filtered by document type
     */
    getImageReferencesByDocType(docType: string): string[] {
        if (!this.inspectionData?.images) return [];
        
        return this.inspectionData.images
            .filter(image => image.idDocDef && image.idDocDef.idDocType === docType)
            .map(image => image.id);
    }

    /**
     * Gets passport image references specifically
     */
    getPassportImageReferences(): string[] {
        return this.getImageReferencesByDocType('PASSPORT');
    }

    /**
     * Helper function to create a DataDescriptor
     */
    private createDataDescriptor(vdxfKey: any, value: any, mimeType: string = 'text/plain'): DataDescriptor | null {
        if (value === null || value === undefined || value === '') return null;
        
        const tempDataDescriptor = new DataDescriptor();
        tempDataDescriptor.label = vdxfKey.vdxfid;
        tempDataDescriptor.objectdata = Buffer.from(String(value), 'utf-8');
        tempDataDescriptor.mimeType = mimeType;
        tempDataDescriptor.SetFlags();

        return tempDataDescriptor;
    }

    /**
     * Maps SumSub KYC JSON data to Verus DataDescriptors
     */
    private mapSumSubToDataDescriptors(): DataDescriptor[] {
        const dataDescriptorsArray: DataDescriptor[] = [];

        // Map basic identity information
        if (this.data.info) {
            const info = this.data.info;
            
            // First Name
            const firstNameDescriptor = this.createDataDescriptor(IDENTITY_FIRSTNAME, info.firstName || info.firstNameEn);
            if (firstNameDescriptor) dataDescriptorsArray.push(firstNameDescriptor);

            // Last Name
            const lastNameDescriptor = this.createDataDescriptor(IDENTITY_LASTNAME, info.lastName || info.lastNameEn);
            if (lastNameDescriptor) dataDescriptorsArray.push(lastNameDescriptor);

            // Date of Birth
            const dobDescriptor = this.createDataDescriptor(IDENTITY_DATEOFBIRTH, info.dob);
            if (dobDescriptor) dataDescriptorsArray.push(dobDescriptor);

            // Gender
            const genderDescriptor = this.createDataDescriptor(IDENTITY_GENDER, info.gender);
            if (genderDescriptor) dataDescriptorsArray.push(genderDescriptor);

            // Nationality
            const nationalityDescriptor = this.createDataDescriptor(IDENTITY_NATIONALITY, info.nationality);
            if (nationalityDescriptor) dataDescriptorsArray.push(nationalityDescriptor);

            // ID Document information
            if (info.idDocs && info.idDocs.length > 0) {
                const idDoc = info.idDocs[0]; // Use first ID document
    
                // Map passport-specific fields
                if (idDoc.idDocType === 'PASSPORT') {
                    // Passport ID Number
                    const passportIdDescriptor = this.createDataDescriptor(IDENTITY_PASSPORT_IDNUMBER, idDoc.number);
                    if (passportIdDescriptor) dataDescriptorsArray.push(passportIdDescriptor);

                    // Passport Expiry Date
                    const passportExpiryDescriptor = this.createDataDescriptor(IDENTITY_PASSPORT_EXPIRATIONDATE, idDoc.validUntil);
                    if (passportExpiryDescriptor) dataDescriptorsArray.push(passportExpiryDescriptor);

                    // Passport Date of Birth
                    const passportDobDescriptor = this.createDataDescriptor(IDENTITY_PASSPORT_DATEOFBIRTH, idDoc.dob);
                    if (passportDobDescriptor) dataDescriptorsArray.push(passportDobDescriptor);

                    // Passport Country
                    const passportCountryDescriptor = this.createDataDescriptor(IDENTITY_PASSPORT_ADDRESS_COUNTRY, idDoc.country);
                    if (passportCountryDescriptor) dataDescriptorsArray.push(passportCountryDescriptor);
                }
            }
        }

        // Map image information from inspection data
        if (this.inspectionData && this.inspectionData.images && this.inspectionData.images.length > 0) {
            // Find passport images
            const passportImages = this.inspectionData.images.filter(image => 
                image.idDocDef && image.idDocDef.idDocType === 'PASSPORT'
            );

            if (passportImages.length > 0) {
                // Use the first passport image for the front
                const frontImage = passportImages[0];
                const passportFrontDescriptor = this.createDataDescriptor(
                    IDENTITY_PASSPORT_ORIGINALFRONT, 
                    frontImage.imageHash
                );
                if (passportFrontDescriptor) dataDescriptorsArray.push(passportFrontDescriptor);
            }
        }

        // Map contact information
        // Email
        const emailDescriptor = this.createDataDescriptor(IDENTITY_EMAIL, this.data.email);
        if (emailDescriptor) dataDescriptorsArray.push(emailDescriptor);

        // Phone (if available in the data)
        if (this.data.phone) {
            const phoneDescriptor = this.createDataDescriptor(IDENTITY_PHONENUMBER, this.data.phone);
            if (phoneDescriptor) dataDescriptorsArray.push(phoneDescriptor);
        }

        // Map address information
        if (this.data.fixedInfo && this.data.fixedInfo.addresses && this.data.fixedInfo.addresses.length > 0) {
            const address = this.data.fixedInfo.addresses[0]; // Use first address
            
            // Street Address
            const streetDescriptor = this.createDataDescriptor(IDENTITY_HOMEADDRESS_STREET1, address.street || address.streetEn);
            if (streetDescriptor) dataDescriptorsArray.push(streetDescriptor);

            // City
            const cityDescriptor = this.createDataDescriptor(IDENTITY_HOMEADDRESS_CITY, address.town || address.townEn);
            if (cityDescriptor) dataDescriptorsArray.push(cityDescriptor);

            // State/Region
            const regionDescriptor = this.createDataDescriptor(IDENTITY_HOMEADDRESS_REGION, address.state || address.stateEn);
            if (regionDescriptor) dataDescriptorsArray.push(regionDescriptor);

            // Postal Code
            const postcodeDescriptor = this.createDataDescriptor(IDENTITY_HOMEADDRESS_POSTCODE, address.postCode);
            if (postcodeDescriptor) dataDescriptorsArray.push(postcodeDescriptor);

            // Country
            const countryDescriptor = this.createDataDescriptor(IDENTITY_HOMEADDRESS_COUNTRY, address.country);
            if (countryDescriptor) dataDescriptorsArray.push(countryDescriptor);
        }

        // Map account information
        // Account ID
        const accountIdDescriptor = this.createDataDescriptor(IDENTITY_ACCOUNT_ID, this.data.id);
        if (accountIdDescriptor) dataDescriptorsArray.push(accountIdDescriptor);

        // Created At
        const createdAtDescriptor = this.createDataDescriptor(IDENTITY_ACCOUNT_CREATEDAT, this.data.createdAt);
        if (createdAtDescriptor) dataDescriptorsArray.push(createdAtDescriptor);

        // Verification Status
        if (this.data.review && this.data.review.reviewResult) {
            const statusDescriptor = this.createDataDescriptor(IDENTITY_VERIFICATION_STATUS, this.data.review.reviewResult.reviewAnswer);
            if (statusDescriptor) dataDescriptorsArray.push(statusDescriptor);
        }

        // Completion Date (if review is completed)
        if (this.data.review && this.data.review.reviewStatus === 'completed' && this.data.review.reviewDate) {
            const completedAtDescriptor = this.createDataDescriptor(IDENTITY_ACCOUNT_COMPLETEDAT, this.data.review.reviewDate);
            if (completedAtDescriptor) dataDescriptorsArray.push(completedAtDescriptor);
        }

        return dataDescriptorsArray;
    }

    /**
     * Generates a POL (Proof of Life) Attestation with attestor and title
     */
    generatePOLDataDescriptors(attestor: string, title: string): DataDescriptor[] {
        if (!attestor || !title) {
            throw new Error('Invalid attestor or title data');
        }

        try {
            const dataDescriptors = this.mapSumSubToDataDescriptors();

            // Add the name of the attestation
            const attestationNameDescriptor = new DataDescriptor({
                label: ATTESTATION_NAME.vdxfid,
                objectdata: Buffer.from(title, 'utf-8'),
                mimeType: 'text/plain',
                flags: new BN(96),
            });
            dataDescriptors.push(attestationNameDescriptor);

            // Add the attestor of the attestation
            const attestationRecipientDescriptor = new DataDescriptor({
                label: IDENTITY_ATTESTATION_RECIPIENT.vdxfid,
                objectdata: Buffer.from(attestor, 'utf-8'),
                mimeType: 'text/plain',
                flags: new BN(96),
            });
            dataDescriptors.push(attestationRecipientDescriptor);

            return dataDescriptors;

        } catch (error) {
            throw new Error(`Failed to generate POL attestation: ${error}`);
        }
    }

    /**
     * Generates Verus DataDescriptors from SumSub applicant data
     */
    generateVerusDataDescriptors(): DataDescriptor[] {
        try {
            // Map SumSub data to Verus DataDescriptors
            const dataDescriptors = this.mapSumSubToDataDescriptors();
            
            return dataDescriptors;
        } catch (error) {
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
    generateMMRData(identityIdFor: string, title: string, publicAddress: string): Array<{ vdxfdata: { [key: string]: any } }> {
        if (!identityIdFor || !title || !publicAddress) {
            throw new Error('Invalid parameters: identityFor, title, and publicAddress are required');
        }

        try {
            // Get base data descriptors
            const baseDataDescriptors = this.mapSumSubToDataDescriptors();
            
            // Create metadata descriptors that go at the beginning
            const metadataDescriptors: DataDescriptor[] = [];

            // Add attestation name/title
            metadataDescriptors.push(
                new DataDescriptor({
                    label: ATTESTATION_NAME.vdxfid,
                    objectdata: Buffer.from(title, 'utf-8'),
                    mimeType: 'text/plain',
                    flags: new BN(96),
                })
            );

            // Add attestation recipient (public address/attestor)
            metadataDescriptors.push(
                new DataDescriptor({
                    label: IDENTITY_ATTESTATION_RECIPIENT.vdxfid,
                    objectdata: Buffer.from(identityIdFor, 'utf-8'),
                    mimeType: 'text/plain',
                    flags: new BN(96),
                })
            );

            metadataDescriptors.push(
                new DataDescriptor({
                    label: IDENTITY_ATTESTATION_RECIPIENT.vdxfid,
                    objectdata: Buffer.from(publicAddress, 'utf-8'),
                    mimeType: 'text/plain',
                    flags: new BN(96),
                })
            );

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

        } catch (error) {
            throw new Error(`Failed to generate MMR data: ${error}`);
        }
    }

    /**
     * Gets the raw SumSub data
     */
    getData(): SumSubData {
        return this.data;
    }

    /**
     * Gets specific information from the SumSub data
     */
    getPersonalInfo(): SumSubInfo | null {
        return this.data.info || null;
    }

    /**
     * Gets address information from the SumSub data
     */
    getAddressInfo(): SumSubAddress[] {
        return this.data.fixedInfo?.addresses || [];
    }

    /**
     * Gets verification status
     */
    getVerificationStatus(): string | null {
        return this.data.review?.reviewResult?.reviewAnswer || null;
    }

    /**
     * Gets the applicant ID
     */
    getApplicantId(): string {
        return this.data.id;
    }

    /**
     * Gets the email address
     */
    getEmail(): string {
        return this.data.email;
    }

    /**
     * Checks if the review is completed
     */
    isReviewCompleted(): boolean {
        return this.data.review?.reviewStatus === 'completed';
    }

    /**
     * Gets the review date
     */
    getReviewDate(): string | null {
        return this.data.review?.reviewDate || null;
    }

    /**
     * Gets the creation date
     */
    getCreatedAt(): string {
        return this.data.createdAt;
    }

    /**
     * Gets all tags associated with the applicant
     */
    getTags(): string[] {
        return this.data.tags || [];
    }

    /**
     * Checks if a specific tag exists
     */
    hasTag(tag: string): boolean {
        return this.data.tags?.includes(tag) || false;
    }

    /**
     * Gets the first ID document if available
     */
    getPrimaryIdDocument(): SumSubIdDoc | null {
        return this.data.info?.idDocs?.[0] || null;
    }

    /**
     * Gets all ID documents
     */
    getAllIdDocuments(): SumSubIdDoc[] {
        return this.data.info?.idDocs || [];
    }

    /**
     * Sets inspection data separately if not provided in constructor
     */
    setInspectionData(inspectionData: SumSubInspectionData): void {
        this.inspectionData = inspectionData;
        this.extractImageReferences(); // Update image references when new inspection data is set
    }

    /**
     * Gets inspection data
     */
    getInspectionData(): SumSubInspectionData | null {
        return this.inspectionData || null;
    }

    /**
     * Gets all images from inspection data
     */
    getAllImages(): SumSubImage[] {
        return this.inspectionData?.images || [];
    }

    /**
     * Gets images filtered by document type
     */
    getImagesByDocType(docType: string): SumSubImage[] {
        return this.getAllImages().filter(image => 
            image.idDocDef && image.idDocDef.idDocType === docType
        );
    }

    /**
     * Gets passport images specifically
     */
    getPassportImages(): SumSubImage[] {
        return this.getImagesByDocType('PASSPORT');
    }

    /**
     * Gets the primary passport image hash
     */
    getPassportImageHash(): string | null {
        const passportImages = this.getPassportImages();
        return passportImages.length > 0 ? passportImages[0].imageHash : null;
    }

    /**
     * Gets all checks from inspection data
     */
    getAllChecks(): SumSubCheck[] {
        return this.inspectionData?.checks || [];
    }

    /**
     * Gets checks filtered by type
     */
    getChecksByType(checkType: string): SumSubCheck[] {
        return this.getAllChecks().filter(check => check.checkType === checkType);
    }

    /**
     * Gets the latest check result for a specific type
     */
    getLatestCheckResult(checkType: string): string | null {
        const checks = this.getChecksByType(checkType);
        if (checks.length === 0) return null;
        
        // Sort by creation date and get the latest
        const sortedChecks = checks.sort((a, b) => 
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        
        return sortedChecks[0].answer;
    }

    /**
     * Checks if all verification checks passed (GREEN)
     */
    areAllChecksPassed(): boolean {
        const checks = this.getAllChecks();
        return checks.every(check => check.answer === 'GREEN');
    }

    /**
     * Gets inspection date
     */
    getInspectionDate(): string | null {
        return this.inspectionData?.inspectionDate || null;
    }
}
