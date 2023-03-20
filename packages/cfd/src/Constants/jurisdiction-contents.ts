import { localize } from '@deriv/translations';
import { TJurisdictionCardSection } from 'Components/props.types';

type TJurisdictionCardItems = {
    header: string;
    over_header?: string;
    synthetic_contents: Array<TJurisdictionCardSection>;
    financial_contents: Array<TJurisdictionCardSection>;
    is_over_header_available: boolean;
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
                title: `${localize('Assets')}`,
                description: `${localize('Synthetics, Basket indices and Derived FX')}`,
                titleIndicators: {
                    type: 'displayText',
                    displayText: `${localize('40+')}`,
                    displayTextSkinColor: 'red-darker',
                },
            },
            {
                title: `${localize('Leverage')}`,
                titleIndicators: {
                    type: 'displayText',
                    displayText: `${localize('1:1000')}`,
                    displayTextSkinColor: 'yellow-light',
                },
            },
            {
                title: `${localize('Verifications')}`,
                description: `${localize(
                    'You will need to submit proof of identity and address once you reach certain thresholds.'
                )}`,
            },
            {
                title: `${localize('Regulator/EDR')}`,
                description: `${localize('Deriv (SVG) LLC (company no. 273 LLC 2020)')}`,
            },
        ],
        financial_contents: [
            {
                title: `${localize('Assets')}`,
                description: `${localize('Forex, Stocks, Stock indices, Commodities, and Cryptocurrencies')}`,
                titleIndicators: {
                    type: 'displayText',
                    displayText: `${localize('170+')}`,
                    displayTextSkinColor: 'red-light',
                },
            },
            {
                title: `${localize('Leverage')}`,
                titleIndicators: {
                    type: 'displayText',
                    displayText: `${localize('1:1000')}`,
                    displayTextSkinColor: 'yellow-light',
                },
            },
            {
                title: `${localize('Spreads from')}`,
                titleIndicators: {
                    type: 'displayText',
                    displayText: `${localize('0.6 pips')}`,
                    displayTextSkinColor: 'violet-dark',
                },
            },
            {
                title: `${localize('Verifications')}`,
                description: `${localize(
                    'You will need to submit proof of identity and address once you reach certain thresholds.'
                )}`,
            },
            {
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
                title: `${localize('Assets')}`,
                description: `${localize('Synthetics, Basket indices and Derived FX')}`,
                titleIndicators: {
                    type: 'displayText',
                    displayText: `${localize('40+')}`,
                    displayTextSkinColor: 'red-darker',
                },
            },
            {
                title: `${localize('Leverage')}`,
                titleIndicators: {
                    type: 'displayText',
                    displayText: `${localize('1:1000')}`,
                    displayTextSkinColor: 'yellow-light',
                },
            },
            {
                title: `${localize('Verifications')}`,
                description: `${localize('Learn more about verifications needed.')}`,
            },
            {
                title: `${localize('Regulator/EDR')}`,
                description: `${localize(
                    'British Virgin Islands Financial Services Commission (License no. SIBA/L/18/1114)'
                )}`,
            },
        ],
        financial_contents: [
            {
                title: `${localize('Assets')}`,
                description: `${localize('Forex, Stocks, Stock indices, Commodities, and Cryptocurrencies')}`,
                titleIndicators: {
                    type: 'displayText',
                    displayText: `${localize('170+')}`,
                    displayTextSkinColor: 'red-light',
                },
            },
            {
                title: `${localize('Leverage')}`,
                titleIndicators: {
                    type: 'displayText',
                    displayText: `${localize('1:1000')}`,
                    displayTextSkinColor: 'yellow-light',
                },
            },
            {
                title: `${localize('Spreads from')}`,
                titleIndicators: {
                    type: 'displayText',
                    displayText: `${localize('0.5 pips')}`,
                    displayTextSkinColor: 'violet-dark',
                },
            },
            {
                title: `${localize('Verifications')}`,
                description: `${localize('Learn more about verifications needed.')}`,
            },
            {
                title: `${localize('Regulator/EDR')}`,
                description: `${localize(
                    'British Virgin Islands Financial Services Commission (License no. SIBA/L/18/1114)'
                )}`,
            },
        ],
    },
    vanuatu: {
        is_over_header_available: false,
        header: localize('Vanuatu'),
        synthetic_contents: [
            {
                title: `${localize('Assets')}`,
                description: `${localize('Synthetics, Basket indices and Derived FX')}`,
                titleIndicators: {
                    type: 'displayText',
                    displayText: `${localize('40+')}`,
                    displayTextSkinColor: 'red-darker',
                },
            },
            {
                title: `${localize('Leverage')}`,
                titleIndicators: {
                    type: 'displayText',
                    displayText: `${localize('1:1000')}`,
                    displayTextSkinColor: 'yellow-light',
                },
            },
            {
                title: `${localize('Verifications')}`,
                description: `${localize('Learn more about verifications needed.')}`,
            },
            {
                title: `${localize('Regulator/EDR')}`,
                description: `${localize('Vanuatu Financial Services Commission')}`,
            },
        ],
        financial_contents: [
            {
                title: `${localize('Assets')}`,
                description: `${localize('Forex, Stock indices, Commodities and Cryptocurrencies')}`,
                titleIndicators: {
                    type: 'displayText',
                    displayText: `${localize('90+')}`,
                    displayTextSkinColor: 'red-dark',
                },
            },
            {
                title: `${localize('Leverage')}`,
                titleIndicators: {
                    type: 'displayText',
                    displayText: `${localize('1:1000')}`,
                    displayTextSkinColor: 'yellow-light',
                },
            },
            {
                title: `${localize('Spreads from')}`,
                titleIndicators: {
                    type: 'displayText',
                    displayText: `${localize('0.5 pips')}`,
                    displayTextSkinColor: 'violet-dark',
                },
            },
            {
                title: `${localize('Verifications')}`,
                description: `${localize('Learn more about verifications needed.')}`,
            },
            {
                title: `${localize('Regulator/EDR')}`,
                description: `${localize('Vanuatu Financial Services Commission')}`,
            },
        ],
    },
    labuan: {
        over_header: localize('Straight-through processing'),
        is_over_header_available: true,
        header: localize('Labuan'),
        synthetic_contents: [
            { title: `${localize('Assets')}`, description: `${localize('Forex and Cryptocurrencies')}` },
            { title: `${localize('Leverage')}` },
            {
                title: `${localize('Spreads from')}`,
            },
            {
                title: `${localize('Verifications')}`,
                description: `${localize('Learn more about verifications needed.')}`,
            },
            {
                title: `${localize('Regulator/EDR')}`,
                description: `${localize('Labuan Financial Services Authority (licence no. MB/18/0024)')}`,
            },
        ],
        financial_contents: [
            {
                title: `${localize('Assets')}`,
                description: `${localize('Forex and Cryptocurrencies')}`,
                titleIndicators: {
                    type: 'displayText',
                    displayText: `${localize('90+')}`,
                    displayTextSkinColor: 'red-dark',
                },
            },
            {
                title: `${localize('Leverage')}`,
                titleIndicators: {
                    type: 'displayText',
                    displayText: `${localize('1:100')}`,
                    displayTextSkinColor: 'yellow-dark',
                },
            },
            {
                title: `${localize('Spreads from')}`,
                titleIndicators: {
                    type: 'displayText',
                    displayText: `${localize('0.6 pips')}`,
                    displayTextSkinColor: 'violet-dark',
                },
            },
            {
                title: `${localize('Verifications')}`,
                description: `${localize('Learn more about verifications needed.')}`,
            },
            {
                title: `${localize('Regulator/EDR')}`,
                description: `${localize('Labuan Financial Services Authority (licence no. MB/18/0024)')}`,
            },
        ],
    },
    maltainvest: {
        is_over_header_available: false,
        header: localize('Malta'),
        synthetic_contents: [
            {
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
                title: `${localize('Leverage')}`,
                titleIndicators: {
                    type: 'displayText',
                    displayText: `${localize('1:30')}`,
                    displayTextSkinColor: 'brown-dark',
                },
            },
            {
                title: `${localize('Spreads from')}`,
                titleIndicators: {
                    type: 'displayText',
                    displayText: `${localize('0.5 pips')}`,
                    displayTextSkinColor: 'violet-dark',
                },
            },
            {
                title: `${localize('Verifications')}`,
                description: `${localize('Learn more about verifications needed.')}`,
            },
            {
                title: `${localize('Regulator/EDR')}`,
                description: `${localize('Malta Financial Services Authority (MFSA) (licence no. IS/70156)')}`,
            },
        ],
        financial_contents: [
            {
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
                title: `${localize('Leverage')}`,
                titleIndicators: {
                    type: 'displayText',
                    displayText: `${localize('1:30')}`,
                    displayTextSkinColor: 'brown-dark',
                },
            },
            {
                title: `${localize('Spreads from')}`,
                titleIndicators: {
                    type: 'displayText',
                    displayText: `${localize('0.5 pips')}`,
                    displayTextSkinColor: 'violet-dark',
                },
            },
            {
                title: `${localize('Verifications')}`,
                description: `${localize('Learn more about verifications needed.')}`,
            },
            {
                title: `${localize('Regulator/EDR')}`,
                description: `${localize('Malta Financial Services Authority (MFSA) (licence no. IS/70156)')}`,
            },
        ],
    },
};
