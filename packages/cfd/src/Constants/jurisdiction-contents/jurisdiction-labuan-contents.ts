import { localize } from '@deriv/translations';
import { TJurisdictionCardItems } from 'Components/props.types';

export const getJurisdictionLabuanContents = (): TJurisdictionCardItems => ({
    over_header: localize('Straight-through processing'),
    is_over_header_available: true,
    header: localize('Labuan'),
    synthetic_contents: [
        { key: 'assets', title: localize('Assets'), description: localize('Forex and Cryptocurrencies') },
        { key: 'leverage', title: localize('Leverage') },
        {
            key: 'spreadsFrom',
            title: localize('Spreads from'),
        },
        {
            key: 'verifications',
            title: localize('Verifications'),
            title_indicators: { type: 'displayIcons' },
            clickable_description: [
                { type: 'link', text: localize('Learn more') },
                { type: 'text', text: localize('about required verifications.') },
            ],
        },
        {
            key: 'regulator',
            title: localize('Regulator/EDR'),
            description: localize('Labuan Financial Services Authority (licence no. MB/18/0024)'),
        },
    ],
    financial_contents: [
        {
            key: 'assets',
            title: localize('Assets'),
            description: localize('Forex (standard/exotic) and cryptocurrencies'),
            title_indicators: {
                type: 'displayText',
                display_text: localize('80+'),
                display_text_skin_color: 'red-dark',
            },
        },
        {
            key: 'leverage',
            title: localize('Leverage'),
            title_indicators: {
                type: 'displayText',
                display_text: localize('1:100'),
                display_text_skin_color: 'yellow-dark',
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
            clickable_description: [
                { type: 'link', text: localize('Learn more') },
                { type: 'text', text: localize('about required verifications.') },
            ],
        },
        {
            key: 'regulator',
            title: localize('Regulator/EDR'),
            description: localize('Labuan Financial Services Authority (licence no. MB/18/0024)'),
        },
    ],
    synthetic_verification_docs: ['document_number', 'name_and_address'],
    financial_verification_docs: ['document_number', 'name_and_address'],
});
