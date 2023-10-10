import { TJurisdictionCardItems } from './props.types';

export const getJurisdictionMaltainvestContents = (): TJurisdictionCardItems => ({
    isOverHeaderAvailable: false,
    header: 'Malta',
    contents: {
        synthetic: [
            {
                key: 'assets',
                title: 'Assets',
                description: 'Synthetics, Forex, Stocks, Stock indices, Commodities, and Cryptocurrencies',
                titleIndicators: {
                    type: 'displayText',
                    displayText: '140+',
                    displayTextSkinColor: 'red-light',
                },
            },
            {
                key: 'leverage',
                title: 'Leverage',
                titleIndicators: {
                    type: 'displayText',
                    displayText: '1:30',
                    displayTextSkinColor: 'brown-dark',
                },
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
                description: 'Malta Financial Services Authority (MFSA) (licence no. IS/70156)',
            },
        ],
        financial: [
            {
                key: 'assets',
                title: 'Assets',
                description: 'Synthetics, Forex, Stocks, Stock indices, Commodities, and Cryptocurrencies',
                titleIndicators: {
                    type: 'displayText',
                    displayText: '140+',
                    displayTextSkinColor: 'red-light',
                },
            },
            {
                key: 'leverage',
                title: 'Leverage',
                titleIndicators: {
                    type: 'displayText',
                    displayText: '1:30',
                    displayTextSkinColor: 'brown-dark',
                },
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
                description: 'Malta Financial Services Authority (MFSA) (licence no. IS/70156)',
            },
        ],
    },
    verificationDocs: {
        synthetic: ['selfie', 'identityDocument', 'nameAndAddress'],
        financial: ['selfie', 'identityDocument', 'nameAndAddress'],
    },
});
