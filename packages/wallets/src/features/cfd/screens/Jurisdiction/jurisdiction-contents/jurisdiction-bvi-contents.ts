import { localize } from '@deriv-com/translations';
import { TJurisdictionCardItems } from './props.types';

export const getJurisdictionBviContents = (): TJurisdictionCardItems => ({
    contents: {
        financial: [
            {
                description: localize(
                    'Forex (standard/micro), stocks, stock indices, commodities, cryptocurrencies and ETFs'
                ),
                key: 'assets',
                title: localize('Assets'),
                titleIndicators: {
                    displayText: localize('170+'),
                    displayTextSkinColor: 'red-light',
                    type: 'displayText',
                },
            },
            {
                clickableDescription: [
                    {
                        tag: 'dynamicLeverage',
                        text: localize('Dynamic Leverage'),
                        type: 'link',
                    },
                ],
                key: 'leverage',
                title: localize('Leverage up to'),
                titleIndicators: {
                    displayText: localize('1:1000'),
                    displayTextSkinColor: 'yellow-light',
                    type: 'displayText',
                },
            },
            {
                key: 'spreads-from',
                title: localize('Spreads from'),
                titleIndicators: {
                    displayText: localize('0.5 pips'),
                    displayTextSkinColor: 'violet-dark',
                    type: 'displayText',
                },
            },
            {
                clickableDescription: [
                    {
                        text: localize('Learn more'),
                        type: 'link',
                    },
                    {
                        text: localize('about verifications needed.'),
                        type: 'text',
                    },
                ],
                key: 'verifications',
                title: localize('Verifications'),
                titleIndicators: {
                    type: 'displayIcons',
                },
            },
            {
                description: localize(
                    'British Virgin Islands Financial Services Commission (License no. SIBA/L/18/1114)'
                ),
                key: 'regulator',
                title: localize('Regulator/EDR'),
            },
        ],
        synthetic: [
            {
                description: localize(
                    'Forex (standard), stock indices, commodities, cryptocurrencies, synthetic indices, basket indices and derived FX'
                ),
                key: 'assets',
                title: localize('Assets'),
                titleIndicators: {
                    displayText: localize('210+'),
                    displayTextSkinColor: 'red-darker',
                    type: 'displayText',
                },
            },
            {
                key: 'leverage',
                title: localize('Leverage up to'),
                titleIndicators: {
                    displayText: localize('1:1000'),
                    displayTextSkinColor: 'yellow-light',
                    type: 'displayText',
                },
            },
            {
                clickableDescription: [
                    {
                        text: localize('Learn more'),
                        type: 'link',
                    },
                    {
                        text: localize('about verifications needed.'),
                        type: 'text',
                    },
                ],
                key: 'verifications',
                title: localize('Verifications'),
                titleIndicators: {
                    type: 'displayIcons',
                },
            },
            {
                description: localize(
                    'British Virgin Islands Financial Services Commission (License no. SIBA/L/18/1114)'
                ),
                key: 'regulator',
                title: localize('Regulator/EDR'),
            },
        ],
    },
    header: localize('British Virgin Islands'),
    isOverHeaderAvailable: false,
    verificationDocs: {
        financial: ['documentNumber', 'nameAndAddress'],
        synthetic: ['documentNumber', 'nameAndAddress'],
    },
});
