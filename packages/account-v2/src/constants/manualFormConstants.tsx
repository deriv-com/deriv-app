import React from 'react';
import IdentityCardBack from '../assets/manual-upload/document-back.svg';
import DrivingLicenseCardFront from '../assets/manual-upload/driving-license-front.svg';
import IdentityCardFront from '../assets/manual-upload/identity-card-front.svg';
import NIMCSlipFront from '../assets/manual-upload/nimc-slip-front.svg';
import PassportPlaceholder from '../assets/manual-upload/passport-placeholder.svg';
import ProofOfAgeIcon from '../assets/manual-upload/proof-of-age.svg';

export type TManualDocumentTypes = typeof manualDocumentTypes[keyof typeof manualDocumentTypes];

export const manualDocumentTypes = Object.freeze({
    drivingLicense: 'drivingLicense',
    nationalIdentityCard: 'nationalIdentityCard',
    nimcSlip: 'nimcSlip',
    passport: 'passport',
});

export const manualDocumentSelfie = 'selfieWithId';

const manualFormPageTypes = Object.freeze({
    back: 'back',
    front: 'front',
    photo: 'photo',
});

const documentExpiry = {
    errorMessage: 'Expiry date is required.',
    label: 'Expiry date',
};

export const manualDocumentTypesData = Object.freeze({
    [manualDocumentTypes.drivingLicense]: {
        fields: {
            documentExpiry,
            documentNumber: {
                errorMessage: 'Driving licence number is required.',
                label: 'Driving licence number',
            },
        },
        inputSectionHeader: 'First, enter your Driving licence number and the expiry date.',
        uploads: [
            {
                error: 'Front side of driving licence is required.',
                icon: <DrivingLicenseCardFront />,
                pageType: manualFormPageTypes.front,
                text: 'Upload the front of your driving licence.',
            },
            {
                error: 'Back side of driving licence is required.',
                icon: <IdentityCardBack />,
                pageType: manualFormPageTypes.back,
                text: 'Upload the back of your driving licence.',
            },
        ],
        uploadSectionHeader: 'Next, upload the front and back of your driving licence.',
    },
    [manualDocumentTypes.nationalIdentityCard]: {
        fields: {
            documentExpiry,
            documentNumber: {
                errorMessage: 'Identity card number is required.',
                label: 'Identity card number',
            },
        },
        inputSectionHeader: 'First, enter your Identity card number and the expiry date.',
        uploads: [
            {
                error: 'Front side of identity card is required.',
                icon: <IdentityCardFront />,
                pageType: manualFormPageTypes.front,
                text: 'Upload the front of your identity card.',
            },
            {
                error: 'Back side of identity card is required.',
                icon: <IdentityCardBack />,
                pageType: manualFormPageTypes.back,
                text: 'Upload the back of your identity card.',
            },
        ],
        uploadSectionHeader: 'Next, upload the front and back of your identity card.',
    },
    [manualDocumentTypes.nimcSlip]: {
        fields: {
            documentExpiry,
            documentNumber: {
                errorMessage: 'NIMC slip number is required.',
                label: 'NIMC slip number',
            },
        },
        inputSectionHeader: 'First, enter your NIMC slip number.',
        uploads: [
            {
                error: 'Front side of NIMC slip is required.',
                icon: <NIMCSlipFront />,
                pageType: manualFormPageTypes.front,
                text: 'Upload your NIMC slip.',
            },
            {
                error: 'Back side of NIMC slip is required.',
                icon: <ProofOfAgeIcon />,
                pageType: manualFormPageTypes.photo,
                text: 'Upload your proof of age: birth certificate or age declaration document.',
            },
        ],
        uploadSectionHeader: 'Next, upload the page of your NIMC slip that contains your photo.',
    },
    [manualDocumentTypes.passport]: {
        fields: {
            documentExpiry,
            documentNumber: {
                errorMessage: 'Passport number is required.',
                label: 'Passport number',
            },
        },
        inputSectionHeader: 'First, enter your Passport number and the expiry date.',
        uploads: [
            {
                error: 'Front side of passport is required.',
                icon: <PassportPlaceholder />,
                pageType: manualFormPageTypes.front,
                text: 'Upload the page of your passport that contains your photo.',
            },
        ],
        uploadSectionHeader: 'Next, upload the page of your passport that contains your photo.',
    },
});
