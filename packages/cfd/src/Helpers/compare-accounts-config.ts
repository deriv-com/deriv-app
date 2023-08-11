import { CFD_PLATFORMS } from '@deriv/shared';
import { localize } from '@deriv/translations';
import {
    TInstrumentsIcon,
    TModifiedTradingPlatformAvailableAccount,
    TDetailsOfEachMT5Loginid,
} from '../Components/props.types';

// Map the accounts according to the market type
const getHighlightedIconLabel = (
    trading_platforms: TModifiedTradingPlatformAvailableAccount,
    selected_region?: string,
    is_demo?: boolean
): TInstrumentsIcon[] => {
    const market_type = getMarketType(trading_platforms);
    const market_type_shortcode = market_type.concat('_', trading_platforms.shortcode);
    // Forex for these: MT5 Financial Vanuatu, MT5 Financial Labuan
    const forex_label =
        ['financial_labuan', 'financial_vanuatu'].includes(market_type_shortcode) ||
        is_demo ||
        trading_platforms.platform === CFD_PLATFORMS.DXTRADE ||
        selected_region === 'EU'
            ? localize('Forex')
            : localize('Forex: standard/micro');

    switch (trading_platforms.market_type) {
        case 'gaming':
            return [
                { icon: 'Synthetics', text: localize('Synthetics'), highlighted: true },
                { icon: 'Baskets', text: localize('Baskets'), highlighted: true },
                { icon: 'DerivedFX', text: localize('Derived FX'), highlighted: true },
                { icon: 'Stocks', text: localize('Stocks'), highlighted: false },
                { icon: 'StockIndices', text: localize('Stock indices'), highlighted: false },
                { icon: 'Commodities', text: localize('Commodities'), highlighted: false },
                { icon: 'Forex', text: forex_label, highlighted: false },
                { icon: 'Cryptocurrencies', text: localize('Cryptocurrencies'), highlighted: false },
                { icon: 'ETF', text: localize('ETF'), highlighted: false },
            ];
        case 'financial':
            switch (trading_platforms.shortcode) {
                case 'maltainvest':
                    return [
                        { icon: 'Synthetics', text: localize('Synthetics'), highlighted: true, is_asterisk: true },
                        { icon: 'Forex', text: forex_label, highlighted: true },
                        { icon: 'Stocks', text: localize('Stocks'), highlighted: true },
                        { icon: 'StockIndices', text: localize('Stock indices'), highlighted: true },
                        { icon: 'Commodities', text: localize('Commodities'), highlighted: true },
                        { icon: 'Cryptocurrencies', text: localize('Cryptocurrencies'), highlighted: true },
                    ];
                case 'labuan':
                    return [
                        { icon: 'Synthetics', text: localize('Synthetics'), highlighted: false },
                        { icon: 'Baskets', text: localize('Baskets'), highlighted: false },
                        { icon: 'DerivedFX', text: localize('Derived FX'), highlighted: false },
                        { icon: 'Stocks', text: localize('Stocks'), highlighted: false },
                        { icon: 'StockIndices', text: localize('Stock indices'), highlighted: false },
                        { icon: 'Commodities', text: localize('Commodities'), highlighted: false },
                        { icon: 'Forex', text: forex_label, highlighted: true },
                        { icon: 'Cryptocurrencies', text: localize('Cryptocurrencies'), highlighted: true },
                        { icon: 'ETF', text: localize('ETF'), highlighted: true },
                    ];
                default:
                    return [
                        { icon: 'Synthetics', text: localize('Synthetics'), highlighted: false },
                        { icon: 'Baskets', text: localize('Baskets'), highlighted: false },
                        { icon: 'DerivedFX', text: localize('Derived FX'), highlighted: false },
                        { icon: 'Stocks', text: localize('Stocks'), highlighted: true },
                        { icon: 'StockIndices', text: localize('Stock indices'), highlighted: true },
                        { icon: 'Commodities', text: localize('Commodities'), highlighted: true },
                        { icon: 'Forex', text: forex_label, highlighted: true },
                        { icon: 'Cryptocurrencies', text: localize('Cryptocurrencies'), highlighted: true },
                        { icon: 'ETF', text: localize('ETF'), highlighted: true },
                    ];
            }
        case 'all':
        default:
            if (trading_platforms.platform === 'mt5') {
                return [
                    { icon: 'Synthetics', text: localize('Synthetics'), highlighted: true },
                    { icon: 'Baskets', text: localize('Baskets'), highlighted: false },
                    { icon: 'DerivedFX', text: localize('Derived FX'), highlighted: true },
                    { icon: 'Stocks', text: localize('Stocks'), highlighted: true },
                    { icon: 'StockIndices', text: localize('Stock indices'), highlighted: true },
                    { icon: 'Commodities', text: localize('Commodities'), highlighted: false },
                    { icon: 'Forex', text: forex_label, highlighted: true },
                    { icon: 'Cryptocurrencies', text: localize('Cryptocurrencies'), highlighted: true },
                    { icon: 'ETF', text: localize('ETF'), highlighted: true },
                ];
            }
            return [
                { icon: 'Synthetics', text: localize('Synthetics'), highlighted: true },
                { icon: 'Baskets', text: localize('Baskets'), highlighted: true },
                { icon: 'DerivedFX', text: localize('Derived FX'), highlighted: true },
                { icon: 'Stocks', text: localize('Stocks'), highlighted: true },
                { icon: 'StockIndices', text: localize('Stock indices'), highlighted: true },
                { icon: 'Commodities', text: localize('Commodities'), highlighted: true },
                { icon: 'Forex', text: forex_label, highlighted: true },
                { icon: 'Cryptocurrencies', text: localize('Cryptocurrencies'), highlighted: true },
                { icon: 'ETF', text: localize('ETF'), highlighted: true },
            ];
    }
};

// Get the Account Title according to the market type and jurisdiction
const getAccountCardTitle = (shortcode: string, is_demo?: boolean) => {
    switch (shortcode) {
        case 'synthetic_svg':
            return is_demo ? localize('Derived Demo') : localize('Derived - SVG');
        case 'synthetic_bvi':
            return localize('Derived - BVI');
        case 'synthetic_vanuatu':
            return localize('Derived - Vanuatu');
        case 'financial_svg':
            return is_demo ? localize('Financial Demo') : localize('Financial - SVG');
        case 'financial_bvi':
            return localize('Financial - BVI');
        case 'financial_vanuatu':
            return localize('Financial - Vanuatu');
        case 'financial_labuan':
            return localize('Financial - Labuan');
        case 'all_svg':
            return is_demo ? localize('Swap-Free Demo') : localize('Swap-Free - SVG');
        case 'dxtrade':
            return is_demo ? localize('Deriv X Demo') : localize('Deriv X');
        default:
            return is_demo ? localize('CFDs Demo') : localize('CFDs');
    }
};

// Get the Platform label
const getPlatformLabel = (shortcode?: string) => {
    switch (shortcode) {
        case 'dxtrade':
        case 'CFDs':
            return localize('Other CFDs Platform');
        case 'mt5':
        default:
            return localize('MT5 Platform');
    }
};

// Object to map the platform label
const platfromsHeaderLabel = {
    mt5: localize('MT5 Platform'),
    other_cfds: localize('Other CFDs Platform'),
};

// Get the Account Icons based on the market type
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

// Convert the market type from gaming to synthethics
const getMarketType = (trading_platforms: TModifiedTradingPlatformAvailableAccount) => {
    return trading_platforms.market_type === 'gaming' ? 'synthetic' : trading_platforms.market_type;
};

// Get the color of Header based on the platform
const getHeaderColor = (shortcode: string) => {
    switch (shortcode) {
        case platfromsHeaderLabel.other_cfds:
            return 'green';
        case platfromsHeaderLabel.mt5:
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
        case 'synthetic_bvi':
            return createDescription(
                'Deriv (BVI) Ltd',
                'British Virgin Islands',
                localize('British Virgin Islands Financial Services Commission'),
                localize('(License no. SIBA/L/18/1114)'),
                localize('Regulator/External dispute resolution')
            );
        case 'synthetic_vanuatu':
            return createDescription(
                'Deriv (V) Ltd',
                'Vanuatu',
                localize('Vanuatu Financial Services Commission'),
                '',
                localize('Regulator/External dispute resolution')
            );
        case 'financial_bvi':
            return createDescription(
                'Deriv (BVI) Ltd',
                'British Virgin Islands',
                localize('British Virgin Islands Financial Services Commission'),
                localize('(License no. SIBA/L/18/1114)'),
                localize('Regulator/External dispute resolution')
            );
        case 'financial_vanuatu':
            return createDescription(
                'Deriv (V) Ltd',
                'Vanuatu',
                localize('Vanuatu Financial Services Commission'),
                '',
                localize('Regulator/External dispute resolution')
            );
        case 'financial_labuan':
            return createDescription(
                'Deriv (FX) Ltd',
                'Labuan',
                localize('Labuan Financial Services Authority'),
                localize('(licence no. MB/18/0024)'),
                localize('Regulator/External dispute resolution'),
                '1:100'
            );
        case 'financial_maltainvest':
            return createDescription(
                'Deriv Investments (Europe) Limited',
                'Malta',
                localize('Financial Commission'),
                localize('Regulated by the Malta Financial Services Authority (MFSA) (licence no. IS/70156)'),
                '',
                'Up to 1:30'
            );
        // Dxtrade
        case 'all_':
        case 'all_svg':
        case 'synthetic_svg':
        case 'financial_svg':
        default:
            return cfd_config();
    }
};

// Sort the MT5 accounts in the order of derived, financial and swap-free
const getSortedCFDAvailableAccounts = (available_accounts: TModifiedTradingPlatformAvailableAccount[]) => {
    const swap_free_accounts = available_accounts
        .filter(item => item.market_type === 'all')
        .map(item => ({ ...item, platform: 'mt5' } as const));
    const financial_accounts = available_accounts
        .filter(item => item.market_type === 'financial' && item.shortcode !== 'maltainvest')
        .map(item => ({ ...item, platform: 'mt5' } as const));
    const gaming_accounts = available_accounts
        .filter(item => item.market_type === 'gaming')
        .map(item => ({ ...item, platform: 'mt5' } as const));
    return [...gaming_accounts, ...financial_accounts, ...swap_free_accounts];
};

// Get the maltainvest accounts for EU and DIEL clients
const getEUAvailableAccounts = (available_accounts: TModifiedTradingPlatformAvailableAccount[]) => {
    const financial_accounts = available_accounts
        .filter(item => item.market_type === 'financial' && item.shortcode === 'maltainvest')
        .map(item => ({ ...item, platform: 'mt5' } as const));
    return [...financial_accounts];
};

// Make the Deriv X data same as trading_platform_available_accounts
const dxtrade_data: TModifiedTradingPlatformAvailableAccount = {
    market_type: 'all',
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
    shortcode: 'svg',
    sub_account_type: '',
    platform: 'dxtrade',
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
        case 'synthetic_svg':
        case 'financial_svg':
        case 'all_svg':
            return true;
        case 'synthetic_bvi':
        case 'financial_bvi':
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
        case 'synthetic_vanuatu':
        case 'financial_vanuatu':
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

        case 'financial_labuan':
            if (poi_acknowledged_for_bvi_labuan && poa_acknowledged && has_submitted_personal_details) {
                return true;
            }
            return false;

        case 'financial_maltainvest':
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
        const current_account_type = is_demo ? 'demo' : 'real';
        return (
            value.market_type === market &&
            value.landing_company_short === type &&
            value.account_type === current_account_type &&
            key.includes(CFD_PLATFORMS.MT5)
        );
    });

const isDxtradeAccountAdded = (current_list: Record<string, TDetailsOfEachMT5Loginid>, is_demo?: boolean) =>
    Object.entries(current_list).some(([key, value]) => {
        const current_account_type = is_demo ? 'demo' : 'real';
        return value.account_type === current_account_type && key.includes(CFD_PLATFORMS.DXTRADE);
    });

// Get the MT5 demo accounts of the user
const getMT5DemoData = (available_accounts: TModifiedTradingPlatformAvailableAccount[]) => {
    const swap_free_demo_accounts = available_accounts.filter(
        item => item.market_type === 'all' && item.shortcode === 'svg' && item.platform === CFD_PLATFORMS.MT5
    );
    const financial_demo_accounts = available_accounts.filter(
        item => item.market_type === 'financial' && item.shortcode === 'svg'
    );
    const gaming_demo_accounts = available_accounts.filter(
        item => item.market_type === 'gaming' && item.shortcode === 'svg'
    );
    return [...gaming_demo_accounts, ...financial_demo_accounts, ...swap_free_demo_accounts];
};
const getDxtradeDemoData = (available_accounts: TModifiedTradingPlatformAvailableAccount[]) => {
    return available_accounts.filter(item => item.platform === CFD_PLATFORMS.DXTRADE);
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
    getHeaderColor,
    platfromsHeaderLabel,
    getAccountVerficationStatus,
    isMt5AccountAdded,
    isDxtradeAccountAdded,
    getMT5DemoData,
    getDxtradeDemoData,
};
