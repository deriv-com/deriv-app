import { TJurisdictionCardItems } from './props.types';

export const getJurisdictionMaltainvestContents = (): TJurisdictionCardItems => ({
    contents: {
        financial: [
            {
                description: 'Forex, stocks, stock indices, commodities, cryptocurrencies and synthetic indices',
                key: 'assets',
                title: 'Assets',
                titleIndicators: {
                    displayText: '140+',
                    displayTextSkinColor: 'red-light',
                    type: 'displayText',
                },
            },
            {
                key: 'leverage',
                title: 'Leverage up to',
                titleIndicators: {
                    displayText: '1:30',
                    displayTextSkinColor: 'brown-dark',
                    type: 'displayText',
                },
            },
            {
                key: 'spreads-from',
                title: 'Spreads from',
                titleIndicators: {
                    displayText: '0.5 pips',
                    displayTextSkinColor: 'violet-dark',
                    type: 'displayText',
                },
            },
            {
                clickableDescription: [
                    {
                        text: 'Learn more',
                        type: 'link',
                    },
                    {
                        text: 'about verifications needed.',
                        type: 'text',
                    },
                ],
                key: 'verifications',
                title: 'Verifications',
                titleIndicators: {
                    type: 'displayIcons',
                },
            },
            {
                description: 'Malta Financial Services Authority (MFSA) (licence no. IS/70156)',
                key: 'regulator',
                title: 'Regulator/EDR',
            },
        ],
        synthetic: [
            {
                description: 'Synthetics, Forex, Stocks, Stock indices, Commodities, and Cryptocurrencies',
                key: 'assets',
                title: 'Assets',
                titleIndicators: {
                    displayText: '210+',
                    displayTextSkinColor: 'red-light',
                    type: 'displayText',
                },
            },
            {
                key: 'leverage',
                title: 'Leverage up to',
                titleIndicators: {
                    displayText: '1:30',
                    displayTextSkinColor: 'brown-dark',
                    type: 'displayText',
                },
            },
            {
                key: 'spreads-from',
                title: 'Spreads from',
                titleIndicators: {
                    displayText: '0.5 pips',
                    displayTextSkinColor: 'violet-dark',
                    type: 'displayText',
                },
            },
            {
                clickableDescription: [
                    {
                        text: 'Learn more',
                        type: 'link',
                    },
                    {
                        text: 'about verifications needed.',
                        type: 'text',
                    },
                ],
                key: 'verifications',
                title: 'Verifications',
            },
            {
                description: 'Malta Financial Services Authority (MFSA) (licence no. IS/70156)',
                key: 'regulator',
                title: 'Regulator/EDR',
            },
        ],
    },
    header: 'Malta',
    isOverHeaderAvailable: false,
    verificationDocs: {
        financial: ['selfie', 'identityDocument', 'nameAndAddress'],
        synthetic: ['selfie', 'identityDocument', 'nameAndAddress'],
    },
});
