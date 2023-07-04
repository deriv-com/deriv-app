import { localize } from '@deriv/translations';
import { TJurisdictionCardItems } from 'Components/props.types';

export const getJurisdictionBviContents = (): TJurisdictionCardItems => ({
    is_over_header_available: false,
    header: localize('British Virgin Islands'),
    synthetic_contents: [
        {
            key: 'assets',
            title: localize('Assets'),
            description: localize('Synthetics, Baskets and Derived FX'),
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
            clickable_description: [
                { type: 'link', text: localize('Learn more') },
                { type: 'text', text: localize('about verifications needed.') },
            ],
        },
        {
            key: 'regulator',
            title: localize('Regulator/EDR'),
            description: localize('British Virgin Islands Financial Services Commission (License no. SIBA/L/18/1114)'),
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
                display_text: localize('0.5 pips'),
                display_text_skin_color: 'violet-dark',
            },
        },
        {
            key: 'verifications',
            title: localize('Verifications'),
            title_indicators: { type: 'displayIcons' },
            clickable_description: [
                { type: 'link', text: localize('Learn more') },
                { type: 'text', text: localize('about verifications needed.') },
            ],
        },
        {
            key: 'regulator',
            title: localize('Regulator/EDR'),
            description: localize('British Virgin Islands Financial Services Commission (License no. SIBA/L/18/1114)'),
        },
    ],
    synthetic_verification_docs: ['document_number', 'name_and_address'],
    financial_verification_docs: ['document_number', 'name_and_address'],
});
