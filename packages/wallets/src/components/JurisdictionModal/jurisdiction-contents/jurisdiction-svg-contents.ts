import { TJurisdictionCardItems } from './props.types';

export const getJurisdictionSvgContents = (): TJurisdictionCardItems => ({
    isOverHeaderAvailable: false,
    header: 'St. Vincent & Grenadines',
    contents: {
        synthetic: [
            {
                key: 'assets',
                title: 'Assets',
                description: 'Synthetics, Baskets and Derived FX',
                titleIndicators: {
                    type: 'displayText',
                    displayText: '40+',
                    displayTextSkinColor: 'red-darker',
                },
            },
            {
                key: 'leverage',
                title: 'Leverage',
                titleIndicators: {
                    type: 'displayText',
                    displayText: '1:1000',
                    displayTextSkinColor: 'yellow-light',
                },
            },
            {
                key: 'verifications',
                title: 'Verifications',
                titleIndicators: {
                    type: 'displayIcons',
                },
                description: 'You will need to submit proof of identity and address once you reach certain thresholds.',
            },
            {
                key: 'regulator',
                title: 'Regulator/EDR',
                description: 'Deriv (SVG) LLC (company no. 273 LLC 2020)',
            },
        ],
        financial: [
            {
                key: 'assets',
                title: 'Assets',
                description: 'Forex, Stocks, Stock indices, Commodities, and Cryptocurrencies',
                titleIndicators: {
                    type: 'displayText',
                    displayText: '170+',
                    displayTextSkinColor: 'red-light',
                },
            },
            {
                key: 'leverage',
                title: 'Leverage',
                titleIndicators: {
                    type: 'displayText',
                    displayText: '1:1000',
                    displayTextSkinColor: 'yellow-light',
                },
                clickableDescription: [
                    {
                        type: 'link',
                        text: 'Dynamic Leverage', // onClick: toggleDynamicLeverage,
                    },
                ],
            },
            {
                key: 'spreadsFrom',
                title: 'Spreads from',
                titleIndicators: {
                    type: 'displayText',
                    displayText: '0.6 pips',
                    displayTextSkinColor: 'violet-dark',
                },
            },
            {
                key: 'verifications',
                title: 'Verifications',
                titleIndicators: {
                    type: 'displayIcons',
                },
                description: 'You will need to submit proof of identity and address once you reach certain thresholds.',
            },
            {
                key: 'regulator',
                title: 'Regulator/EDR',
                description: 'Deriv (SVG) LLC (company no. 273 LLC 2020)',
            },
        ],
        all: [
            {
                key: 'assets',
                title: 'Assets',
                description: 'Synthetics, Forex, Stocks, Stock Indices, Cryptocurrencies, and ETFs',
                titleIndicators: {
                    type: 'displayText',
                    displayText: '40+',
                    displayTextSkinColor: 'red-darker',
                },
            },
            {
                key: 'leverage',
                title: 'Leverage',
                titleIndicators: {
                    type: 'displayText',
                    displayText: '1:1000',
                    displayTextSkinColor: 'yellow-light',
                },
            },
            {
                key: 'verifications',
                title: 'Verifications',
                titleIndicators: {
                    type: 'displayIcons',
                },
                description: 'You will need to submit proof of identity and address once you reach certain thresholds.',
            },
            {
                key: 'regulator',
                title: 'Regulator/EDR',
                description: 'Deriv (SVG) LLC (company no. 273 LLC 2020)',
            },
        ],
    },
    verificationDocs: {
        synthetic: ['notApplicable'],
        financial: ['notApplicable'],
    },
});
