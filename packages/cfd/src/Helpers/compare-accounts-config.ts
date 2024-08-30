import { localize } from '@deriv/translations';
import { TInstrumentsIcon, TModifiedTradingPlatformAvailableAccount, TProducts } from '../Components/props.types';
import { CFD_PLATFORMS, MARKET_TYPE, JURISDICTION, REGION, MARKET_TYPE_SHORTCODE, PRODUCT } from './cfd-config';

// Map the accounts according to the market type
const getHighlightedIconLabel = (
    trading_platforms: TModifiedTradingPlatformAvailableAccount,
    selected_region?: string
): TInstrumentsIcon[] => {
    const market_type = getMarketType(trading_platforms);
    const market_type_shortcode = market_type.concat('_', trading_platforms.shortcode ?? '');
    const getForexLabel = () => {
        if (selected_region === REGION.EU) {
            return localize('Forex');
        } else if (market_type_shortcode === MARKET_TYPE_SHORTCODE.FINANCIAL_LABUAN) {
            return localize('Forex: standard/exotic');
        } else if (
            (trading_platforms.platform === CFD_PLATFORMS.MT5 &&
                market_type_shortcode === MARKET_TYPE_SHORTCODE.ALL_SWAP_FREE_SVG) ||
            trading_platforms.platform === CFD_PLATFORMS.CTRADER
        ) {
            return localize('Forex: major/minor');
        } else if (
            market_type === MARKET_TYPE.SYNTHETIC ||
            market_type_shortcode === MARKET_TYPE_SHORTCODE.ALL_ZS_BVI
        ) {
            return localize('Forex: standard');
        }
        return localize('Forex: standard/micro');
    };

    switch (trading_platforms.market_type) {
        case MARKET_TYPE.GAMING:
            return [
                { icon: 'Forex', text: getForexLabel(), highlighted: true },
                { icon: 'Stocks', text: localize('Stocks'), highlighted: true },
                { icon: 'StockIndices', text: localize('Stock indices'), highlighted: true },
                { icon: 'Commodities', text: localize('Commodities'), highlighted: true },
                { icon: 'Cryptocurrencies', text: localize('Cryptocurrencies'), highlighted: true },
                { icon: 'ETF', text: localize('ETFs'), highlighted: true },
                { icon: 'Synthetics', text: localize('Synthetic indices'), highlighted: true },
                { icon: 'Baskets', text: localize('Basket indices'), highlighted: true },
                { icon: 'DerivedFX', text: localize('Derived FX'), highlighted: true },
            ];
        case MARKET_TYPE.FINANCIAL:
            switch (trading_platforms.shortcode) {
                case JURISDICTION.MALTA_INVEST:
                    return [
                        { icon: 'Forex', text: getForexLabel(), highlighted: true },
                        { icon: 'Stocks', text: localize('Stocks'), highlighted: true },
                        { icon: 'StockIndices', text: localize('Stock indices'), highlighted: true },
                        { icon: 'Commodities', text: localize('Commodities'), highlighted: true },
                        { icon: 'Cryptocurrencies', text: localize('Cryptocurrencies'), highlighted: true },
                        {
                            icon: 'Synthetics',
                            text: localize('Synthetic indices'),
                            highlighted: true,
                            is_asterisk: true,
                        },
                    ];
                case JURISDICTION.LABUAN:
                    return [
                        { icon: 'Forex', text: getForexLabel(), highlighted: true },
                        { icon: 'Stocks', text: localize('Stocks'), highlighted: false },
                        { icon: 'StockIndices', text: localize('Stock indices'), highlighted: false },
                        { icon: 'Commodities', text: localize('Commodities'), highlighted: false },
                        { icon: 'Cryptocurrencies', text: localize('Cryptocurrencies'), highlighted: true },
                        { icon: 'ETF', text: localize('ETFs'), highlighted: false },
                        { icon: 'Synthetics', text: localize('Synthetic indices'), highlighted: false },
                        { icon: 'Baskets', text: localize('Basket indices'), highlighted: false },
                        { icon: 'DerivedFX', text: localize('Derived FX'), highlighted: false },
                    ];
                default:
                    return [
                        { icon: 'Forex', text: getForexLabel(), highlighted: true },
                        { icon: 'Stocks', text: localize('Stocks'), highlighted: true },
                        { icon: 'StockIndices', text: localize('Stock indices'), highlighted: true },
                        { icon: 'Commodities', text: localize('Commodities'), highlighted: true },
                        { icon: 'Cryptocurrencies', text: localize('Cryptocurrencies'), highlighted: true },
                        { icon: 'ETF', text: localize('ETFs'), highlighted: true },
                        { icon: 'Synthetics', text: localize('Synthetic indices'), highlighted: false },
                        { icon: 'Baskets', text: localize('Basket indices'), highlighted: false },
                        { icon: 'DerivedFX', text: localize('Derived FX'), highlighted: false },
                    ];
            }
        case MARKET_TYPE.ALL:
        default:
            if (trading_platforms.platform === CFD_PLATFORMS.MT5) {
                if (trading_platforms.product === PRODUCT.SWAPFREE) {
                    return [
                        { icon: 'Forex', text: getForexLabel(), highlighted: true },
                        { icon: 'Stocks', text: localize('Stocks'), highlighted: true },
                        { icon: 'StockIndices', text: localize('Stock indices'), highlighted: true },
                        { icon: 'Commodities', text: localize('Commodities'), highlighted: true },
                        { icon: 'Cryptocurrencies', text: localize('Cryptocurrencies'), highlighted: true },
                        { icon: 'ETF', text: localize('ETFs'), highlighted: true },
                        { icon: 'Synthetics', text: localize('Synthetic indices'), highlighted: true },
                        { icon: 'Baskets', text: localize('Basket indices'), highlighted: false },
                        { icon: 'DerivedFX', text: localize('Derived FX'), highlighted: false },
                    ];
                } else if (trading_platforms.product === PRODUCT.ZEROSPREAD) {
                    return [
                        { icon: 'Forex', text: getForexLabel(), highlighted: true },
                        { icon: 'Stocks', text: localize('Stocks'), highlighted: false },
                        { icon: 'StockIndices', text: localize('Stock indices'), highlighted: true },
                        { icon: 'Commodities', text: localize('Commodities'), highlighted: true },
                        { icon: 'Cryptocurrencies', text: localize('Cryptocurrencies'), highlighted: true },
                        { icon: 'ETF', text: localize('ETFs'), highlighted: false },
                        { icon: 'Synthetics', text: localize('Synthetic indices'), highlighted: true },
                        { icon: 'Baskets', text: localize('Basket indices'), highlighted: true },
                        { icon: 'DerivedFX', text: localize('Derived FX'), highlighted: true },
                    ];
                }
            }

            return [
                { icon: 'Forex', text: getForexLabel(), highlighted: true },
                { icon: 'Stocks', text: localize('Stocks'), highlighted: true },
                { icon: 'StockIndices', text: localize('Stock indices'), highlighted: true },
                { icon: 'Commodities', text: localize('Commodities'), highlighted: true },
                { icon: 'Cryptocurrencies', text: localize('Cryptocurrencies'), highlighted: true },
                { icon: 'ETF', text: localize('ETFs'), highlighted: true },
                { icon: 'Synthetics', text: localize('Synthetic indices'), highlighted: true },
                { icon: 'Baskets', text: localize('Basket indices'), highlighted: true },
                { icon: 'DerivedFX', text: localize('Derived FX'), highlighted: true },
            ];
    }
};

// Get the Account Title according to the market type and jurisdiction
const getAccountCardTitle = (shortcode: string, is_demo?: boolean) => {
    switch (shortcode) {
        case MARKET_TYPE_SHORTCODE.SYNTHETIC_SVG:
            return is_demo ? localize('Standard Demo') : localize('Standard - SVG');
        case MARKET_TYPE_SHORTCODE.SYNTHETIC_BVI:
            return localize('Standard - BVI');
        case MARKET_TYPE_SHORTCODE.SYNTHETIC_VANUATU:
            return localize('Standard - Vanuatu');
        case MARKET_TYPE_SHORTCODE.FINANCIAL_SVG:
            return is_demo ? localize('Financial Demo') : localize('Financial - SVG');
        case MARKET_TYPE_SHORTCODE.FINANCIAL_BVI:
            return localize('Financial - BVI');
        case MARKET_TYPE_SHORTCODE.FINANCIAL_VANUATU:
            return localize('Financial - Vanuatu');
        case MARKET_TYPE_SHORTCODE.FINANCIAL_LABUAN:
            return localize('Financial - Labuan');
        case MARKET_TYPE_SHORTCODE.ALL_SWAP_FREE_SVG:
            return is_demo ? localize('Swap-Free Demo') : localize('Swap-Free - SVG');
        case MARKET_TYPE_SHORTCODE.ALL_ZERO_SPREAD_BVI:
            return is_demo ? localize('Zero Spread Demo') : localize('Zero Spread - BVI');
        case CFD_PLATFORMS.DXTRADE:
            return is_demo ? localize('Deriv X Demo') : localize('Deriv X');
        case CFD_PLATFORMS.CTRADER:
            return is_demo ? localize('Deriv cTrader Demo') : localize('Deriv cTrader');
        default:
            return is_demo ? localize('CFDs Demo') : localize('CFDs');
    }
};

// Get the Platform label
const getPlatformLabel = (shortcode?: string) => {
    switch (shortcode) {
        case CFD_PLATFORMS.DXTRADE:
        case CFD_PLATFORMS.CFDS:
            return localize('Other CFDs Platform');
        case CFD_PLATFORMS.CTRADER:
            return localize('Deriv cTrader');
        case CFD_PLATFORMS.MT5:
        default:
            return localize('MT5 Platform');
    }
};

// Object to map the platform label
const platformsHeaderLabel = {
    mt5: localize('MT5 Platform'),
    ctrader: localize('Deriv cTrader'),
    other_cfds: localize('Other CFDs Platform'),
};

// Get the Account Icons based on the market type
const getAccountIcon = (shortcode: string, product?: TProducts) => {
    switch (shortcode) {
        case MARKET_TYPE.SYNTHETIC:
            return 'Standard';
        case MARKET_TYPE.FINANCIAL:
            return 'Financial';
        case MARKET_TYPE.ALL:
            switch (product) {
                case PRODUCT.ZEROSPREAD:
                    return 'ZeroSpread';
                case PRODUCT.SWAPFREE:
                default:
                    return 'SwapFree';
            }
        case CFD_PLATFORMS.DXTRADE:
            return 'DerivX';
        case CFD_PLATFORMS.CTRADER:
            return 'CTrader';
        default:
            return 'CFDs';
    }
};

// Convert the market type from gaming to synthethics
const getMarketType = (trading_platforms: TModifiedTradingPlatformAvailableAccount) => {
    return trading_platforms.market_type === MARKET_TYPE.GAMING ? MARKET_TYPE.SYNTHETIC : trading_platforms.market_type;
};

// Get the color of Header based on the platform
const getHeaderColor = (shortcode: string) => {
    switch (shortcode) {
        case platformsHeaderLabel.other_cfds:
        case platformsHeaderLabel.ctrader:
            return 'green';
        case platformsHeaderLabel.mt5:
        default:
            return 'blue';
    }
};

// Config for different Jurisdictions
const cfd_config = () => ({
    leverage: '1:1000',
    leverage_description: localize('Maximum leverage'),
    spread: '0.5 pips',
    spread_description: localize('Spreads from'),
    counterparty_company: 'Deriv (SVG) LLC',
    counterparty_company_description: localize('Counterparty company'),
    jurisdiction: 'St. Vincent & Grenadines',
    jurisdiction_description: localize('Jurisdiction'),
    regulator: localize('Financial Commission'),
    regulator_description: localize('Regulator/External dispute resolution'),
    regulator_license: '',
});

// Map the Jurisdictions with the config
const getJuridisctionDescription = (shortcode: string) => {
    const createDescription = (
        counterparty_company: string,
        jurisdiction: string,
        regulator: string,
        regulator_license: string | undefined,
        regulator_description: string,
        leverage: string = cfd_config().leverage,
        spread: string = cfd_config().spread
    ) => ({
        ...cfd_config(),
        counterparty_company,
        jurisdiction,
        regulator,
        regulator_license,
        regulator_description,
        leverage,
        spread,
    });

    switch (shortcode) {
        case MARKET_TYPE_SHORTCODE.SYNTHETIC_BVI:
        case MARKET_TYPE_SHORTCODE.FINANCIAL_BVI:
            return createDescription(
                'Deriv (BVI) Ltd',
                'British Virgin Islands',
                localize('British Virgin Islands Financial Services Commission'),
                localize('(License no. SIBA/L/18/1114)'),
                localize('Regulator/External dispute resolution'),
                cfd_config().leverage,
                shortcode === MARKET_TYPE_SHORTCODE.SYNTHETIC_BVI ? '0.1 pips' : '0.2 pips'
            );
        case MARKET_TYPE_SHORTCODE.ALL_ZERO_SPREAD_BVI:
            return createDescription(
                'Deriv (BVI) Ltd',
                'British Virgin Islands',
                localize('British Virgin Islands Financial Services Commission'),
                localize('(License no. SIBA/L/18/1114)'),
                localize('Regulator/External dispute resolution'),
                '1:1000',
                '0.0 pips'
            );
        case MARKET_TYPE_SHORTCODE.SYNTHETIC_VANUATU:
        case MARKET_TYPE_SHORTCODE.FINANCIAL_VANUATU:
            return createDescription(
                'Deriv (V) Ltd',
                'Vanuatu',
                localize('Vanuatu Financial Services Commission'),
                '',
                localize('Regulator/External dispute resolution'),
                cfd_config().leverage,
                shortcode === MARKET_TYPE_SHORTCODE.SYNTHETIC_VANUATU ? '0.1 pips' : '0.2 pips'
            );
        case MARKET_TYPE_SHORTCODE.FINANCIAL_LABUAN:
            return createDescription(
                'Deriv (FX) Ltd',
                'Labuan',
                localize('Labuan Financial Services Authority'),
                localize('(licence no. MB/18/0024)'),
                localize('Regulator/External dispute resolution'),
                '1:100',
                '0.6 pips'
            );
        case MARKET_TYPE_SHORTCODE.FINANCIAL_MALTA_INVEST:
            return createDescription(
                'Deriv Investments (Europe) Limited',
                'Malta',
                localize('Financial Commission'),
                localize('Regulated by the Malta Financial Services Authority (MFSA) (licence no. IS/70156)'),
                '',
                '1:30'
            );
        case MARKET_TYPE_SHORTCODE.SYNTHETIC_SVG:
            return { ...cfd_config(), spread: '0.1 pips' };
        case MARKET_TYPE_SHORTCODE.FINANCIAL_SVG:
            return { ...cfd_config(), spread: '0.2 pips' };
        case MARKET_TYPE_SHORTCODE.ALL_SWAP_FREE_SVG:
            return { ...cfd_config(), spread: '0.3 pips' };
        case MARKET_TYPE_SHORTCODE.ALL_DXTRADE:
        default:
            return cfd_config();
    }
};

// Sort the MT5 accounts in the order of derived, financial and swap-free
const getSortedCFDAvailableAccounts = (available_accounts: TModifiedTradingPlatformAvailableAccount[]) => {
    const swap_free_accounts = available_accounts
        .filter(item => item.market_type === MARKET_TYPE.ALL && item.product === PRODUCT.SWAPFREE)
        .map(item => ({ ...item, platform: CFD_PLATFORMS.MT5 } as const));
    const zero_spread_accounts = available_accounts
        .filter(item => item.market_type === MARKET_TYPE.ALL && item.product === PRODUCT.ZEROSPREAD)
        .map(item => ({ ...item, platform: CFD_PLATFORMS.MT5 } as const));
    const financial_accounts = available_accounts
        .filter(item => item.market_type === MARKET_TYPE.FINANCIAL && item.shortcode !== JURISDICTION.MALTA_INVEST)
        .map(item => ({ ...item, platform: CFD_PLATFORMS.MT5 } as const));
    const gaming_accounts = available_accounts
        .filter(item => item.market_type === MARKET_TYPE.GAMING)
        .map(item => ({ ...item, platform: CFD_PLATFORMS.MT5 } as const));
    return [...gaming_accounts, ...financial_accounts, ...swap_free_accounts, ...zero_spread_accounts];
};

// Get the maltainvest accounts for EU and DIEL clients
const getEUAvailableAccounts = (available_accounts: TModifiedTradingPlatformAvailableAccount[]) => {
    const financial_accounts = available_accounts
        .filter(item => item.market_type === MARKET_TYPE.FINANCIAL && item.shortcode === JURISDICTION.MALTA_INVEST)
        .map(item => ({ ...item, platform: CFD_PLATFORMS.MT5 } as const));
    return [...financial_accounts];
};

// Make the Deriv X data same as trading_platform_available_accounts
const dxtrade_data: TModifiedTradingPlatformAvailableAccount = {
    market_type: MARKET_TYPE.ALL,
    name: 'Deriv X',
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
    shortcode: JURISDICTION.SVG,
    sub_account_type: '',
    platform: CFD_PLATFORMS.DXTRADE,
    product: PRODUCT.DERIVX,
};

const ctrader_data: TModifiedTradingPlatformAvailableAccount = {
    market_type: MARKET_TYPE.ALL,
    name: 'cTrader',
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
    shortcode: JURISDICTION.SVG,
    sub_account_type: '',
    platform: CFD_PLATFORMS.CTRADER,
    product: 'ctrader',
};

// Get the MT5 demo accounts of the user
const getMT5DemoData = (available_accounts: TModifiedTradingPlatformAvailableAccount[]) => {
    const swap_free_demo_accounts = available_accounts.filter(
        item =>
            item.market_type === MARKET_TYPE.ALL &&
            item.shortcode === JURISDICTION.SVG &&
            item.product === PRODUCT.SWAPFREE &&
            item.platform === CFD_PLATFORMS.MT5
    );
    const zero_spread_demo_accounts = available_accounts.filter(
        item =>
            item.market_type === MARKET_TYPE.ALL &&
            item.shortcode === JURISDICTION.BVI &&
            item.product === PRODUCT.ZEROSPREAD &&
            item.platform === CFD_PLATFORMS.MT5
    );
    const financial_demo_accounts = available_accounts.filter(
        item => item.market_type === MARKET_TYPE.FINANCIAL && item.shortcode === JURISDICTION.SVG
    );
    const gaming_demo_accounts = available_accounts.filter(
        item => item.market_type === MARKET_TYPE.GAMING && item.shortcode === JURISDICTION.SVG
    );
    return [
        ...gaming_demo_accounts,
        ...financial_demo_accounts,
        ...swap_free_demo_accounts,
        ...zero_spread_demo_accounts,
    ];
};
const getDxtradeDemoData = (available_accounts: TModifiedTradingPlatformAvailableAccount[]) => {
    return available_accounts.filter(item => item.platform === CFD_PLATFORMS.DXTRADE);
};

const getCtraderDemoData = (available_accounts: TModifiedTradingPlatformAvailableAccount[]) => {
    return available_accounts.filter(item => item.platform === CFD_PLATFORMS.CTRADER);
};

export {
    getHighlightedIconLabel,
    getJuridisctionDescription,
    getAccountCardTitle,
    getMarketType,
    getAccountIcon,
    getPlatformLabel,
    getSortedCFDAvailableAccounts,
    getEUAvailableAccounts,
    dxtrade_data,
    ctrader_data,
    getHeaderColor,
    platformsHeaderLabel,
    getMT5DemoData,
    getDxtradeDemoData,
    getCtraderDemoData,
};
