import { localize } from '@deriv/translations';
import {
    TJurisdictionCardBackSectionRequiredDocs,
    TJurisdictionCardBackSectionStatusReferences,
} from 'Components/props.types';

type TJurisdictionCardBackSectionContent = {
    shortDescription: string;
    requiredVerificationDocs: TJurisdictionCardBackSectionRequiredDocs;
    statusReferences: Array<TJurisdictionCardBackSectionStatusReferences>;
};

export const jurisdiction_verification_contents: TJurisdictionCardBackSectionContent = {
    shortDescription: `${localize('We need you to submit these in order to get this account:')}`,
    requiredVerificationDocs: {
        documentNumber: {
            icon: 'IcDocumentNumberVerification',
            text: `${localize('Document number (identity card, passport)')}`,
        },
        selfie: {
            icon: 'IcSelfieVerification',
            text: `${localize('A selfie of yourself.')}`,
        },
        identityDocument: {
            icon: 'IcIdentityDocumentVerification',
            text: `${localize('A copy of your identity document (identity card, passport)')}`,
        },
        nameAndAddress: {
            icon: 'IcNameAndAddressVerification',
            text: `${localize(
                'A recent utility bill (electricity, water or gas) or recent bank statement or government-issued letter with your name and address.'
            )}`,
        },
    },
    statusReferences: [
        {
            icon: 'IcVerificationStatusYellow',
            text: `${localize('Your document is pending for verification.')}`,
            color: 'yellow',
        },
        {
            icon: 'IcVerificationStatusRed',
            text: `${localize('Verification failed. Resubmit during account creation.')}`,
            color: 'red',
        },
        { icon: 'IcVerificationStatusGreen', text: `${localize('Your document is verified.')}`, color: 'green' },
    ],
};
