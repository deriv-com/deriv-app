import { TJurisdictionCardItems, TJurisdictionCardParams } from './props.types';

export const getJurisdictionVanuatuContents = (): TJurisdictionCardItems => ({
    is_over_header_available: false,
    header: 'Vanuatu',
    contents: {
        synthetic: [
            {
                key: 'assets',
                title: 'Assets',
                description: 'Synthetics, Baskets and Derived FX',
                title_indicators: {
                    type: 'displayText',
                    display_text: '40+',
                    display_text_skin_color: 'red-darker',
                },
            },
            {
                key: 'leverage',
                title: 'Leverage',
                title_indicators: {
                    type: 'displayText',
                    display_text: '1:1000',
                    display_text_skin_color: 'yellow-light',
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
                description: 'Vanuatu Financial Services Commission',
            },
        ],
        financial: [
            {
                key: 'assets',
                title: 'Assets',
                description: 'Forex, Stock indices, Commodities and Cryptocurrencies',
                title_indicators: {
                    type: 'displayText',
                    display_text: '90+',
                    display_text_skin_color: 'red-dark',
                },
            },
            {
                key: 'leverage',
                title: 'Leverage',
                title_indicators: {
                    type: 'displayText',
                    display_text: '1:1000',
                    display_text_skin_color: 'yellow-light',
                },
                clickable_description: [
                    {
                        type: 'link',
                        text: 'Dynamic Leverage',
                        // onClick: toggleDynamicLeverage,
                    },
                ],
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
                description: 'Vanuatu Financial Services Commission',
            },
        ],
    },
    verification_docs: {
        synthetic: ['document_number', 'name_and_address'],
        financial: ['document_number', 'name_and_address'],
    },
});
