import { TIconData, TAvailableCFDAccounts, TModifiedTradingPlatformAvailableAccount } from '../Components/props.types';

const getHighlightedIconLabel = (trading_platforms: TModifiedTradingPlatformAvailableAccount): TIconData[] => {
    switch (trading_platforms.market_type) {
        case 'gaming':
            return [
                { icon: 'Synthetics', text: 'Synthetics', highlighted: true },
                { icon: 'BasketIndices', text: 'Basket Indices', highlighted: true },
                { icon: 'DerivedFX', text: 'Derived FX', highlighted: true },
                { icon: 'Stocks', text: 'Stock', highlighted: false },
                { icon: 'StockIndices', text: 'Stock Indices', highlighted: false },
                { icon: 'Commodities', text: 'Commodities', highlighted: false },
                { icon: 'Forex', text: 'Forex', highlighted: false },
                { icon: 'Cryptocurrencies', text: 'Cryptocurrencies', highlighted: false },
                { icon: 'ETF', text: 'ETF', highlighted: false },
            ];
        case 'financial':
            return [
                { icon: 'Synthetics', text: 'Synthetics', highlighted: false },
                { icon: 'BasketIndices', text: 'Basket Indices', highlighted: false },
                { icon: 'DerivedFX', text: 'Derived FX', highlighted: false },
                { icon: 'Stocks', text: 'Stock', highlighted: true },
                { icon: 'StockIndices', text: 'Stock Indices', highlighted: true },
                { icon: 'Commodities', text: 'Commodities', highlighted: true },
                { icon: 'Forex', text: 'Forex', highlighted: true },
                { icon: 'Cryptocurrencies', text: 'Cryptocurrencies', highlighted: true },
                { icon: 'ETF', text: 'ETF', highlighted: true },
            ];
        case 'all':
        default:
            return [
                { icon: 'Synthetics', text: 'Synthetics', highlighted: true },
                { icon: 'BasketIndices', text: 'Basket Indices', highlighted: true },
                { icon: 'DerivedFX', text: 'Derived FX', highlighted: true },
                { icon: 'Stocks', text: 'Stock', highlighted: true },
                { icon: 'StockIndices', text: 'Stock Indices', highlighted: true },
                { icon: 'Commodities', text: 'Commodities', highlighted: true },
                { icon: 'Forex', text: 'Forex', highlighted: true },
                { icon: 'Cryptocurrencies', text: 'Cryptocurrencies', highlighted: true },
                { icon: 'ETF', text: 'ETF', highlighted: true },
            ];
    }
};
const getAccountCardTitle = (shortcode: string) => {
    switch (shortcode) {
        case 'synthetic_svg':
            return 'Derived - SVG';
        case 'synthetic_bvi':
            return 'Derived - BVI';
        case 'synthetic_vanuatu':
            return 'Derived - Vanuatu';
        case 'financial_svg':
            return 'Financial - SVG';
        case 'financial_bvi':
            return 'Financial - BVI';
        case 'financial_vanuatu':
            return 'Financial - Vanuatu';
        case 'financial_labuan':
            return 'Financial - Labuan';
        case 'all_svg':
            return 'Swap-Free - SVG';
        case 'dxtrade':
            return 'Deriv X';
        default:
            return 'CFDs';
    }
};

const getPlatformLabel = (shortcode: string) => {
    switch (shortcode) {
        case 'dxtrade':
            return 'Other CFDs';
        case 'synthetic':
        case 'financial':
        case 'mt5':
        default:
            return 'MT5 Platform';
    }
};

const platfromsHeaderLabel = {
    mt5: 'MT5 Platform',
    other_cfds: 'Other CFDs',
};

const getAccountIcon = (shortcode: string) => {
    switch (shortcode) {
        case 'synthetic':
            return 'Derived';
        case 'financial':
            return 'Financial';
        case 'all':
            return 'SwapFree';
        case 'dxtrade':
            return 'DerivX';
        default:
            return 'CFDs';
    }
};

const getMarketType = (trading_platforms: TModifiedTradingPlatformAvailableAccount) => {
    return trading_platforms.market_type === 'gaming' ? 'synthetic' : trading_platforms.market_type;
};

const getHeaderColor = (shortcode: string) => {
    switch (shortcode) {
        case 'MT5 Platform':
            return 'blue';
        case 'Other CFDs':
            return 'green';
        default:
            return 'blue';
    }
};

const cfdConfig = {
    leverage: '1:1000',
    leverage_description: 'Maximum Leverage',
    spread: '0.5 pips',
    spread_description: 'Spread from',
    counterparty_company: 'Deriv (SVG) LLC',
    counterparty_company_description: 'Counterparty company',
    jurisdiction: 'St. Vincent & Grenadines',
    jurisdiction_description: 'Jurisdiction',
    regulator: 'Financial Commission',
    regulator_description: 'Regulator/External dispute resolution',
};
const getJuridisctionDescription = (shortcode: string) => {
    switch (shortcode) {
        case 'synthetic_svg':
            return {
                ...cfdConfig,
                counterparty_company: 'Deriv (SVG) LLC',
                jurisdiction: 'St. Vincent & Grenadines',
                jurisdiction_description: 'Jurisdiction',
                regulator: 'Financial Commission',
                regulator_description: 'Regulator/External dispute resolution',
            };
        case 'synthetic_bvi':
            return {
                ...cfdConfig,
                counterparty_company: 'Deriv (BVI) Ltd',
                jurisdiction: 'British Virgin Islands',
                jurisdiction_description: 'Jurisdiction',
                regulator: 'British Virgin Islands Financial Services Commission',
                regulator_description: '(License no. SIBA/L/18/1114) Regulator/External dispute Resolution',
            };
        case 'synthetic_vanuatu':
            return {
                ...cfdConfig,
                counterparty_company: 'Deriv (V) Ltd',
                jurisdiction: 'Vanuatu',
                jurisdiction_description: 'Jurisdiction',
                regulator: 'Vanuatu Financial Services Commission',
                regulator_description: 'Regulator/External dispute resolution',
            };
        case 'financial_svg':
            return {
                ...cfdConfig,
                counterparty_company: 'Deriv (SVG) LLC',
                jurisdiction: 'St. Vincent & Grenadines',
                jurisdiction_description: 'Jurisdiction',
                regulator: 'Financial Commission',
                regulator_description: 'Regulator/External dispute resolution',
            };
        case 'financial_bvi':
            return {
                ...cfdConfig,
                counterparty_company: 'Deriv (BVI) Ltd',
                jurisdiction: 'British Virgin Islands',
                jurisdiction_description: 'Jurisdiction',
                regulator: 'British Virgin Islands Financial Services Commission',
                regulator_description: '(License no. SIBA/L/18/1114) Regulator/External Dispute Resolution',
            };
        case 'financial_vanuatu':
            return {
                ...cfdConfig,
                counterparty_company: 'Deriv (V) Ltd',
                jurisdiction: 'Vanuatu',
                jurisdiction_description: 'Jurisdiction',
                regulator: 'Vanuatu Financial Services Commission',
                regulator_description: 'Regulator/External Dispute Resolution',
            };
        case 'financial_labuan':
            return {
                ...cfdConfig,
                leverage: '1:100',
                counterparty_company: 'Deriv (FX) Ltd',
                jurisdiction: 'Labuan',
                jurisdiction_description: 'Jurisdiction',
                regulator: 'Labuan Financial Services Authority',
                regulator_description: '(licence no. MB/18/0024) Regulator/External Dispute Resolution',
            };
        // Dxtrade
        case 'all_':
        case 'all_svg':
            return {
                ...cfdConfig,
                counterparty_company: 'Deriv (SVG) LLC',
                jurisdiction: 'St. Vincent & Grenadines',
                jurisdiction_description: 'Jurisdiction',
                regulator: 'Financial Commission',
                regulator_description: 'Regulator/External dispute resolution',
            };
        default:
            return cfdConfig;
    }
};

// Sort the MT5 accounts in the order of derived, financial and swap-free
const getSortedAvailableAccounts = (available_accounts: TModifiedTradingPlatformAvailableAccount[]) => {
    const swap_free_accounts = available_accounts
        .filter(item => item.market_type === 'all')
        .map(item => ({ ...item, platform: 'mt5' } as const));
    const financial_accounts = available_accounts
        .filter(item => item.market_type === 'financial')
        .map(item => ({ ...item, platform: 'mt5' } as const));
    const gaming_accounts = available_accounts
        .filter(item => item.market_type === 'gaming')
        .map(item => ({ ...item, platform: 'mt5' } as const));
    return [...gaming_accounts, ...financial_accounts, ...swap_free_accounts];
};
const getDxtradeAccountAvailabaility = (available_accounts: TAvailableCFDAccounts[]) => {
    return available_accounts.some(account => account.platform === 'dxtrade');
};

const prepareDxtradeData = (
    name: string,
    market_type: TModifiedTradingPlatformAvailableAccount['market_type']
): TModifiedTradingPlatformAvailableAccount => {
    return {
        // linkable_landing_companies:,
        market_type,
        name,
        requirements: {
            after_first_deposit: {
                financial_assessment: [''],
            },
            compliance: {
                mt5: [''],
                tax_information: [''],
            },
            signup: [''],
        },
        shortcode: 'bvi',
        sub_account_type: '',
        platform: 'dxtrade',
    };
};

export {
    getHighlightedIconLabel,
    cfdConfig,
    getJuridisctionDescription,
    getAccountCardTitle,
    getMarketType,
    getAccountIcon,
    getPlatformLabel,
    getSortedAvailableAccounts,
    getDxtradeAccountAvailabaility,
    prepareDxtradeData,
    getHeaderColor,
    platfromsHeaderLabel,
};
