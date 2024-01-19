/* eslint-disable sort-keys */
export type TRowItem = {
    options?: Record<string, boolean | string>;
    text: string;
};
type TRegulatorContent = Record<string, TRowItem | TRowItem[] | undefined>;

export type TRegulatorsContentProps = {
    attribute: string;
    content: TRegulatorContent;
    id: string;
};

export const getCFDContents = (): TRegulatorsContentProps[] => [
    {
        attribute: 'CFDs',
        content: {
            nonEuRegulator: { text: 'Yes' },
            euRegulator: { text: 'Yes' },
        },
        id: 'cfds',
    },
    {
        attribute: 'Regulators/external dispute resolution',
        content: {
            nonEuRegulator: [
                { text: 'Financial Commission' },
                { text: 'British Virgin Islands Financial Services Commission' },
                { text: 'Vanuatu Financial Services Commission' },
                { text: 'Labuan Financial Services Authority' },
            ],
            euRegulator: { text: 'Malta Financial Services Authority' },
        },
        id: 'regulators',
    },
    {
        attribute: 'Counterparty company',
        content: {
            nonEuRegulator: [
                { text: 'Deriv (SVG) LLC' },
                { text: 'Deriv (BVI) Ltd' },
                { text: 'Deriv (V) Ltd' },
                { text: 'Deriv (FX) Ltd' },
            ],
            euRegulator: { text: 'Deriv Investments (Europe) Limited' },
        },
        id: 'counterparty_company',
    },
    {
        attribute: 'Negative balance protection',
        content: {
            nonEuRegulator: { text: 'Synthetics only' },
            euRegulator: { text: 'All assets' },
        },
        id: 'negative_balance_protection',
    },
    {
        attribute: 'Leverage',
        content: {
            nonEuRegulator: { text: '100-1000' },
            euRegulator: { text: '30' },
        },
        id: 'leverage',
    },
    {
        attribute: 'Assets',
        content: {
            nonEuRegulator: [
                { text: 'Synthetics' },
                { text: 'Baskets' },
                { text: 'Derived FX' },
                { text: 'Forex' },
                { text: 'Stocks' },
                { text: 'Stock indices' },
                { text: 'Commodities' },
                { text: 'Cryptocurrencies' },
            ],
            euRegulator: [
                { options: { should_show_asterick_at_end: true }, text: 'Synthetics' },
                { text: 'Forex' },
                { text: 'Stocks' },
                { text: 'Stock indices' },
                { text: 'Commodities' },
                { text: 'Cryptocurrencies' },
                {
                    options: { color: 'error', weight: 'bold' },
                    text: '*Boom 300 and Crash 300 Index',
                },
                {
                    options: { color: 'error', weight: 'bold' },
                    text: '*Volatility 150 Index and Volatility 250 Index',
                },
            ],
        },
        id: 'assets',
    },
    {
        attribute: 'Platform',
        content: {
            nonEuRegulator: { text: 'Deriv MT5, Deriv X' },
            euRegulator: { text: 'Deriv MT5' },
        },
        id: 'platform',
    },
];

export const getOptionsContents = (): TRegulatorsContentProps[] => [
    {
        attribute: 'Options & Multipliers',
        content: {
            nonEuRegulator: { text: 'Yes' },
            euRegulator: { options: { weight: 'bold' }, text: 'Multipliers only' },
        },
        id: 'options',
    },
    {
        attribute: 'Regulators/external dispute resolution',
        content: {
            nonEuRegulator: { text: 'Financial Commission' },
            euRegulator: { text: 'Malta Financial Services Authority' },
        },
        id: 'regulator_in_options',
    },
    {
        attribute: 'Counterparty company',
        content: {
            nonEuRegulator: { text: 'Deriv (SVG) LLC' },
            euRegulator: { text: 'Deriv Investments (Europe) Limited' },
        },
        id: 'counterparty_company_in_options',
    },
    {
        attribute: 'Assets',
        content: {
            nonEuRegulator: [
                { text: 'Synthetics' },
                { text: 'Baskets' },
                { text: 'Forex' },
                { text: 'Stocks' },
                { text: 'Stock indices' },
                { text: 'Commodities' },
                { text: 'Cryptocurrencies' },
            ],
            euRegulator: [
                {
                    options: { should_show_asterick_at_end: true },
                    text: 'Synthetics',
                },
                { text: 'Forex' },
                { text: 'Cryptocurrencies' },
                {
                    options: { color: 'error', weight: 'bold' },
                    text: '*Boom 300 and Crash 300 Index',
                },
            ],
        },
        id: 'assets_in_options',
    },
    {
        attribute: 'Platform',
        content: {
            nonEuRegulator: { text: 'DTrader, DBot, SmartTrader, and Binary Bot' },
            euRegulator: { text: 'DTrader' },
        },
        id: 'platform_in_options',
    },
];
