import { TJurisdictionCardItems } from './props.types';

export const getJurisdictionLabuanContents = (): TJurisdictionCardItems => ({
    contents: {
        financial: [
            {
                description: 'Forex (standard/exotic) and cryptocurrencies',
                key: 'assets',
                title: 'Assets',
                titleIndicators: {
                    displayText: '80+',
                    displayTextSkinColor: 'red-dark',
                    type: 'displayText',
                },
            },
            {
                clickableDescription: [
                    {
                        tag: 'dynamicLeverage',
                        text: 'Dynamic Leverage',
                        type: 'link',
                    },
                ],
                key: 'leverage',
                title: 'Leverage up to',
                titleIndicators: {
                    displayText: '1:100',
                    displayTextSkinColor: 'yellow-dark',
                    type: 'displayText',
                },
            },
            {
                key: 'spreads-from',
                title: 'Spreads from',
                titleIndicators: {
                    displayText: '0.6 pips',
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
                description: 'Labuan Financial Services Authority (licence no. MB/18/0024)',
                key: 'regulator',
                title: 'Regulator/EDR',
            },
        ],
        synthetic: [
            {
                description: 'Forex and Cryptocurrencies',
                key: 'assets',
                title: 'Assets',
            },
            {
                key: 'leverage',
                title: 'Leverage up to',
            },
            {
                key: 'spreads-from',
                title: 'Spreads from',
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
                description: 'Labuan Financial Services Authority (licence no. MB/18/0024)',
                key: 'regulator',
                title: 'Regulator/EDR',
            },
        ],
    },
    header: 'Labuan',
    isOverHeaderAvailable: true,
    overHeader: 'Straight-through processing',
    verificationDocs: {
        financial: ['documentNumber', 'nameAndAddress'],
        synthetic: ['documentNumber', 'nameAndAddress'],
    },
});
