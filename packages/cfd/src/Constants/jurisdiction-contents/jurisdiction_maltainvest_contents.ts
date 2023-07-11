import { localize } from '@deriv/translations';
import { TJurisdictionCardItems } from 'Components/props.types';

export const getJurisdictionMaltainvestContents = (): TJurisdictionCardItems => ({
    is_over_header_available: false,
    header: localize('Malta'),
    synthetic_contents: [
        {
            key: 'assets',
            title: localize('Assets'),
            description: localize('Synthetics, Forex, Stocks, Stock indices, Commodities, and Cryptocurrencies'),
            title_indicators: {
                type: 'displayText',
                display_text: localize('140+'),
                display_text_skin_color: 'red-light',
            },
        },
        {
            key: 'leverage',
            title: localize('Leverage'),
            title_indicators: {
                type: 'displayText',
                display_text: localize('1:30'),
                display_text_skin_color: 'brown-dark',
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
            clickable_description: [
                { type: 'link', text: localize('Learn more') },
                { type: 'text', text: localize('about verifications needed.') },
            ],
        },
        {
            key: 'regulator',
            title: localize('Regulator/EDR'),
            description: localize('Malta Financial Services Authority (MFSA) (licence no. IS/70156)'),
        },
    ],
    financial_contents: [
        {
            key: 'assets',
            title: localize('Assets'),
            description: localize('Synthetics, Forex, Stocks, Stock indices, Commodities, and Cryptocurrencies'),
            title_indicators: {
                type: 'displayText',
                display_text: localize('140+'),
                display_text_skin_color: 'red-light',
            },
        },
        {
            key: 'leverage',
            title: localize('Leverage'),
            title_indicators: {
                type: 'displayText',
                display_text: localize('1:30'),
                display_text_skin_color: 'brown-dark',
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
            description: localize('Malta Financial Services Authority (MFSA) (licence no. IS/70156)'),
        },
    ],
    synthetic_verification_docs: ['selfie', 'identity_document', 'name_and_address'],
    financial_verification_docs: ['selfie', 'identity_document', 'name_and_address'],
});
