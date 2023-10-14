export const IDV_ERROR_STATUS = Object.freeze({
    DobMismatch: {
        code: 'DobMismatch',
        message: 'The date of birth retrieved from your document doesn’t match your profile.',
    },
    DocumentRejected: { code: 'DocumentRejected', message: 'Document was rejected by the provider' },
    EmptyStatus: {
        code: 'EmptyStatus',
        message: 'The verification status was empty, rejected for lack of information.',
    },
    Expired: { code: 'Expired', message: 'The document’s validity has been expired.' },
    InformationLack: {
        code: 'InformationLack',
        message: 'The verification is passed but the personal info is not available to compare.',
    },
    MalformedJson: {
        code: 'MalformedJson',
        message: 'The verification status is not available, provider says: Malformed JSON.',
    },
    NameMismatch: {
        code: 'NameMismatch',
        message: 'The name retrieved from your document doesn’t match your profile.',
    },
    RejectedByProvider: {
        code: 'RejectedByProvider',
        message: 'The document was rejected by the Provider.',
    },
    Underage: {
        code: 'Underage',
        message: 'You’re under legal age.',
    },
    Deceased: {
        code: 'Deceased',
        message: 'The document’s owner is deceased.',
    },
    Failed: {
        code: 'Failed',
        message: 'We were unable to verify the identity document with the details provided.',
    },
    NameDOBMismatch: {
        code: 'NameDOBMismatch',
        message: '',
    },
});

export const ONFIDO_ERROR_STATUS = Object.freeze({
    AgeValidationMinimumAcceptedAge: {
        code: 'AgeValidationMinimumAcceptedAge',
        message:
            'Your age in the document you provided appears to be below 18 years. We’re only allowed to offer our services to clients above 18 years old, so we’ll need to close your account. If you have a balance in your account, contact us via live chat and we’ll help to withdraw your funds before your account is closed.',
    },
    CompromisedDocument: {
        code: 'CompromisedDocument',
        message: 'Your document failed our verification checks.',
    },
    DataComparisonDateOfBirth: {
        code: 'DataComparisonDateOfBirth',
        message: 'The date of birth on your document doesn’t match your profile.',
    },
    DataComparisonDateOfExpiry: {
        code: 'DataComparisonDateOfExpiry',
        message: 'Your document has expired.',
    },
    DataComparisonDocumentNumbers: {
        code: 'DataComparisonDocumentNumbers',
        message: 'Your document appears to be invalid.',
    },
    DataComparisonDocumentType: {
        code: 'DataComparisonDocumentType',
        message: 'Your document appears to be invalid.',
    },
    DataComparisonIssuingCountry: {
        code: 'DataComparisonIssuingCountry',
        message: 'Your document appears to be invalid.',
    },
    DataComparisonName: {
        code: 'DataComparisonName',
        message: 'The name on your document doesn’t match your profile.',
    },
    DataValidationDateOfBirth: {
        code: 'DataValidationDateOfBirth',
        message: 'Some details on your document appear to be invalid, missing, or unclear.',
    },
    DataValidationDocumentExpiration: {
        code: 'DataValidationDocumentExpiration',
        message: 'Your document has expired.',
    },
    DataValidationDocumentNumbers: {
        code: 'DataValidationDocumentNumbers',
        message: 'Some details in your document appear to be invalid, missing, or unclear.',
    },
    DataValidationExpiryDate: {
        code: 'DataValidationExpiryDate',
        message: 'Some details on your document appear to be invalid, missing, or unclear.',
    },
    DataValidationMrz: {
        code: 'DataValidationMrz',
        message: 'Some details on your document appear to be invalid, missing, or unclear.',
    },
    DataValidationNoDocumentNumbers: {
        code: 'DataValidationNoDocumentNumbers',
        message: 'The serial number of your document couldn’t be verified.',
    },
    ImageIntegrityColourPicture: {
        code: 'ImageIntegrityColourPicture',
        message: 'Your document appears to be in black and white. Please upload a colour photo of your document.',
    },
    ImageIntegrityConclusiveDocumentQuality: {
        code: 'ImageIntegrityConclusiveDocumentQuality',
        message: 'Your document appears to be invalid.',
    },
    ImageIntegrityConclusiveDocumentQualityAbnormalDocumentFeatures: {
        code: 'ImageIntegrityConclusiveDocumentQualityAbnormalDocumentFeatures',
        message: 'Some details on your document appear to be invalid, missing, or unclear.',
    },
    ImageIntegrityConclusiveDocumentQualityCornerRemoved: {
        code: 'ImageIntegrityConclusiveDocumentQualityCornerRemoved',
        message: 'Your document appears to be damaged or cropped.',
    },
    ImageIntegrityConclusiveDocumentQualityDigitalDocument: {
        code: 'ImageIntegrityConclusiveDocumentQualityDigitalDocument',
        message: 'Your document appears to be a digital document.',
    },
    ImageIntegrityConclusiveDocumentQualityMissingBack: {
        code: 'ImageIntegrityConclusiveDocumentQualityMissingBack',
        message:
            'The back of your document appears to be missing. Please include both sides of your identity document.',
    },
    ImageIntegrityConclusiveDocumentQualityObscuredDataPoints: {
        code: 'ImageIntegrityConclusiveDocumentQualityObscuredDataPoints',
        message: 'Some details on your document appear to be invalid, missing, or unclear.',
    },
    ImageIntegrityConclusiveDocumentQualityObscuredSecurityFeatures: {
        code: 'ImageIntegrityConclusiveDocumentQualityObscuredSecurityFeatures',
        message: 'Some details on your document appear to be invalid, missing, or unclear.',
    },
    ImageIntegrityConclusiveDocumentQualityPuncturedDocument: {
        code: 'ImageIntegrityConclusiveDocumentQualityPuncturedDocument',
        message: 'Your document appears to be damaged or cropped.',
    },
    ImageIntegrityConclusiveDocumentQualityWatermarksDigitalTextOverlay: {
        code: 'ImageIntegrityConclusiveDocumentQualityWatermarksDigitalTextOverlay',
        message: 'Your document contains markings or text that should not be on your document.',
    },
    ImageIntegrityImageQuality: {
        code: 'ImageIntegrityImageQuality',
        message:
            'The image quality of your document is too low. Please provide a hi-res photo of your identity document.',
    },
    ImageIntegrityImageQualityBlurredPhoto: {
        code: 'ImageIntegrityImageQualityBlurredPhoto',
        message:
            "We were unable to verify your selfie because it’s not clear. Please take a clearer photo and try again. Ensure that there's enough light where you are and that your entire face is in the frame.",
    },
    ImageIntegrityImageQualityCoveredPhoto: {
        code: 'ImageIntegrityImageQualityCoveredPhoto',
        message:
            'We’re unable to verify the document you provided because some details appear to be missing. Please try again or provide another document.',
    },
    ImageIntegrityImageQualityCutOffDocument: {
        code: 'ImageIntegrityImageQualityCutOffDocument',
        message:
            'We’re unable to verify the document you provided because it appears to be damaged. Please try again or upload another document.',
    },
    ImageIntegrityImageQualityDamagedDocument: {
        code: 'ImageIntegrityImageQualityDamagedDocument',
        message:
            'We’re unable to verify the document you provided because it appears to be damaged. Please try again or upload another document.',
    },
    ImageIntegrityImageQualityDarkPhoto: {
        code: 'ImageIntegrityImageQualityDarkPhoto',
        message:
            'We were unable to verify your selfie because it’s not clear. Please take a clearer photo and try again. Ensure that there’s enough light where you are and that your entire face is in the frame.',
    },
    ImageIntegrityImageQualityGlareOnPhoto: {
        code: 'ImageIntegrityImageQualityGlareOnPhoto',
        message:
            'We were unable to verify your selfie because it’s not clear. Please take a clearer photo and try again. Ensure that there’s enough light where you are and that your entire face is in the frame.',
    },
    ImageIntegrityImageQualityIncorrectSide: {
        code: 'ImageIntegrityImageQualityIncorrectSide',
        message:
            'The front of your document appears to be missing. Please provide both sides of your identity document.',
    },
    ImageIntegrityImageQualityNoDocumentInImage: {
        code: 'ImageIntegrityImageQualityNoDocumentInImage',
        message:
            'We’re unable to verify the document you provided because it appears to be a blank image. Please try again or upload another document.',
    },
    ImageIntegrityImageQualityOtherPhotoIssue: {
        code: 'ImageIntegrityImageQualityOtherPhotoIssue',
        message:
            'We’re unable to verify the document you provided because some details appear to be missing. Please try again or provide another document.',
    },
    ImageIntegrityImageQualityTwoDocumentsUploaded: {
        code: 'ImageIntegrityImageQualityTwoDocumentsUploaded',
        message:
            'The document you provided appears to be two different types. Please try again or provide another document.',
    },
    ImageIntegritySupportedDocument: {
        code: 'ImageIntegritySupportedDocument',
        message:
            'The document you provided is not supported for your country. Please provide a supported document for your country.',
    },
    SelfieRejected: {
        code: 'SelfieRejected',
        message:
            'We’re unable to verify the selfie you provided as it does not match the required criteria. Please provide a photo that closely resembles the document photo provided.',
    },
    VisualAuthenticityDigitalTampering: {
        code: 'VisualAuthenticityDigitalTampering',
        message: 'Your document appears to be invalid.',
    },
    VisualAuthenticityFaceDetection: {
        code: 'VisualAuthenticityFaceDetection',
        message: 'Your document appears to be invalid.',
    },
    VisualAuthenticityFonts: {
        code: 'VisualAuthenticityFonts',
        message: 'Your document appears to be invalid.',
    },
    VisualAuthenticityOriginalDocumentPresent: {
        code: 'VisualAuthenticityOriginalDocumentPresent',
        message:
            'Your document appears to be a scanned copy that contains markings or text that shouldn’t be on your document.',
    },
    VisualAuthenticityOriginalDocumentPresentDocumentOnPrintedPaper: {
        code: 'VisualAuthenticityOriginalDocumentPresentDocumentOnPrintedPaper',
        message: 'Your document appears to be a printed copy.',
    },
    VisualAuthenticityOriginalDocumentPresentPhotoOfScreen: {
        code: 'VisualAuthenticityOriginalDocumentPresentPhotoOfScreen',
        message: 'Your document appears to be a photo of a device screen.',
    },
    VisualAuthenticityOriginalDocumentPresentScan: {
        code: 'VisualAuthenticityOriginalDocumentPresentScan',
        message:
            'We’re unable to verify the document you provided because it contains markings or text that should not be on your document. Please provide a clear photo or a scan of your original identity document.',
    },
    VisualAuthenticityOriginalDocumentPresentScreenshot: {
        code: 'VisualAuthenticityOriginalDocumentPresentScreenshot',
        message: 'Your document appears to be a screenshot.',
    },
    VisualAuthenticityPictureFaceIntegrity: {
        code: 'VisualAuthenticityPictureFaceIntegrity',
        message: 'Your document appears to be invalid.',
    },
    VisualAuthenticitySecurityFeatures: {
        code: 'VisualAuthenticitySecurityFeatures',
        message: 'Your document appears to be invalid.',
    },
    VisualAuthenticityTemplate: {
        code: 'VisualAuthenticityTemplate',
        message: 'Your document appears to be invalid.',
    },
});
