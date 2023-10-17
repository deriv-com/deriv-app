import { TJurisdictionVerificationItems, TJurisdictionVerificationStatus } from './props.types';

type TJurisdictionVerificationContents = {
    requiredVerificationDocs: TJurisdictionVerificationItems;
    shortDescription: string;
    statusReferences: TJurisdictionVerificationStatus[];
};
export const jurisdictionVerificationContents = (): TJurisdictionVerificationContents => ({
    requiredVerificationDocs: {
        documentNumber: {
            icon: 'IcDocumentNumberVerification',
            text: 'Document number (identity card, passport)',
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
        selfie: {
            icon: 'IcSelfieVerification',
            text: 'A selfie of yourself.',
        },
    },
    shortDescription: 'We need you to submit these in order to get this account:',
    statusReferences: [
        {
            color: 'yellow',
            icon: 'verificationPendingStatusIcon',
            text: 'Your document is pending for verification.',
        },
        {
            color: 'red',
            icon: 'verificationFailedStatusIcon',
            text: 'Verification failed. Resubmit during account creation.',
        },
        {
            color: 'green',
            icon: 'verificationSuccessStatusIcon',
            text: 'Your document is verified.',
        },
    ],
});
