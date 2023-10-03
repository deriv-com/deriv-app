import { TJurisdictionCardItems } from './props.types';

export const getJurisdictionMaltainvestContents = (): TJurisdictionCardItems => ({
    is_over_header_available: false,
    header: 'Malta',
    contents: {
        synthetic: [
            {
                key: 'assets',
                title: 'Assets',
                description: 'Synthetics, Forex, Stocks, Stock indices, Commodities, and Cryptocurrencies',
                title_indicators: {
                    type: 'displayText',
                    display_text: '140+',
                    display_text_skin_color: 'red-light',
                },
            },
            {
                key: 'leverage',
                title: 'Leverage',
                title_indicators: {
                    type: 'displayText',
                    display_text: '1:30',
                    display_text_skin_color: 'brown-dark',
                },
            },
            {
                key: 'spreadsFrom',
                title: 'Spreads from',
                title_indicators: {
                    type: 'displayText',
                    display_text: '0.5 pips',
                    display_text_skin_color: 'violet-dark',
                },
            },
            {
                key: 'verifications',
                title: 'Verifications',
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
                description: 'Malta Financial Services Authority (MFSA) (licence no. IS/70156)',
            },
        ],
        financial: [
            {
                key: 'assets',
                title: 'Assets',
                description: 'Synthetics, Forex, Stocks, Stock indices, Commodities, and Cryptocurrencies',
                title_indicators: {
                    type: 'displayText',
                    display_text: '140+',
                    display_text_skin_color: 'red-light',
                },
            },
            {
                key: 'leverage',
                title: 'Leverage',
                title_indicators: {
                    type: 'displayText',
                    display_text: '1:30',
                    display_text_skin_color: 'brown-dark',
                },
            },
            {
                key: 'spreadsFrom',
                title: 'Spreads from',
                title_indicators: {
                    type: 'displayText',
                    display_text: '0.5 pips',
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
                description: 'Malta Financial Services Authority (MFSA) (licence no. IS/70156)',
            },
        ],
    },
    verification_docs: {
        synthetic: ['selfie', 'identity_document', 'name_and_address'],
        financial: ['selfie', 'identity_document', 'name_and_address'],
    },
});
