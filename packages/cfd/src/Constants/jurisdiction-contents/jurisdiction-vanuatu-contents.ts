import { localize } from '@deriv/translations';
import { TJurisdictionCardItems } from 'Components/props.types';

export const getJurisdictionVanuatuContents = (): TJurisdictionCardItems => ({
    is_over_header_available: false,
    header: localize('Vanuatu'),
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
            description: localize('Vanuatu Financial Services Commission'),
        },
    ],
    financial_contents: [
        {
            key: 'assets',
            title: localize('Assets'),
            description: localize('Forex, Stock indices, Commodities and Cryptocurrencies'),
            title_indicators: {
                type: 'displayText',
                display_text: localize('90+'),
                display_text_skin_color: 'red-dark',
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
            description: localize('Vanuatu Financial Services Commission'),
        },
    ],
    synthetic_verification_docs: ['document_number', 'name_and_address'],
    financial_verification_docs: ['document_number', 'name_and_address'],
});
