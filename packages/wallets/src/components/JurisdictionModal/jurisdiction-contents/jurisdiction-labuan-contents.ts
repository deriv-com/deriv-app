import { TJurisdictionCardItems } from './props.types';

export const getJurisdictionLabuanContents = (): TJurisdictionCardItems => ({
    over_header: 'Straight-through processing',
    is_over_header_available: true,
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
                title_indicators: {
                    type: 'displayIcons',
                },
                clickable_description: [
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
                title_indicators: {
                    type: 'displayText',
                    display_text: '80+',
                    display_text_skin_color: 'red-dark',
                },
            },
            {
                key: 'leverage',
                title: 'Leverage',
                title_indicators: {
                    type: 'displayText',
                    display_text: '1:100',
                    display_text_skin_color: 'yellow-dark',
                },
            },
            {
                key: 'spreadsFrom',
                title: 'Spreads from',
                title_indicators: {
                    type: 'displayText',
                    display_text: '0.6 pips',
                    display_text_skin_color: 'violet-dark',
                },
            },
            {
                key: 'verifications',
                title: 'Verifications',
                title_indicators: {
                    type: 'displayIcons',
                },
                clickable_description: [
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

    verification_docs: {
        synthetic: ['document_number', 'name_and_address'],
        financial: ['document_number', 'name_and_address'],
    },
});
