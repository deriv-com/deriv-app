import { TMT5LandingCompanyName } from '../hooks/types';

type TDefinedMT5LandingCompanyName = Exclude<TMT5LandingCompanyName, 'malta' | 'seychelles' | undefined>;

interface TDefinedMT5LandingCompanyDetails {
    name: TDefinedMT5LandingCompanyName;
    title: string;
}

export const LandingCompanyDetails: Record<TDefinedMT5LandingCompanyName, TDefinedMT5LandingCompanyDetails> = {
    bvi: {
        name: 'bvi',
        title: 'BVI',
    },
    labuan: {
        name: 'labuan',
        title: 'Labuan',
    },
    maltainvest: {
        name: 'maltainvest',
        title: 'CFDs',
    },
    svg: {
        name: 'svg',
        title: 'SVG',
    },
    vanuatu: {
        name: 'vanuatu',
        title: 'Vanuatu',
    },
} as const;

export const MT5MarketTypeDetails = {
    all: {
        name: 'all',
        title: 'Swap-Free',
    },
    financial: {
        name: 'financial',
        title: 'Financial',
    },
    synthetic: {
        name: 'synthetic',
        title: 'Derived',
    },
} as const;

export const PlatformDetails = {
    binary: {
        name: 'binary',
        title: 'BinaryBot',
    },
    ctrader: {
        name: 'ctrader',
        title: 'Deriv cTrader',
    },
    derivez: {
        name: 'derivez',
        title: 'DerivEZ',
    },
    dxtrade: {
        name: 'dxtrade',
        title: 'Deriv X',
    },
    mt5: {
        marketType: { ...MT5MarketTypeDetails },
        name: 'mt5',
        title: 'Deriv MT5',
    },
    standard: {
        name: 'standard',
        title: 'Deriv Apps',
    },
} as const;
