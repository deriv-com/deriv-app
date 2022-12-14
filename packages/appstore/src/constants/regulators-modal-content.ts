import { localize } from '@deriv/translations';

export const cfd_content = [
    {
        id: 'cfds',
        attribute: localize('CFDs'),
        values: {
            non_eu_regulator: { text: localize('Yes') },
            eu_regulator: { text: localize('Yes') },
        },
    },
    {
        id: 'regulators',
        attribute: localize('Regulator/external dispute resolution'),
        values: {
            non_eu_regulator: {
                text: [
                    localize('Financial Commission'),
                    localize('British Virgin Islands Financial Services Commission'),
                    localize('Vanuatu Financial Services Commission'),
                    localize('Labuan Financial Services Authority'),
                ],
            },
            eu_regulator: { text: localize('Malta Financial Services Authority') },
        },
    },
    {
        id: 'counterparty_company',
        attribute: localize('Counterparty company'),
        values: {
            non_eu_regulator: {
                text: [
                    localize('Deriv (SVG) LLC'),
                    localize('Deriv (BVI) Ltd'),
                    localize('Deriv (V) Ltd'),
                    localize('Deriv (FX) Ltd'),
                ],
            },
            eu_regulator: { text: localize('Deriv Investments (Europe) Limited') },
        },
    },
    {
        id: 'negative_balance_protection',
        attribute: localize('Negative balance protection'),
        values: {
            non_eu_regulator: { text: localize('Synthetics only') },
            eu_regulator: { text: localize('All assets') },
        },
    },
    {
        id: 'leverage',
        attribute: localize('Leverage'),
        values: {
            non_eu_regulator: { text: '100-1000' },
            eu_regulator: { text: '30' },
        },
    },
    {
        id: 'assets',
        attribute: localize('Assets'),
        values: {
            non_eu_regulator: {
                text: [
                    localize('Synthetics'),
                    localize('Baskets'),
                    localize('Derived FX'),
                    localize('Forex'),
                    localize('Stocks'),
                    localize('Stock indices'),
                    localize('Commodities'),
                    localize('Cryptocurrencies'),
                ],
            },
            eu_regulator: {
                text: [
                    localize('Synthetics*'),
                    localize('Forex'),
                    localize('Stocks'),
                    localize('Stock indices'),
                    localize('Commodities'),
                    localize('Cryptocurrencies'),
                    localize('*Boom 300 and Crash 300 Index'),
                ],
            },
        },
    },
    {
        id: 'platform',
        attribute: localize('Platform'),
        values: {
            non_eu_regulator: { text: 'Deriv MT5, Deriv X' },
            eu_regulator: { text: 'Deriv MT5' },
        },
    },
];

export const options_content = [
    {
        id: 'options',
        attribute: localize('Options & Multipliers'),
        values: {
            non_eu_regulator: { text: localize('Options & Multipliers') },
            eu_regulator: { text: localize('Multipliers') },
        },
    },
    {
        id: 'regulator_in_options',
        attribute: localize('Regulator/external dispute resolution'),
        values: {
            non_eu_regulator: { text: localize('Financial Commission') },
            eu_regulator: { text: localize('Malta Financial Services Authority') },
        },
    },
    {
        id: 'counterparty_company_in_options',
        attribute: localize('Counterparty company'),
        values: {
            non_eu_regulator: { text: localize('Deriv (SVG) LLC') },
            eu_regulator: { text: localize('Deriv Investments (Europe) Limited') },
        },
    },
    {
        id: 'assets_in_options',
        attribute: localize('Assets'),
        values: {
            non_eu_regulator: {
                text: [
                    localize('Synthetics'),
                    localize('Baskets'),
                    localize('Forex'),
                    localize('Stocks'),
                    localize('Stock indices'),
                    localize('Commodities'),
                    localize('Cryptocurrencies'),
                ],
            },
            eu_regulator: {
                text: [
                    localize('Synthetics*'),
                    localize('Forex'),
                    localize('Cryptocurrencies'),
                    localize('*Boom 300 and Crash 300 Index'),
                ],
            },
        },
    },
    {
        id: 'platform_in_options',
        attribute: localize('Platform'),
        values: {
            non_eu_regulator: [localize('DTrader, DBot, SmartTrader, and Binary Bot')],
            eu_regulator: { text: 'DTrader' },
        },
    },
];
