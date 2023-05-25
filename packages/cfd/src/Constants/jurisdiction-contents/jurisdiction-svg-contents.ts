import { localize } from '@deriv/translations';
import { TJurisdictionCardItems } from 'Components/props.types';

export const getJurisdictionSvgContents = (): TJurisdictionCardItems => ({
    is_over_header_available: false,
    header: localize('St. Vincent & Grenadines'),
    synthetic_contents: [
        {
            key: 'assets',
            title: localize('Assets'),
            description: localize('Synthetics, Basket indices and Derived FX'),
            title_indicators: {
                type: 'displayText',
                display_text: localize('40+'),
                display_text_skin_color: 'red-darker',
            },
        },
        {
            key: 'leverage',
            title: localize('Leverage'),
            title_indicators: {
                type: 'displayText',
                display_text: localize('1:1000'),
                display_text_skin_color: 'yellow-light',
            },
        },
        {
            key: 'verifications',
            title: localize('Verifications'),
            title_indicators: { type: 'displayIcons' },
            description: localize(
                'You will need to submit proof of identity and address once you reach certain thresholds.'
            ),
        },
        {
            key: 'regulator',
            title: localize('Regulator/EDR'),
            description: localize('Deriv (SVG) LLC (company no. 273 LLC 2020)'),
        },
    ],
    financial_contents: [
        {
            key: 'assets',
            title: localize('Assets'),
            description: localize('Forex, Stocks, Stock indices, Commodities, and Cryptocurrencies'),
            title_indicators: {
                type: 'displayText',
                display_text: localize('170+'),
                display_text_skin_color: 'red-light',
            },
        },
        {
            key: 'leverage',
            title: localize('Leverage'),
            title_indicators: {
                type: 'displayText',
                display_text: localize('1:1000'),
                display_text_skin_color: 'yellow-light',
            },
        },
        {
            key: 'spreadsFrom',
            title: localize('Spreads from'),
            title_indicators: {
                type: 'displayText',
                display_text: localize('0.6 pips'),
                display_text_skin_color: 'violet-dark',
            },
        },
        {
            key: 'verifications',
            title: localize('Verifications'),
            title_indicators: { type: 'displayIcons' },
            description: localize(
                'You will need to submit proof of identity and address once you reach certain thresholds.'
            ),
        },
        {
            key: 'regulator',
            title: localize('Regulator/EDR'),
            description: localize('Deriv (SVG) LLC (company no. 273 LLC 2020)'),
        },
    ],
    swapfree_contents: [
        {
            key: 'title',
            title: localize('Selecting this will onboard you through Deriv (SVG) LLC (company no. 273 LLC 2020)'),
        },
        {
            key: 'assets',
            title: localize(
                '40+ assets: forex, synthetics, stocks, stock indices, cryptocurrencies, and ETFs swap-free.'
            ),
        },
        {
            key: 'leverage',
            title: localize('Leverage up to 1:1000'),
        },
    ],
    synthetic_verification_docs: ['not_applicable'],
    financial_verification_docs: ['not_applicable'],
});
