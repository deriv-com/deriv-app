import { CFDPlatforms, MarketType } from '../../constants';

export const AccountIcons = {
    [MarketType.SYNTHETIC]: 'Derived',
    [MarketType.FINANCIAL]: 'Financial',
    [MarketType.ALL]: 'SwapFree',
    [CFDPlatforms.DXTRADE]: 'DerivX',
    [CFDPlatforms.CTRADER]: 'CTrader',
    default: 'CFDs',
} as const;

export const MarketTypeShortcode = {
    ALL_DXTRADE: 'all_',
    ALL_SVG: 'all_svg',
    FINANCIAL_BVI: 'financial_bvi',
    FINANCIAL_LABUAN: 'financial_labuan',
    FINANCIAL_MALTAINVEST: 'financial_maltainvest',
    FINANCIAL_SVG: 'financial_svg',
    FINANCIAL_VANUATU: 'financial_vanuatu',
    GAMING: 'gaming',
    SYNTHETIC_BVI: 'synthetic_bvi',
    SYNTHETIC_SVG: 'synthetic_svg',
    SYNTHETIC_VANUATU: 'synthetic_vanuatu',
} as const;

export const Jurisdiction = {
    BVI: 'bvi',
    LABUAN: 'labuan',
    MALTAINVEST: 'maltainvest',
    SVG: 'svg',
    VANUATU: 'vanuatu',
} as const;

export const platformLabel = {
    CTrader: 'Deriv cTrader',
    MT5: 'MT5 Platform',
    DerivX: 'Deriv X',
} as const;
