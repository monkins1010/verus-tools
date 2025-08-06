import { DataDescriptor } from 'verus-typescript-primitives';
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
export declare class ValuAttestation {
    private data;
    private inspectionData?;
    private imageReferences;
    constructor(sumSubData: SumSubData, inspectionData?: SumSubInspectionData);
    /**
     * Extracts image IDs from inspection data and stores them in imageReferences
     */
    private extractImageReferences;
    /**
     * Gets all image references (IDs) from inspection data
     */
    getImageReferences(): string[];
    /**
     * Gets image references filtered by document type
     */
    getImageReferencesByDocType(docType: string): string[];
    /**
     * Gets passport image references specifically
     */
    getPassportImageReferences(): string[];
    /**
     * Helper function to create a DataDescriptor
     */
    private createDataDescriptor;
    /**
     * Maps SumSub KYC JSON data to Verus DataDescriptors
     */
    private mapSumSubToDataDescriptors;
    /**
     * Generates a POL (Proof of Life) Attestation with attestor and title
     */
    generatePOLDataDescriptors(attestor: string, title: string): DataDescriptor[];
    /**
     * Generates Verus DataDescriptors from SumSub applicant data
     */
    generateVerusDataDescriptors(): DataDescriptor[];
    /**
     * Generates MMR data formatted for blockchain storage with metadata
     * @param identityFor - The identity this attestation is for
     * @param title - The title/name of the attestation
     * @param publicAddress - The public address/attestor
     * @returns Array of formatted MMR data objects
     */
    generateMMRData(identityIdFor: string, title: string, publicAddress: string): Array<{
        vdxfdata: {
            [key: string]: any;
        };
    }>;
    /**
     * Gets the raw SumSub data
     */
    getData(): SumSubData;
    /**
     * Gets specific information from the SumSub data
     */
    getPersonalInfo(): SumSubInfo | null;
    /**
     * Gets address information from the SumSub data
     */
    getAddressInfo(): SumSubAddress[];
    /**
     * Gets verification status
     */
    getVerificationStatus(): string | null;
    /**
     * Gets the applicant ID
     */
    getApplicantId(): string;
    /**
     * Gets the email address
     */
    getEmail(): string;
    /**
     * Checks if the review is completed
     */
    isReviewCompleted(): boolean;
    /**
     * Gets the review date
     */
    getReviewDate(): string | null;
    /**
     * Gets the creation date
     */
    getCreatedAt(): string;
    /**
     * Gets all tags associated with the applicant
     */
    getTags(): string[];
    /**
     * Checks if a specific tag exists
     */
    hasTag(tag: string): boolean;
    /**
     * Gets the first ID document if available
     */
    getPrimaryIdDocument(): SumSubIdDoc | null;
    /**
     * Gets all ID documents
     */
    getAllIdDocuments(): SumSubIdDoc[];
    /**
     * Sets inspection data separately if not provided in constructor
     */
    setInspectionData(inspectionData: SumSubInspectionData): void;
    /**
     * Gets inspection data
     */
    getInspectionData(): SumSubInspectionData | null;
    /**
     * Gets all images from inspection data
     */
    getAllImages(): SumSubImage[];
    /**
     * Gets images filtered by document type
     */
    getImagesByDocType(docType: string): SumSubImage[];
    /**
     * Gets passport images specifically
     */
    getPassportImages(): SumSubImage[];
    /**
     * Gets the primary passport image hash
     */
    getPassportImageHash(): string | null;
    /**
     * Gets all checks from inspection data
     */
    getAllChecks(): SumSubCheck[];
    /**
     * Gets checks filtered by type
     */
    getChecksByType(checkType: string): SumSubCheck[];
    /**
     * Gets the latest check result for a specific type
     */
    getLatestCheckResult(checkType: string): string | null;
    /**
     * Checks if all verification checks passed (GREEN)
     */
    areAllChecksPassed(): boolean;
    /**
     * Gets inspection date
     */
    getInspectionDate(): string | null;
}
