import { localize } from '@deriv/translations';
import {
    TInstrumentsIcon,
    TModifiedTradingPlatformAvailableAccount,
    TDetailsOfEachMT5Loginid,
} from '../Components/props.types';
import { CFD_PLATFORMS, MARKET_TYPE, CATEGORY, JURISDICTION, REGION, MARKET_TYPE_SHORTCODE } from './cfd-config';

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
                market_type_shortcode === MARKET_TYPE_SHORTCODE.ALL_SVG) ||
            trading_platforms.platform === CFD_PLATFORMS.CTRADER
        ) {
            return localize('Forex: major/minor');
        }
        return localize('Forex: standard/micro');
    };

    switch (trading_platforms.market_type) {
        case MARKET_TYPE.GAMING:
            return [
                { icon: 'Forex', text: getForexLabel(), highlighted: false },
                { icon: 'Stocks', text: localize('Stocks'), highlighted: false },
                { icon: 'StockIndices', text: localize('Stock indices'), highlighted: false },
                { icon: 'Commodities', text: localize('Commodities'), highlighted: false },
                { icon: 'Cryptocurrencies', text: localize('Cryptocurrencies'), highlighted: false },
                { icon: 'ETF', text: localize('ETFs'), highlighted: false },
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
            return is_demo ? localize('Derived Demo') : localize('Derived - SVG');
        case MARKET_TYPE_SHORTCODE.SYNTHETIC_BVI:
            return localize('Derived - BVI');
        case MARKET_TYPE_SHORTCODE.SYNTHETIC_VANUATU:
            return localize('Derived - Vanuatu');
        case MARKET_TYPE_SHORTCODE.FINANCIAL_SVG:
            return is_demo ? localize('Financial Demo') : localize('Financial - SVG');
        case MARKET_TYPE_SHORTCODE.FINANCIAL_BVI:
            return localize('Financial - BVI');
        case MARKET_TYPE_SHORTCODE.FINANCIAL_VANUATU:
            return localize('Financial - Vanuatu');
        case MARKET_TYPE_SHORTCODE.FINANCIAL_LABUAN:
            return localize('Financial - Labuan');
        case MARKET_TYPE_SHORTCODE.ALL_SVG:
            return is_demo ? localize('Swap-Free Demo') : localize('Swap-Free - SVG');
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
const getAccountIcon = (shortcode: string) => {
    switch (shortcode) {
        case MARKET_TYPE.SYNTHETIC:
            return 'Derived';
        case MARKET_TYPE.FINANCIAL:
            return 'Financial';
        case MARKET_TYPE.ALL:
            return 'SwapFree';
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
        leverage: string = cfd_config().leverage
    ) => ({
        ...cfd_config(),
        counterparty_company,
        jurisdiction,
        regulator,
        regulator_license,
        regulator_description,
        leverage,
    });

    switch (shortcode) {
        case MARKET_TYPE_SHORTCODE.SYNTHETIC_BVI:
        case MARKET_TYPE_SHORTCODE.FINANCIAL_BVI:
            return createDescription(
                'Deriv (BVI) Ltd',
                'British Virgin Islands',
                localize('British Virgin Islands Financial Services Commission'),
                localize('(License no. SIBA/L/18/1114)'),
                localize('Regulator/External dispute resolution')
            );
        case MARKET_TYPE_SHORTCODE.SYNTHETIC_VANUATU:
        case MARKET_TYPE_SHORTCODE.FINANCIAL_VANUATU:
            return createDescription(
                'Deriv (V) Ltd',
                'Vanuatu',
                localize('Vanuatu Financial Services Commission'),
                '',
                localize('Regulator/External dispute resolution')
            );
        case MARKET_TYPE_SHORTCODE.FINANCIAL_LABUAN:
            return createDescription(
                'Deriv (FX) Ltd',
                'Labuan',
                localize('Labuan Financial Services Authority'),
                localize('(licence no. MB/18/0024)'),
                localize('Regulator/External dispute resolution'),
                '1:100'
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
        // Dxtrade
        case MARKET_TYPE_SHORTCODE.ALL_DXTRADE:
        case MARKET_TYPE_SHORTCODE.ALL_SVG:
        case MARKET_TYPE_SHORTCODE.SYNTHETIC_SVG:
        case MARKET_TYPE_SHORTCODE.FINANCIAL_SVG:
        default:
            return cfd_config();
    }
};

// Sort the MT5 accounts in the order of derived, financial and swap-free
const getSortedCFDAvailableAccounts = (available_accounts: TModifiedTradingPlatformAvailableAccount[]) => {
    const swap_free_accounts = available_accounts
        .filter(item => item.market_type === MARKET_TYPE.ALL)
        .map(item => ({ ...item, platform: CFD_PLATFORMS.MT5 } as const));
    const financial_accounts = available_accounts
        .filter(item => item.market_type === MARKET_TYPE.FINANCIAL && item.shortcode !== JURISDICTION.MALTA_INVEST)
        .map(item => ({ ...item, platform: CFD_PLATFORMS.MT5 } as const));
    const gaming_accounts = available_accounts
        .filter(item => item.market_type === MARKET_TYPE.GAMING)
        .map(item => ({ ...item, platform: CFD_PLATFORMS.MT5 } as const));
    return [...gaming_accounts, ...financial_accounts, ...swap_free_accounts];
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
};

// Check whether the POA POI status are completed for different jurisdictions
const getAccountVerficationStatus = (
    market_type_shortcode: string,
    poi_or_poa_not_submitted: boolean,
    poi_acknowledged_for_vanuatu_maltainvest: boolean,
    poi_acknowledged_for_bvi_labuan: boolean,
    poa_acknowledged: boolean,
    poa_pending: boolean,
    should_restrict_bvi_account_creation: boolean,
    should_restrict_vanuatu_account_creation: boolean,
    has_submitted_personal_details: boolean,
    is_demo?: boolean
) => {
    switch (market_type_shortcode) {
        case MARKET_TYPE_SHORTCODE.ALL_SVG:
        case MARKET_TYPE_SHORTCODE.SYNTHETIC_SVG:
        case MARKET_TYPE_SHORTCODE.FINANCIAL_SVG:
            return true;
        case MARKET_TYPE_SHORTCODE.SYNTHETIC_BVI:
        case MARKET_TYPE_SHORTCODE.FINANCIAL_BVI:
            if (
                poi_acknowledged_for_bvi_labuan &&
                !poi_or_poa_not_submitted &&
                !should_restrict_bvi_account_creation &&
                has_submitted_personal_details &&
                poa_acknowledged
            ) {
                return true;
            }
            return false;
        case MARKET_TYPE_SHORTCODE.SYNTHETIC_VANUATU:
        case MARKET_TYPE_SHORTCODE.FINANCIAL_VANUATU:
            if (
                poi_acknowledged_for_vanuatu_maltainvest &&
                !poi_or_poa_not_submitted &&
                !should_restrict_vanuatu_account_creation &&
                has_submitted_personal_details &&
                poa_acknowledged
            ) {
                return true;
            }
            return false;

        case MARKET_TYPE_SHORTCODE.FINANCIAL_LABUAN:
            if (poi_acknowledged_for_bvi_labuan && poa_acknowledged && has_submitted_personal_details) {
                return true;
            }
            return false;

        case MARKET_TYPE_SHORTCODE.FINANCIAL_MALTA_INVEST:
            if ((poi_acknowledged_for_vanuatu_maltainvest && poa_acknowledged) || is_demo) {
                return true;
            }
            return false;
        default:
            return false;
    }
};

// Check what MT5 accounts are added based on jurisdisction
const isMt5AccountAdded = (current_list: Record<string, TDetailsOfEachMT5Loginid>, item: string, is_demo?: boolean) =>
    Object.entries(current_list).some(([key, value]) => {
        const [market, type] = item.split('_');
        const current_account_type = is_demo ? CATEGORY.DEMO : CATEGORY.REAL;
        return (
            value.market_type === market &&
            value.landing_company_short === type &&
            value.account_type === current_account_type &&
            key.includes(CFD_PLATFORMS.MT5)
        );
    });

const isDxtradeAccountAdded = (current_list: Record<string, TDetailsOfEachMT5Loginid>, is_demo?: boolean) =>
    Object.entries(current_list).some(([key, value]) => {
        const current_account_type = is_demo ? CATEGORY.DEMO : CATEGORY.REAL;
        return value.account_type === current_account_type && key.includes(CFD_PLATFORMS.DXTRADE);
    });

const isCTraderAccountAdded = (current_list: Record<string, TDetailsOfEachMT5Loginid>, is_demo?: boolean) =>
    Object.entries(current_list).some(([key, value]) => {
        const current_account_type = is_demo ? CATEGORY.DEMO : CATEGORY.REAL;
        return value.account_type === current_account_type && key.includes(CFD_PLATFORMS.CTRADER);
    });

// Get the MT5 demo accounts of the user
const getMT5DemoData = (available_accounts: TModifiedTradingPlatformAvailableAccount[]) => {
    const swap_free_demo_accounts = available_accounts.filter(
        item =>
            item.market_type === MARKET_TYPE.ALL &&
            item.shortcode === JURISDICTION.SVG &&
            item.platform === CFD_PLATFORMS.MT5
    );
    const financial_demo_accounts = available_accounts.filter(
        item => item.market_type === MARKET_TYPE.FINANCIAL && item.shortcode === JURISDICTION.SVG
    );
    const gaming_demo_accounts = available_accounts.filter(
        item => item.market_type === MARKET_TYPE.GAMING && item.shortcode === JURISDICTION.SVG
    );
    return [...gaming_demo_accounts, ...financial_demo_accounts, ...swap_free_demo_accounts];
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
    getAccountVerficationStatus,
    isMt5AccountAdded,
    isDxtradeAccountAdded,
    isCTraderAccountAdded,
    getMT5DemoData,
    getDxtradeDemoData,
    getCtraderDemoData,
};
