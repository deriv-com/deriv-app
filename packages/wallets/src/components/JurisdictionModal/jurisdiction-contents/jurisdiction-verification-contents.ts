import { TJurisdictionVerificationItems, TJurisdictionVerificationStatus } from './props.types';

type TJurisdictionVerificationContents = {
    requiredVerificationDocs: TJurisdictionVerificationItems;
    shortDescription: string;
    statusReferences: TJurisdictionVerificationStatus[];
};
export const jurisdictionVerificationContents = (): TJurisdictionVerificationContents => ({
    shortDescription: 'We need you to submit these in order to get this account:',
    requiredVerificationDocs: {
        documentNumber: {
            icon: 'IcDocumentNumberVerification',
            text: 'Document number (identity card, passport)',
        },
        selfie: {
            icon: 'IcSelfieVerification',
            text: 'A selfie of yourself.',
        },
        identityNumber: {
            icon: 'IcIdentityDocumentVerification',
            text: 'A copy of your identity document (identity card, passport)',
        },
        nameAndAddress: {
            icon: 'IcNameAndAddressVerification',
            text: 'A recent utility bill (electricity, water or gas) or recent bank statement or government-issued letter with your name and address.',
        },
        notApplicable: {
            icon: 'IcNotApplicableVerification',
            text: '',
        },
    },
    statusReferences: [
        {
            icon: 'IcVerificationStatusYellow',
            text: 'Your document is pending for verification.',
            color: 'yellow',
        },
        {
            icon: 'IcVerificationStatusRed',
            text: 'Verification failed. Resubmit during account creation.',
            color: 'red',
        },
        {
            icon: 'IcVerificationStatusGreen',
            text: 'Your document is verified.',
            color: 'green',
        },
    ],
});
