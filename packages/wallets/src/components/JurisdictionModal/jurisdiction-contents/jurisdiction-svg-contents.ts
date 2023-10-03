import { TJurisdictionCardItems, TJurisdictionCardParams } from './props.types';

export const getJurisdictionSvgContents = (): TJurisdictionCardItems => ({
    is_over_header_available: false,
    header: 'St. Vincent & Grenadines',
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
                title_indicators: {
                    type: 'displayText',
                    display_text: '170+',
                    display_text_skin_color: 'red-light',
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
                description: 'You will need to submit proof of identity and address once you reach certain thresholds.',
            },
            {
                key: 'regulator',
                title: 'Regulator/EDR',
                description: 'Deriv (SVG) LLC (company no. 273 LLC 2020)',
            },
        ],
        swapfree: [
            {
                key: 'assets',
                title: 'Assets',
                description: 'Synthetics, Forex, Stocks, Stock Indices, Cryptocurrencies, and ETFs',
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
                description: 'You will need to submit proof of identity and address once you reach certain thresholds.',
            },
            {
                key: 'regulator',
                title: 'Regulator/EDR',
                description: 'Deriv (SVG) LLC (company no. 273 LLC 2020)',
            },
        ],
    },
    verification_docs: {
        synthetic: ['not_applicable'],
        financial: ['not_applicable'],
    },
});
