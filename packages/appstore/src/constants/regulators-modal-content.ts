import { localize } from '@deriv/translations';

export type TRowItem = {
    text: string;
    options?: Record<string, string | boolean>;
};
type TRegulatorContent = Record<string, TRowItem | TRowItem[] | undefined>;

export type TRegulatorsContentProps = {
    id: string;
    attribute: string;
    content: TRegulatorContent;
};

export const cfd_content: TRegulatorsContentProps[] = [
    {
        id: 'cfds',
        attribute: localize('CFDs'),
        content: {
            non_eu_regulator: { text: localize('Yes') },
            eu_regulator: { text: localize('Yes') },
        },
    },
    {
        id: 'regulators',
        attribute: localize('Regulators/external dispute resolution'),
        content: {
            non_eu_regulator: [
                { text: localize('Financial Commission') },
                { text: localize('British Virgin Islands Financial Services Commission') },
                { text: localize('Vanuatu Financial Services Commission') },
                { text: localize('Labuan Financial Services Authority') },
            ],
            eu_regulator: { text: localize('Malta Financial Services Authority') },
        },
    },
    {
        id: 'counterparty_company',
        attribute: localize('Counterparty company'),
        content: {
            non_eu_regulator: [
                { text: localize('Deriv (SVG) LLC') },
                { text: localize('Deriv (BVI) Ltd') },
                { text: localize('Deriv (V) Ltd') },
                { text: localize('Deriv (FX) Ltd') },
            ],
            eu_regulator: { text: localize('Deriv Investments (Europe) Limited') },
        },
    },
    {
        id: 'negative_balance_protection',
        attribute: localize('Negative balance protection'),
        content: {
            non_eu_regulator: { text: localize('Synthetics only') },
            eu_regulator: { text: localize('All assets') },
        },
    },
    {
        id: 'leverage',
        attribute: localize('Leverage'),
        content: {
            non_eu_regulator: { text: '100-1000' },
            eu_regulator: { text: '30' },
        },
    },
    {
        id: 'assets',
        attribute: localize('Assets'),
        content: {
            non_eu_regulator: [
                { text: localize('Synthetics') },
                { text: localize('Baskets') },
                { text: localize('Derived FX') },
                { text: localize('Forex') },
                { text: localize('Stocks') },
                { text: localize('Stock indices') },
                { text: localize('Commodities') },
                { text: localize('Cryptocurrencies') },
            ],
            eu_regulator: [
                { text: localize('Synthetics'), options: { should_show_asterick_at_end: true } },
                { text: localize('Forex') },
                { text: localize('Stocks') },
                { text: localize('Stock indices') },
                { text: localize('Commodities') },
                { text: localize('Cryptocurrencies') },
                {
                    text: localize('*Boom 300 and Crash 300 Index'),
                    options: { color: 'loss-danger', weight: 'bold' },
                },
                {
                    text: localize('*Volatility 150 Index and Volatility 250 Index'),
                    options: { color: 'loss-danger', weight: 'bold' },
                },
            ],
        },
    },
    {
        id: 'platform',
        attribute: localize('Platform'),
        content: {
            non_eu_regulator: { text: localize('Deriv MT5, Deriv X') },
            eu_regulator: { text: localize('Deriv MT5') },
        },
    },
];

export const options_content: TRegulatorsContentProps[] = [
    {
        id: 'options',
        attribute: localize('Options & Multipliers'),
        content: {
            non_eu_regulator: { text: localize('Yes') },
            eu_regulator: { text: localize('Multipliers only'), options: { weight: 'bold' } },
        },
    },
    {
        id: 'regulator_in_options',
        attribute: localize('Regulators/external dispute resolution'),
        content: {
            non_eu_regulator: { text: localize('Financial Commission') },
            eu_regulator: { text: localize('Malta Financial Services Authority') },
        },
    },
    {
        id: 'counterparty_company_in_options',
        attribute: localize('Counterparty company'),
        content: {
            non_eu_regulator: { text: localize('Deriv (SVG) LLC') },
            eu_regulator: { text: localize('Deriv Investments (Europe) Limited') },
        },
    },
    {
        id: 'assets_in_options',
        attribute: localize('Assets'),
        content: {
            non_eu_regulator: [
                { text: localize('Synthetics') },
                { text: localize('Baskets') },
                { text: localize('Forex') },
                { text: localize('Stocks') },
                { text: localize('Stock indices') },
                { text: localize('Commodities') },
                { text: localize('Cryptocurrencies') },
            ],
            eu_regulator: [
                {
                    text: localize('Synthetics'),
                    options: { should_show_asterick_at_end: true },
                },
                { text: localize('Forex') },
                { text: localize('Cryptocurrencies') },
                {
                    text: localize('*Boom 300 and Crash 300 Index'),
                    options: { color: 'loss-danger', weight: 'bold' },
                },
            ],
        },
    },
    {
        id: 'platform_in_options',
        attribute: localize('Platform'),
        content: {
            non_eu_regulator: { text: localize('DTrader, DBot, SmartTrader, and Binary Bot') },
            eu_regulator: { text: localize('DTrader') },
        },
    },
];
