import { localize } from '@deriv/translations';
import { TJurisdictionCardItems, TJurisdictionCardParams } from 'Components/props.types';

export const getJurisdictionSvgContents = ({
    toggleDynamicLeverage,
}: TJurisdictionCardParams): TJurisdictionCardItems => ({
    is_over_header_available: false,
    header: localize('St. Vincent & Grenadines'),
    synthetic_contents: [
        {
            key: 'assets',
            title: localize('Assets'),
            description: localize(
                'Forex (standard), stock indices, commodities, cryptocurrencies, stocks, ETFs, synthetic indices, basket indices and derived FX'
            ),
            title_indicators: {
                type: 'displayText',
                display_text: localize('210+'),
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
            description: localize(
                'Forex (standard/micro), stocks, stock indices, commodities, cryptocurrencies and ETFs'
            ),
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
            clickable_description: [
                {
                    type: 'link',
                    text: localize('Dynamic Leverage'),
                    onClick: toggleDynamicLeverage,
                },
            ],
        },
        {
            key: 'spreadsFrom',
            title: localize('Spreads from'),
            title_indicators: {
                type: 'displayText',
                display_text: localize('0.2 pips'),
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
            key: 'assets',
            title: localize('Assets'),
            description: localize(
                'Forex, stocks, stock indices, commodities, cryptocurrencies, ETFs and synthetic indices'
            ),
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
    synthetic_verification_docs: [],
    financial_verification_docs: [],
});
