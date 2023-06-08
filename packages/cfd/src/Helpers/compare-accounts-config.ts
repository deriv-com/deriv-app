import { TTradingPlatformAvailableAccount, TIconData } from '../Components/props.types';

type TCFDConfig = string;

const getHighlightedIconLabel = (trading_platforms: TTradingPlatformAvailableAccount): TIconData[] => {
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
const getAccountCardTitle = (shortcode: TCFDConfig) => {
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
        case 'financial_labaun':
            return 'Financial - Labuan';
        case 'all_svg':
            return 'Swap-Free - SVG';
        default:
            return 'CFDs';
    }
};

const getAccountIcon = (shortcode: TCFDConfig) => {
    switch (shortcode) {
        case 'synthetic':
            return 'Derived';
        case 'financial':
            return 'Financial';
        case 'all':
            return 'SwapFree';
        default:
            return 'CFDs';
    }
};

const getMarketType = (trading_platforms: TTradingPlatformAvailableAccount) => {
    return trading_platforms.market_type === 'gaming' ? 'synthetic' : trading_platforms.market_type;
};

const cfdConfig = {
    leverage: '1:1000',
    leverageDescription: 'Maximum Leverage',
    spread: '0.5 pips',
    spreadDescription: 'Spread from',
    counterpartyCompany: 'Deriv (SVG) LLC',
    counterpartyCompanyDescription: 'Counterparty company',
    jurisdiction: 'St. Virginia',
    jurisdictionDescription: 'Jurisdiction',
    regulator: 'Financial Commission',
    regulatorDescription: 'Regulator/External dispute resolution',
};
const getJuridisctionDescription = (shortcode: TCFDConfig) => {
    switch (shortcode) {
        case 'synthetic_svg':
            return {
                ...cfdConfig,
                counterpartyCompany: 'Deriv (SVG) LLC',
                jurisdiction: 'St. Vincent & Grenadines',
                jurisdictionDescription: 'Jurisdiction',
                regulator: 'Financial Commission',
                regulatorDescription: 'Regulator/External dispute resolution',
            };
        case 'synthetic_bvi':
            return {
                ...cfdConfig,
                counterpartyCompany: 'Deriv (BVI) LLC',
                jurisdiction: 'British Virgin Islands',
                jurisdictionDescription: 'Jurisdiction',
                regulator: 'British Virgin Islands Financial Services Commission',
                regulatorDescription: '(License no. SIBA/L/18/1114) Regulator/External dispute Resolution',
            };
        case 'synthetic_vanuatu':
            return {
                ...cfdConfig,
                counterpartyCompany: 'Deriv SVG (LLC)',
                jurisdiction: 'St. Virginia',
                jurisdictionDescription: 'Jurisdiction',
                regulator: 'Financial Commission',
                regulatorDescription: 'Regulator/External dispute resolution',
            };
        case 'financial_svg':
            return {
                ...cfdConfig,
                counterpartyCompany: 'Deriv (SVG) LLC',
                jurisdiction: 'St. Vincent & Grenadines',
                jurisdictionDescription: 'Jurisdiction',
                regulator: 'Financial Commission',
                regulatorDescription: 'Regulator/External dispute resolution',
            };
        case 'financial_bvi':
            return {
                ...cfdConfig,
                counterpartyCompany: 'Deriv (BVI) LLC',
                jurisdiction: 'British Virgin Islands',
                jurisdictionDescription: 'Jurisdiction',
                regulator: 'British Virgin Islands Financial Services Commission',
                regulatorDescription: '(License no. SIBA/L/18/1114) Regulator/External Dispute Resolution',
            };
        case 'financial_vanuatu':
            return {
                ...cfdConfig,
                counterpartyCompany: 'Deriv (V) LLC',
                jurisdiction: 'Vanuatu',
                jurisdictionDescription: 'Jurisdiction',
                regulator: 'Vanuatu Financial Services Commission',
                regulatorDescription: 'Regulator/External Dispute Resolution',
            };
        case 'financial_labaun':
            return {
                ...cfdConfig,
                counterpartyCompany: 'Deriv (FX) Ltd',
                jurisdiction: 'Labuan',
                jurisdictionDescription: 'Jurisdiction',
                regulator: 'Labuan Financial Services Authority',
                regulatorDescription: '(licence no. MB/18/0024) Regulator/External Dispute Resolution',
            };
        case 'all_svg':
            return {
                ...cfdConfig,
                counterpartyCompany: 'Deriv (SVG) LLC',
                jurisdiction: 'St. Vincent & Grenadines',
                jurisdictionDescription: 'Jurisdiction',
                regulator: 'Financial Commission',
                regulatorDescription: 'Regulator/External dispute resolution',
            };
        default:
            return cfdConfig;
    }
};

export {
    getHighlightedIconLabel,
    cfdConfig,
    getJuridisctionDescription,
    getAccountCardTitle,
    getMarketType,
    getAccountIcon,
};
