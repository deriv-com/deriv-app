import React from 'react';
import { Localize } from '@deriv/translations';

type TIDVErrorStatus = Readonly<{
    [key: string]: {
        code: keyof typeof IDV_ERROR_STATUS;
        message: React.ReactNode;
    };
}>;

type TOnfidoErrorStatus = Readonly<{
    [key: string]: {
        code: keyof typeof ONFIDO_ERROR_STATUS;
        message: React.ReactNode;
    };
}>;

export const IDV_ERROR_STATUS: TIDVErrorStatus = Object.freeze({
    DobMismatch: {
        code: 'DobMismatch',
        message: (
            <Localize
                i18n_default_text="The <0>date of birth</0> on your identity document doesn't match your profile."
                components={[<strong key={0} />]}
            />
        ),
    },
    DocumentRejected: {
        code: 'DocumentRejected',
        message: (
            <Localize i18n_default_text='We were unable to verify the identity document with the details provided.' />
        ),
    },
    EmptyStatus: {
        code: 'EmptyStatus',
        message: <Localize i18n_default_text='The verification status was empty, rejected for lack of information.' />,
    },
    Expired: { code: 'Expired', message: <Localize i18n_default_text='Your identity document has expired.' /> },
    InformationLack: {
        code: 'InformationLack',
        message: (
            <Localize i18n_default_text='The verification is passed but the personal info is not available to compare.' />
        ),
    },
    MalformedJson: {
        code: 'MalformedJson',
        message: (
            <Localize i18n_default_text='The verification status is not available, provider says: Malformed JSON.' />
        ),
    },
    NameMismatch: {
        code: 'NameMismatch',
        message: (
            <Localize
                i18n_default_text="The <0>name</0> on your identity document doesn't match your profile."
                components={[<strong key={0} />]}
            />
        ),
    },
    RejectedByProvider: {
        code: 'RejectedByProvider',
        message: <Localize i18n_default_text='The document was rejected by the Provider.' />,
    },
    Underage: {
        code: 'Underage',
        message: <Localize i18n_default_text='You’re under legal age.' />,
    },
    Deceased: {
        code: 'Deceased',
        message: <Localize i18n_default_text='The document’s owner is deceased.' />,
    },
    Failed: {
        code: 'Failed',
        message: (
            <Localize i18n_default_text='We were unable to verify the identity document with the details provided.' />
        ),
    },
    NameDobMismatch: {
        code: 'NameDobMismatch',
        message: (
            <Localize
                i18n_default_text="The <0>name</0> and <0>date of birth</0> on your identity document don't match your profile."
                components={[<strong key={0} />]}
            />
        ),
    },
    NeedsTechnicalInvestigation: {
        code: 'NeedsTechnicalInvestigation',
        message: (
            <Localize i18n_default_text='The verification status is not available, provider says: Needs Technical Investigation.' />
        ),
    },
    HighRisk: {
        code: 'HighRisk',
        message: (
            <Localize i18n_default_text='For enhanced security, we need to reverify your identity. Kindly resubmit your proof of identity to unlock your account.' />
        ),
    },
    ReportNotAvailable: {
        code: 'ReportNotAvailable',
        message: (
            <Localize i18n_default_text='We were unable to verify the identity document with the details provided.' />
        ),
    },
});

export const ONFIDO_ERROR_STATUS: TOnfidoErrorStatus = Object.freeze({
    AgeValidationMinimumAcceptedAge: {
        code: 'AgeValidationMinimumAcceptedAge',
        message: (
            <Localize i18n_default_text='Your age in the document you provided appears to be below 18 years. We’re only allowed to offer our services to clients above 18 years old, so we’ll need to close your account. If you have a balance in your account, contact us via live chat and we’ll help to withdraw your funds before your account is closed.' />
        ),
    },
    CompromisedDocument: {
        code: 'CompromisedDocument',
        message: <Localize i18n_default_text='Your document failed our verification checks.' />,
    },
    DataComparisonDateOfBirth: {
        code: 'DataComparisonDateOfBirth',
        message: <Localize i18n_default_text='The date of birth on your document doesn’t match your profile.' />,
    },
    DataComparisonDateOfExpiry: {
        code: 'DataComparisonDateOfExpiry',
        message: <Localize i18n_default_text='Your document has expired.' />,
    },
    DataComparisonDocumentNumbers: {
        code: 'DataComparisonDocumentNumbers',
        message: <Localize i18n_default_text='Your document appears to be invalid.' />,
    },
    DataComparisonDocumentType: {
        code: 'DataComparisonDocumentType',
        message: <Localize i18n_default_text='Your document appears to be invalid.' />,
    },
    DataComparisonIssuingCountry: {
        code: 'DataComparisonIssuingCountry',
        message: <Localize i18n_default_text='Your document appears to be invalid.' />,
    },
    DataComparisonName: {
        code: 'DataComparisonName',
        message: <Localize i18n_default_text='The name on your document doesn’t match your profile.' />,
    },
    DataValidationDateOfBirth: {
        code: 'DataValidationDateOfBirth',
        message: (
            <Localize i18n_default_text='Some details on your document appear to be invalid, missing, or unclear.' />
        ),
    },
    DataValidationDocumentExpiration: {
        code: 'DataValidationDocumentExpiration',
        message: <Localize i18n_default_text='Your document has expired.' />,
    },
    DataValidationDocumentNumbers: {
        code: 'DataValidationDocumentNumbers',
        message: (
            <Localize i18n_default_text='Some details in your document appear to be invalid, missing, or unclear.' />
        ),
    },
    DataValidationExpiryDate: {
        code: 'DataValidationExpiryDate',
        message: (
            <Localize i18n_default_text='Some details on your document appear to be invalid, missing, or unclear.' />
        ),
    },
    DataValidationMrz: {
        code: 'DataValidationMrz',
        message: (
            <Localize i18n_default_text='Some details on your document appear to be invalid, missing, or unclear.' />
        ),
    },
    DataValidationNoDocumentNumbers: {
        code: 'DataValidationNoDocumentNumbers',
        message: <Localize i18n_default_text='The serial number of your document couldn’t be verified.' />,
    },
    DuplicatedDocument: {
        code: 'DuplicatedDocument',
        message: <Localize i18n_default_text='Your verification documents were already used for another account.' />,
    },
    Expired: { code: 'Expired', message: <Localize i18n_default_text='Your document has expired.' /> },
    ImageIntegrityColourPicture: {
        code: 'ImageIntegrityColourPicture',
        message: (
            <Localize i18n_default_text='Your document appears to be in black and white. Please upload a colour photo of your document.' />
        ),
    },
    ImageIntegrityConclusiveDocumentQuality: {
        code: 'ImageIntegrityConclusiveDocumentQuality',
        message: <Localize i18n_default_text='Your document appears to be invalid.' />,
    },
    ImageIntegrityConclusiveDocumentQualityAbnormalDocumentFeatures: {
        code: 'ImageIntegrityConclusiveDocumentQualityAbnormalDocumentFeatures',
        message: (
            <Localize i18n_default_text='Some details on your document appear to be invalid, missing, or unclear.' />
        ),
    },
    ImageIntegrityConclusiveDocumentQualityCornerRemoved: {
        code: 'ImageIntegrityConclusiveDocumentQualityCornerRemoved',
        message: <Localize i18n_default_text='Your document appears to be damaged or cropped.' />,
    },
    ImageIntegrityConclusiveDocumentQualityDigitalDocument: {
        code: 'ImageIntegrityConclusiveDocumentQualityDigitalDocument',
        message: <Localize i18n_default_text='Your document appears to be a digital document.' />,
    },
    ImageIntegrityConclusiveDocumentQualityMissingBack: {
        code: 'ImageIntegrityConclusiveDocumentQualityMissingBack',
        message: (
            <Localize i18n_default_text='The back of your document appears to be missing. Please include both sides of your identity document.' />
        ),
    },
    ImageIntegrityConclusiveDocumentQualityObscuredDataPoints: {
        code: 'ImageIntegrityConclusiveDocumentQualityObscuredDataPoints',
        message: (
            <Localize i18n_default_text='Some details on your document appear to be invalid, missing, or unclear.' />
        ),
    },
    ImageIntegrityConclusiveDocumentQualityObscuredSecurityFeatures: {
        code: 'ImageIntegrityConclusiveDocumentQualityObscuredSecurityFeatures',
        message: (
            <Localize i18n_default_text='Some details on your document appear to be invalid, missing, or unclear.' />
        ),
    },
    ImageIntegrityConclusiveDocumentQualityPuncturedDocument: {
        code: 'ImageIntegrityConclusiveDocumentQualityPuncturedDocument',
        message: <Localize i18n_default_text='Your document appears to be damaged or cropped.' />,
    },
    ImageIntegrityConclusiveDocumentQualityWatermarksDigitalTextOverlay: {
        code: 'ImageIntegrityConclusiveDocumentQualityWatermarksDigitalTextOverlay',
        message: (
            <Localize i18n_default_text='Your document contains markings or text that should not be on your document.' />
        ),
    },
    ImageIntegrityImageQuality: {
        code: 'ImageIntegrityImageQuality',
        message: (
            <Localize i18n_default_text='The image quality of your document is too low. Please provide a hi-res photo of your identity document.' />
        ),
    },
    ImageIntegrityImageQualityBlurredPhoto: {
        code: 'ImageIntegrityImageQualityBlurredPhoto',
        message: (
            <Localize i18n_default_text="We were unable to verify your selfie because it’s not clear. Please take a clearer photo and try again. Ensure that there's enough light where you are and that your entire face is in the frame." />
        ),
    },
    ImageIntegrityImageQualityCoveredPhoto: {
        code: 'ImageIntegrityImageQualityCoveredPhoto',
        message: (
            <Localize i18n_default_text='We’re unable to verify the document you provided because some details appear to be missing. Please try again or provide another document.' />
        ),
    },
    ImageIntegrityImageQualityCutOffDocument: {
        code: 'ImageIntegrityImageQualityCutOffDocument',
        message: (
            <Localize i18n_default_text='We’re unable to verify the document you provided because it appears to be damaged. Please try again or upload another document.' />
        ),
    },
    ImageIntegrityImageQualityDamagedDocument: {
        code: 'ImageIntegrityImageQualityDamagedDocument',
        message: (
            <Localize i18n_default_text='We’re unable to verify the document you provided because it appears to be damaged. Please try again or upload another document.' />
        ),
    },
    ImageIntegrityImageQualityDarkPhoto: {
        code: 'ImageIntegrityImageQualityDarkPhoto',
        message: (
            <Localize i18n_default_text='We were unable to verify your selfie because it’s not clear. Please take a clearer photo and try again. Ensure that there’s enough light where you are and that your entire face is in the frame.' />
        ),
    },
    ImageIntegrityImageQualityGlareOnPhoto: {
        code: 'ImageIntegrityImageQualityGlareOnPhoto',
        message: (
            <Localize i18n_default_text='We were unable to verify your selfie because it’s not clear. Please take a clearer photo and try again. Ensure that there’s enough light where you are and that your entire face is in the frame.' />
        ),
    },
    ImageIntegrityImageQualityIncorrectSide: {
        code: 'ImageIntegrityImageQualityIncorrectSide',
        message: (
            <Localize i18n_default_text='The front of your document appears to be missing. Please provide both sides of your identity document.' />
        ),
    },
    ImageIntegrityImageQualityNoDocumentInImage: {
        code: 'ImageIntegrityImageQualityNoDocumentInImage',
        message: (
            <Localize i18n_default_text='We’re unable to verify the document you provided because it appears to be a blank image. Please try again or upload another document.' />
        ),
    },
    ImageIntegrityImageQualityOtherPhotoIssue: {
        code: 'ImageIntegrityImageQualityOtherPhotoIssue',
        message: (
            <Localize i18n_default_text='We’re unable to verify the document you provided because some details appear to be missing. Please try again or provide another document.' />
        ),
    },
    ImageIntegrityImageQualityTwoDocumentsUploaded: {
        code: 'ImageIntegrityImageQualityTwoDocumentsUploaded',
        message: (
            <Localize i18n_default_text='The document you provided appears to be two different types. Please try again or provide another document.' />
        ),
    },
    ImageIntegritySupportedDocument: {
        code: 'ImageIntegritySupportedDocument',
        message: (
            <Localize i18n_default_text='The document you provided is not supported for your country. Please provide a supported document for your country.' />
        ),
    },
    SelfieRejected: {
        code: 'SelfieRejected',
        message: <Localize i18n_default_text='Your selfie does not match your document.' />,
    },
    VisualAuthenticityDigitalTampering: {
        code: 'VisualAuthenticityDigitalTampering',
        message: <Localize i18n_default_text='Your document appears to be invalid.' />,
    },
    VisualAuthenticityFaceDetection: {
        code: 'VisualAuthenticityFaceDetection',
        message: <Localize i18n_default_text='Your document appears to be invalid.' />,
    },
    VisualAuthenticityFonts: {
        code: 'VisualAuthenticityFonts',
        message: <Localize i18n_default_text='Your document appears to be invalid.' />,
    },
    VisualAuthenticityOriginalDocumentPresent: {
        code: 'VisualAuthenticityOriginalDocumentPresent',
        message: (
            <Localize i18n_default_text='Your document appears to be a scanned copy that contains markings or text that shouldn’t be on your document.' />
        ),
    },
    VisualAuthenticityOriginalDocumentPresentDocumentOnPrintedPaper: {
        code: 'VisualAuthenticityOriginalDocumentPresentDocumentOnPrintedPaper',
        message: <Localize i18n_default_text='Your document appears to be a printed copy.' />,
    },
    VisualAuthenticityOriginalDocumentPresentPhotoOfScreen: {
        code: 'VisualAuthenticityOriginalDocumentPresentPhotoOfScreen',
        message: <Localize i18n_default_text='Your document appears to be a photo of a device screen.' />,
    },
    VisualAuthenticityOriginalDocumentPresentScan: {
        code: 'VisualAuthenticityOriginalDocumentPresentScan',
        message: (
            <Localize i18n_default_text='We’re unable to verify the document you provided because it contains markings or text that should not be on your document. Please provide a clear photo or a scan of your original identity document.' />
        ),
    },
    VisualAuthenticityOriginalDocumentPresentScreenshot: {
        code: 'VisualAuthenticityOriginalDocumentPresentScreenshot',
        message: <Localize i18n_default_text='Your document appears to be a screenshot.' />,
    },
    VisualAuthenticityPictureFaceIntegrity: {
        code: 'VisualAuthenticityPictureFaceIntegrity',
        message: <Localize i18n_default_text='Your document appears to be invalid.' />,
    },
    VisualAuthenticitySecurityFeatures: {
        code: 'VisualAuthenticitySecurityFeatures',
        message: <Localize i18n_default_text='Your document appears to be invalid.' />,
    },
    VisualAuthenticityTemplate: {
        code: 'VisualAuthenticityTemplate',
        message: <Localize i18n_default_text='Your document appears to be invalid.' />,
    },
});
