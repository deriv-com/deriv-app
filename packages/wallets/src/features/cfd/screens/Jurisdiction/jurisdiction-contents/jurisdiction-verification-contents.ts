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
            text: `Document number (eg. identity card, passport, driver's license)`,
        },
        identityNumber: {
            icon: 'IcIdentityDocumentVerification',
            text: `A copy of your identity document (eg. identity card, passport, deiver's license)`,
        },
        nameAndAddress: {
            icon: 'IcNameAndAddressVerification',
            text: 'A recent utility bill (eg. electricity, water or gas) or recent bank statement or government-issued letter with your name and address.',
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
            text: 'Verification in review.',
        },
        {
            color: 'red',
            icon: 'verificationFailedStatusIcon',
            text: 'Verification failed. Resubmit your details.',
        },
        {
            color: 'green',
            icon: 'verificationSuccessStatusIcon',
            text: 'Verification successful.',
        },
    ],
});
