import { TJurisdictionCardItems } from './props.types';

export const getJurisdictionLabuanContents = (): TJurisdictionCardItems => ({
    overHeader: 'Straight-through processing',
    isOverHeaderAvailable: true,
    header: 'Labuan',
    contents: {
        synthetic: [
            {
                key: 'assets',
                title: 'Assets',
                description: 'Forex and Cryptocurrencies',
            },
            {
                key: 'leverage',
                title: 'Leverage',
            },
            {
                key: 'spreadsFrom',
                title: 'Spreads from',
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
                description: 'Labuan Financial Services Authority (licence no. MB/18/0024)',
            },
        ],
        financial: [
            {
                key: 'assets',
                title: 'Assets',
                description: 'Forex and Cryptocurrencies',
                titleIndicators: {
                    type: 'displayText',
                    displayText: '80+',
                    displayTextSkinColor: 'red-dark',
                },
            },
            {
                key: 'leverage',
                title: 'Leverage',
                titleIndicators: {
                    type: 'displayText',
                    displayText: '1:100',
                    displayTextSkinColor: 'yellow-dark',
                },
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
                description: 'Labuan Financial Services Authority (licence no. MB/18/0024)',
            },
        ],
    },
    verificationDocs: {
        synthetic: ['documentNumber', 'nameAndAddress'],
        financial: ['documentNumber', 'nameAndAddress'],
    },
});
