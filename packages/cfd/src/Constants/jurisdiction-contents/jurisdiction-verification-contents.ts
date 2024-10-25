import { localize } from '@deriv/translations';
import { TJurisdictionVerificationItems, TJurisdictionVerificationStatus } from 'Components/props.types';

type TJurisdictionVerificationContents = {
    short_description: string;
    required_verification_docs: TJurisdictionVerificationItems;
    status_references: Array<TJurisdictionVerificationStatus>;
};

export const jurisdictionVerificationContents = (): TJurisdictionVerificationContents => ({
    short_description: localize('We need you to submit these in order to get this account:'),
    required_verification_docs: {
        document_number: {
            icon: 'IcDocumentNumberVerification',
            text: localize("Document number (e.g. identity card, passport, driver's license)"),
        },
        selfie: {
            icon: 'IcSelfieVerification',
            text: localize('A selfie of yourself.'),
        },
        identity_document: {
            icon: 'IcIdentityDocumentVerification',
            text: localize("A copy of your identity document (e.g. identity card, passport, driver's license)"),
        },
        name_and_address: {
            icon: 'IcNameAndAddressVerification',
            text: localize(
                'A recent utility bill (e.g. electricity, water or gas) or recent bank statement or government-issued letter with your name and address.'
            ),
        },
    },
    status_references: [
        {
            icon: 'IcVerificationStatusYellow',
            text: localize('Verification in review.'),
            color: 'yellow',
        },
        {
            icon: 'IcVerificationStatusRed',
            text: localize('Verification failed. Resubmit your details.'),
            color: 'red',
        },
        { icon: 'IcVerificationStatusGreen', text: localize('Verification successful.'), color: 'green' },
    ],
});
