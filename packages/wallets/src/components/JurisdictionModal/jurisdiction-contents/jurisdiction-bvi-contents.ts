import { TJurisdictionCardItems } from './props.types';

export const getJurisdictionBviContents = (): TJurisdictionCardItems => ({
    isOverHeaderAvailable: false,
    header: 'British Virgin Islands',
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
                clickableDescription: [
                    {
                        type: 'link',
                        text: 'Learn more',
                    },
                    {
                        type: 'text',
                        text: 'about verifications needed.',
                    },
                ],
            },
            {
                key: 'regulator',
                title: 'Regulator/EDR',
                description: 'British Virgin Islands Financial Services Commission (License no. SIBA/L/18/1114)',
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
                    displayText: '0.5 pips',
                    displayTextSkinColor: 'violet-dark',
                },
            },
            {
                key: 'verifications',
                title: 'Verifications',
                titleIndicators: {
                    type: 'displayIcons',
                },
                clickableDescription: [
                    {
                        type: 'link',
                        text: 'Learn more',
                    },
                    {
                        type: 'text',
                        text: 'about verifications needed.',
                    },
                ],
            },
            {
                key: 'regulator',
                title: 'Regulator/EDR',
                description: 'British Virgin Islands Financial Services Commission (License no. SIBA/L/18/1114)',
            },
        ],
    },
    verificationDocs: {
        synthetic: ['documentNumber', 'nameAndAddress'],
        financial: ['documentNumber', 'nameAndAddress'],
    },
});
