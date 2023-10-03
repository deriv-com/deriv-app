import { TJurisdictionVerificationItems, TJurisdictionVerificationStatus } from './props.types';

type TJurisdictionVerificationContents = {
    short_description: string;
    required_verification_docs: TJurisdictionVerificationItems;
    status_references: Array<TJurisdictionVerificationStatus>;
};
export const jurisdictionVerificationContents = (): TJurisdictionVerificationContents => ({
    short_description: 'We need you to submit these in order to get this account:',
    required_verification_docs: {
        document_number: {
            icon: 'IcDocumentNumberVerification',
            text: 'Document number (identity card, passport)',
        },
        selfie: {
            icon: 'IcSelfieVerification',
            text: 'A selfie of yourself.',
        },
        identity_document: {
            icon: 'IcIdentityDocumentVerification',
            text: 'A copy of your identity document (identity card, passport)',
        },
        name_and_address: {
            icon: 'IcNameAndAddressVerification',
            text: 'A recent utility bill (electricity, water or gas) or recent bank statement or government-issued letter with your name and address.',
        },
        not_applicable: {
            icon: 'IcNotApplicableVerification',
            text: '',
        },
    },
    status_references: [
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
