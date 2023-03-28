import { localize } from '@deriv/translations';
import {
    TJurisdictionCardBackSectionRequiredDocs,
    TJurisdictionCardBackSectionStatusReferences,
    TJurisdictionCardSection,
} from 'Components/props.types';

export type TJurisdictionCardBackSectionContent = {
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

type TJurisdictionCardItems = {
    header: string;
    over_header?: string;
    synthetic_contents: Array<TJurisdictionCardSection>;
    financial_contents: Array<TJurisdictionCardSection>;
    is_over_header_available: boolean;
    synthetic_verification_docs?: Array<'documentNumber' | 'selfie' | 'identityDocument' | 'nameAndAddress'>;
    financial_verification_docs?: Array<'documentNumber' | 'selfie' | 'identityDocument' | 'nameAndAddress'>;
};

type TJurisdictionContent = {
    svg: TJurisdictionCardItems;
    vanuatu: TJurisdictionCardItems;
    labuan: TJurisdictionCardItems;
    maltainvest: TJurisdictionCardItems;
    bvi: TJurisdictionCardItems;
};

export const jurisdiction_contents: TJurisdictionContent = {
    svg: {
        is_over_header_available: false,
        header: localize('St. Vincent & Grenadines'),
        synthetic_contents: [
            {
                key: 'assets',
                title: `${localize('Assets')}`,
                description: `${localize('Synthetics, Basket indices and Derived FX')}`,
                titleIndicators: {
                    type: 'displayText',
                    displayText: `${localize('40+')}`,
                    displayTextSkinColor: 'red-darker',
                },
            },
            {
                key: 'leverage',
                title: `${localize('Leverage')}`,
                titleIndicators: {
                    type: 'displayText',
                    displayText: `${localize('1:1000')}`,
                    displayTextSkinColor: 'yellow-light',
                },
            },
            {
                key: 'verifications',
                title: `${localize('Verifications')}`,
                description: `${localize(
                    'You will need to submit proof of identity and address once you reach certain thresholds.'
                )}`,
            },
            {
                key: 'regulatorEdr',
                title: `${localize('Regulator/EDR')}`,
                description: `${localize('Deriv (SVG) LLC (company no. 273 LLC 2020)')}`,
            },
        ],
        financial_contents: [
            {
                key: 'assets',
                title: `${localize('Assets')}`,
                description: `${localize('Forex, Stocks, Stock indices, Commodities, and Cryptocurrencies')}`,
                titleIndicators: {
                    type: 'displayText',
                    displayText: `${localize('170+')}`,
                    displayTextSkinColor: 'red-light',
                },
            },
            {
                key: 'leverage',
                title: `${localize('Leverage')}`,
                titleIndicators: {
                    type: 'displayText',
                    displayText: `${localize('1:1000')}`,
                    displayTextSkinColor: 'yellow-light',
                },
            },
            {
                key: 'spreadsFrom',
                title: `${localize('Spreads from')}`,
                titleIndicators: {
                    type: 'displayText',
                    displayText: `${localize('0.6 pips')}`,
                    displayTextSkinColor: 'violet-dark',
                },
            },
            {
                key: 'verifications',
                title: `${localize('Verifications')}`,
                description: `${localize(
                    'You will need to submit proof of identity and address once you reach certain thresholds.'
                )}`,
            },
            {
                key: 'regulatorEdr',
                title: `${localize('Regulator/EDR')}`,
                description: `${localize('Deriv (SVG) LLC (company no. 273 LLC 2020)')}`,
            },
        ],
    },
    bvi: {
        is_over_header_available: false,
        header: localize('British Virgin Islands'),
        synthetic_contents: [
            {
                key: 'assets',
                title: `${localize('Assets')}`,
                description: `${localize('Synthetics, Basket indices and Derived FX')}`,
                titleIndicators: {
                    type: 'displayText',
                    displayText: `${localize('40+')}`,
                    displayTextSkinColor: 'red-darker',
                },
            },
            {
                key: 'leverage',
                title: `${localize('Leverage')}`,
                titleIndicators: {
                    type: 'displayText',
                    displayText: `${localize('1:1000')}`,
                    displayTextSkinColor: 'yellow-light',
                },
            },
            {
                key: 'verifications',
                title: `${localize('Verifications')}`,
                clickableDescription: [
                    { type: 'link', text: `${localize('Learn more')}` },
                    { type: 'text', text: `${localize('about verifications needed.')}` },
                ],
            },
            {
                key: 'regulatorEdr',
                title: `${localize('Regulator/EDR')}`,
                description: `${localize(
                    'British Virgin Islands Financial Services Commission (License no. SIBA/L/18/1114)'
                )}`,
            },
        ],
        financial_contents: [
            {
                key: 'assets',
                title: `${localize('Assets')}`,
                description: `${localize('Forex, Stocks, Stock indices, Commodities, and Cryptocurrencies')}`,
                titleIndicators: {
                    type: 'displayText',
                    displayText: `${localize('170+')}`,
                    displayTextSkinColor: 'red-light',
                },
            },
            {
                key: 'leverage',
                title: `${localize('Leverage')}`,
                titleIndicators: {
                    type: 'displayText',
                    displayText: `${localize('1:1000')}`,
                    displayTextSkinColor: 'yellow-light',
                },
            },
            {
                key: 'spreadsFrom',
                title: `${localize('Spreads from')}`,
                titleIndicators: {
                    type: 'displayText',
                    displayText: `${localize('0.5 pips')}`,
                    displayTextSkinColor: 'violet-dark',
                },
            },
            {
                key: 'verifications',
                title: `${localize('Verifications')}`,
                clickableDescription: [
                    { type: 'link', text: `${localize('Learn more')}` },
                    { type: 'text', text: `${localize('about verifications needed.')}` },
                ],
            },
            {
                key: 'regulatorEdr',
                title: `${localize('Regulator/EDR')}`,
                description: `${localize(
                    'British Virgin Islands Financial Services Commission (License no. SIBA/L/18/1114)'
                )}`,
            },
        ],
        synthetic_verification_docs: ['documentNumber', 'nameAndAddress'],
        financial_verification_docs: ['documentNumber', 'nameAndAddress'],
    },
    vanuatu: {
        is_over_header_available: false,
        header: localize('Vanuatu'),
        synthetic_contents: [
            {
                key: 'assets',
                title: `${localize('Assets')}`,
                description: `${localize('Synthetics, Basket indices and Derived FX')}`,
                titleIndicators: {
                    type: 'displayText',
                    displayText: `${localize('40+')}`,
                    displayTextSkinColor: 'red-darker',
                },
            },
            {
                key: 'leverage',
                title: `${localize('Leverage')}`,
                titleIndicators: {
                    type: 'displayText',
                    displayText: `${localize('1:1000')}`,
                    displayTextSkinColor: 'yellow-light',
                },
            },
            {
                key: 'verifications',
                title: `${localize('Verifications')}`,
                clickableDescription: [
                    { type: 'link', text: `${localize('Learn more')}` },
                    { type: 'text', text: `${localize('about verifications needed.')}` },
                ],
            },
            {
                key: 'regulatorEdr',
                title: `${localize('Regulator/EDR')}`,
                description: `${localize('Vanuatu Financial Services Commission')}`,
            },
        ],
        financial_contents: [
            {
                key: 'assets',
                title: `${localize('Assets')}`,
                description: `${localize('Forex, Stock indices, Commodities and Cryptocurrencies')}`,
                titleIndicators: {
                    type: 'displayText',
                    displayText: `${localize('90+')}`,
                    displayTextSkinColor: 'red-dark',
                },
            },
            {
                key: 'leverage',
                title: `${localize('Leverage')}`,
                titleIndicators: {
                    type: 'displayText',
                    displayText: `${localize('1:1000')}`,
                    displayTextSkinColor: 'yellow-light',
                },
            },
            {
                key: 'spreadsFrom',
                title: `${localize('Spreads from')}`,
                titleIndicators: {
                    type: 'displayText',
                    displayText: `${localize('0.5 pips')}`,
                    displayTextSkinColor: 'violet-dark',
                },
            },
            {
                key: 'verifications',
                title: `${localize('Verifications')}`,
                clickableDescription: [
                    { type: 'link', text: `${localize('Learn more')}` },
                    { type: 'text', text: `${localize('about verifications needed.')}` },
                ],
            },
            {
                key: 'regulatorEdr',
                title: `${localize('Regulator/EDR')}`,
                description: `${localize('Vanuatu Financial Services Commission')}`,
            },
        ],
        synthetic_verification_docs: ['selfie', 'identityDocument', 'nameAndAddress'],
        financial_verification_docs: ['selfie', 'identityDocument', 'nameAndAddress'],
    },
    labuan: {
        over_header: localize('Straight-through processing'),
        is_over_header_available: true,
        header: localize('Labuan'),
        synthetic_contents: [
            { key: 'assets', title: `${localize('Assets')}`, description: `${localize('Forex and Cryptocurrencies')}` },
            { key: 'leverage', title: `${localize('Leverage')}` },
            {
                key: 'spreadsFrom',
                title: `${localize('Spreads from')}`,
            },
            {
                key: 'verifications',
                title: `${localize('Verifications')}`,
                clickableDescription: [
                    { type: 'link', text: `${localize('Learn more')}` },
                    { type: 'text', text: `${localize('about verifications needed.')}` },
                ],
            },
            {
                key: 'regulatorEdr',
                title: `${localize('Regulator/EDR')}`,
                description: `${localize('Labuan Financial Services Authority (licence no. MB/18/0024)')}`,
            },
        ],
        financial_contents: [
            {
                key: 'assets',
                title: `${localize('Assets')}`,
                description: `${localize('Forex and Cryptocurrencies')}`,
                titleIndicators: {
                    type: 'displayText',
                    displayText: `${localize('90+')}`,
                    displayTextSkinColor: 'red-dark',
                },
            },
            {
                key: 'leverage',
                title: `${localize('Leverage')}`,
                titleIndicators: {
                    type: 'displayText',
                    displayText: `${localize('1:100')}`,
                    displayTextSkinColor: 'yellow-dark',
                },
            },
            {
                key: 'spreadsFrom',
                title: `${localize('Spreads from')}`,
                titleIndicators: {
                    type: 'displayText',
                    displayText: `${localize('0.6 pips')}`,
                    displayTextSkinColor: 'violet-dark',
                },
            },
            {
                key: 'verifications',
                title: `${localize('Verifications')}`,
                clickableDescription: [
                    { type: 'link', text: `${localize('Learn more')}` },
                    { type: 'text', text: `${localize('about verifications needed.')}` },
                ],
            },
            {
                key: 'regulatorEdr',
                title: `${localize('Regulator/EDR')}`,
                description: `${localize('Labuan Financial Services Authority (licence no. MB/18/0024)')}`,
            },
        ],
        synthetic_verification_docs: ['documentNumber', 'nameAndAddress'],
        financial_verification_docs: ['documentNumber', 'nameAndAddress'],
    },
    maltainvest: {
        is_over_header_available: false,
        header: localize('Malta'),
        synthetic_contents: [
            {
                key: 'assets',
                title: `${localize('Assets')}`,
                description: `${localize(
                    'Synthetics, Forex, Stocks, Stock indices, Commodities, and Cryptocurrencies'
                )}`,
                titleIndicators: {
                    type: 'displayText',
                    displayText: `${localize('140+')}`,
                    displayTextSkinColor: 'red-light',
                },
            },
            {
                key: 'leverage',
                title: `${localize('Leverage')}`,
                titleIndicators: {
                    type: 'displayText',
                    displayText: `${localize('1:30')}`,
                    displayTextSkinColor: 'brown-dark',
                },
            },
            {
                key: 'spreadsFrom',
                title: `${localize('Spreads from')}`,
                titleIndicators: {
                    type: 'displayText',
                    displayText: `${localize('0.5 pips')}`,
                    displayTextSkinColor: 'violet-dark',
                },
            },
            {
                key: 'verifications',
                title: `${localize('Verifications')}`,
                clickableDescription: [
                    { type: 'link', text: `${localize('Learn more')}` },
                    { type: 'text', text: `${localize('about verifications needed.')}` },
                ],
            },
            {
                key: 'regulatorEdr',
                title: `${localize('Regulator/EDR')}`,
                description: `${localize('Malta Financial Services Authority (MFSA) (licence no. IS/70156)')}`,
            },
        ],
        financial_contents: [
            {
                key: 'assets',
                title: `${localize('Assets')}`,
                description: `${localize(
                    'Synthetics, Forex, Stocks, Stock indices, Commodities, and Cryptocurrencies'
                )}`,
                titleIndicators: {
                    type: 'displayText',
                    displayText: `${localize('140+')}`,
                    displayTextSkinColor: 'red-light',
                },
            },
            {
                key: 'leverage',
                title: `${localize('Leverage')}`,
                titleIndicators: {
                    type: 'displayText',
                    displayText: `${localize('1:30')}`,
                    displayTextSkinColor: 'brown-dark',
                },
            },
            {
                key: 'spreadsFrom',
                title: `${localize('Spreads from')}`,
                titleIndicators: {
                    type: 'displayText',
                    displayText: `${localize('0.5 pips')}`,
                    displayTextSkinColor: 'violet-dark',
                },
            },
            {
                key: 'verifications',
                title: `${localize('Verifications')}`,
                clickableDescription: [
                    { type: 'link', text: `${localize('Learn more')}` },
                    { type: 'text', text: `${localize('about verifications needed.')}` },
                ],
            },
            {
                key: 'regulatorEdr',
                title: `${localize('Regulator/EDR')}`,
                description: `${localize('Malta Financial Services Authority (MFSA) (licence no. IS/70156)')}`,
            },
        ],
        synthetic_verification_docs: ['selfie', 'identityDocument', 'nameAndAddress'],
        financial_verification_docs: ['selfie', 'identityDocument', 'nameAndAddress'],
    },
};
