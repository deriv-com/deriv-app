import { localize } from '@deriv/translations';
import { TJurisdictionCardItems, TJurisdictionCardParams } from 'Components/props.types';

export const getJurisdictionBviContents = ({
    toggleDynamicLeverage,
}: TJurisdictionCardParams): TJurisdictionCardItems => ({
    is_over_header_available: false,
    header: localize('British Virgin Islands'),
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
            clickable_description: [
                { type: 'link', text: localize('Learn more') },
                { type: 'text', text: localize('about required verifications.') },
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
            clickable_description: [
                { type: 'link', text: localize('Learn more') },
                { type: 'text', text: localize('about required verifications.') },
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
