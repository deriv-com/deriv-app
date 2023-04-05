import { localize } from '@deriv/translations';
import { TJurisdictionCardSection } from 'Components/props.types';

type TJurisdictionCardItemVerification = Array<'document_number' | 'selfie' | 'identity_document' | 'name_and_address'>;

type TJurisdictionCardItems = {
    header: string;
    over_header?: string;
    synthetic_contents: Array<TJurisdictionCardSection>;
    financial_contents: Array<TJurisdictionCardSection>;
    is_over_header_available: boolean;
    synthetic_verification_docs?: TJurisdictionCardItemVerification;
    financial_verification_docs?: TJurisdictionCardItemVerification;
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
                title_indicators: {
                    type: 'displayText',
                    display_text: `${localize('40+')}`,
                    display_text_skin_color: 'red-darker',
                },
            },
            {
                key: 'leverage',
                title: `${localize('Leverage')}`,
                title_indicators: {
                    type: 'displayText',
                    display_text: `${localize('1:1000')}`,
                    display_text_skin_color: 'yellow-light',
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
                title_indicators: {
                    type: 'displayText',
                    display_text: `${localize('170+')}`,
                    display_text_skin_color: 'red-light',
                },
            },
            {
                key: 'leverage',
                title: `${localize('Leverage')}`,
                title_indicators: {
                    type: 'displayText',
                    display_text: `${localize('1:1000')}`,
                    display_text_skin_color: 'yellow-light',
                },
            },
            {
                key: 'spreadsFrom',
                title: `${localize('Spreads from')}`,
                title_indicators: {
                    type: 'displayText',
                    display_text: `${localize('0.6 pips')}`,
                    display_text_skin_color: 'violet-dark',
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
                title_indicators: {
                    type: 'displayText',
                    display_text: `${localize('40+')}`,
                    display_text_skin_color: 'red-darker',
                },
            },
            {
                key: 'leverage',
                title: `${localize('Leverage')}`,
                title_indicators: {
                    type: 'displayText',
                    display_text: `${localize('1:1000')}`,
                    display_text_skin_color: 'yellow-light',
                },
            },
            {
                key: 'verifications',
                title: `${localize('Verifications')}`,
                clickable_description: [
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
                title_indicators: {
                    type: 'displayText',
                    display_text: `${localize('170+')}`,
                    display_text_skin_color: 'red-light',
                },
            },
            {
                key: 'leverage',
                title: `${localize('Leverage')}`,
                title_indicators: {
                    type: 'displayText',
                    display_text: `${localize('1:1000')}`,
                    display_text_skin_color: 'yellow-light',
                },
            },
            {
                key: 'spreadsFrom',
                title: `${localize('Spreads from')}`,
                title_indicators: {
                    type: 'displayText',
                    display_text: `${localize('0.5 pips')}`,
                    display_text_skin_color: 'violet-dark',
                },
            },
            {
                key: 'verifications',
                title: `${localize('Verifications')}`,
                clickable_description: [
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
        synthetic_verification_docs: ['document_number', 'name_and_address'],
        financial_verification_docs: ['document_number', 'name_and_address'],
    },
    vanuatu: {
        is_over_header_available: false,
        header: localize('Vanuatu'),
        synthetic_contents: [
            {
                key: 'assets',
                title: `${localize('Assets')}`,
                description: `${localize('Synthetics, Basket indices and Derived FX')}`,
                title_indicators: {
                    type: 'displayText',
                    display_text: `${localize('40+')}`,
                    display_text_skin_color: 'red-darker',
                },
            },
            {
                key: 'leverage',
                title: `${localize('Leverage')}`,
                title_indicators: {
                    type: 'displayText',
                    display_text: `${localize('1:1000')}`,
                    display_text_skin_color: 'yellow-light',
                },
            },
            {
                key: 'verifications',
                title: `${localize('Verifications')}`,
                clickable_description: [
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
                title_indicators: {
                    type: 'displayText',
                    display_text: `${localize('90+')}`,
                    display_text_skin_color: 'red-dark',
                },
            },
            {
                key: 'leverage',
                title: `${localize('Leverage')}`,
                title_indicators: {
                    type: 'displayText',
                    display_text: `${localize('1:1000')}`,
                    display_text_skin_color: 'yellow-light',
                },
            },
            {
                key: 'spreadsFrom',
                title: `${localize('Spreads from')}`,
                title_indicators: {
                    type: 'displayText',
                    display_text: `${localize('0.5 pips')}`,
                    display_text_skin_color: 'violet-dark',
                },
            },
            {
                key: 'verifications',
                title: `${localize('Verifications')}`,
                clickable_description: [
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
        synthetic_verification_docs: ['selfie', 'identity_document', 'name_and_address'],
        financial_verification_docs: ['selfie', 'identity_document', 'name_and_address'],
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
                clickable_description: [
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
                title_indicators: {
                    type: 'displayText',
                    display_text: `${localize('90+')}`,
                    display_text_skin_color: 'red-dark',
                },
            },
            {
                key: 'leverage',
                title: `${localize('Leverage')}`,
                title_indicators: {
                    type: 'displayText',
                    display_text: `${localize('1:100')}`,
                    display_text_skin_color: 'yellow-dark',
                },
            },
            {
                key: 'spreadsFrom',
                title: `${localize('Spreads from')}`,
                title_indicators: {
                    type: 'displayText',
                    display_text: `${localize('0.6 pips')}`,
                    display_text_skin_color: 'violet-dark',
                },
            },
            {
                key: 'verifications',
                title: `${localize('Verifications')}`,
                clickable_description: [
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
        synthetic_verification_docs: ['document_number', 'name_and_address'],
        financial_verification_docs: ['document_number', 'name_and_address'],
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
                title_indicators: {
                    type: 'displayText',
                    display_text: `${localize('140+')}`,
                    display_text_skin_color: 'red-light',
                },
            },
            {
                key: 'leverage',
                title: `${localize('Leverage')}`,
                title_indicators: {
                    type: 'displayText',
                    display_text: `${localize('1:30')}`,
                    display_text_skin_color: 'brown-dark',
                },
            },
            {
                key: 'spreadsFrom',
                title: `${localize('Spreads from')}`,
                title_indicators: {
                    type: 'displayText',
                    display_text: `${localize('0.5 pips')}`,
                    display_text_skin_color: 'violet-dark',
                },
            },
            {
                key: 'verifications',
                title: `${localize('Verifications')}`,
                clickable_description: [
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
                title_indicators: {
                    type: 'displayText',
                    display_text: `${localize('140+')}`,
                    display_text_skin_color: 'red-light',
                },
            },
            {
                key: 'leverage',
                title: `${localize('Leverage')}`,
                title_indicators: {
                    type: 'displayText',
                    display_text: `${localize('1:30')}`,
                    display_text_skin_color: 'brown-dark',
                },
            },
            {
                key: 'spreadsFrom',
                title: `${localize('Spreads from')}`,
                title_indicators: {
                    type: 'displayText',
                    display_text: `${localize('0.5 pips')}`,
                    display_text_skin_color: 'violet-dark',
                },
            },
            {
                key: 'verifications',
                title: `${localize('Verifications')}`,
                clickable_description: [
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
        synthetic_verification_docs: ['selfie', 'identity_document', 'name_and_address'],
        financial_verification_docs: ['selfie', 'identity_document', 'name_and_address'],
    },
};
