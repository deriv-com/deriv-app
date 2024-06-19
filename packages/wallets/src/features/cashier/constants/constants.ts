import { TMarketTypes, TMT5LandingCompanyName, TWalletLandingCompanyName } from '../../../types';

type TDefinedMT5LandingCompanyName = Exclude<TMT5LandingCompanyName, 'malta' | 'seychelles' | undefined>;

interface TDefinedMT5LandingCompanyDetails {
    name: TDefinedMT5LandingCompanyName;
    shortcode: string;
}

interface TMT5MarketTypeDetails {
    icon?: string;
    landingCompany?: Record<TWalletLandingCompanyName, TWalletLandingCompanyDetails>;
    name: TMarketTypes.All;
    title: string;
}

interface TWalletLandingCompanyDetails {
    icon: string;
    name: TWalletLandingCompanyName;
    title: string;
}

export const LandingCompanyDetails: Record<TDefinedMT5LandingCompanyName, TDefinedMT5LandingCompanyDetails> = {
    bvi: {
        name: 'bvi',
        shortcode: 'BVI',
    },
    labuan: {
        name: 'labuan',
        shortcode: 'Labuan',
    },
    maltainvest: {
        name: 'maltainvest',
        shortcode: 'Maltainvest',
    },
    svg: {
        name: 'svg',
        shortcode: 'SVG',
    },
    vanuatu: {
        name: 'vanuatu',
        shortcode: 'Vanuatu',
    },
} as const;

export const MT5MarketTypeDetails: Record<TMarketTypes.All, TMT5MarketTypeDetails> = {
    all: {
        icon: 'IcWalletMt5All',
        name: 'all',
        title: 'MT5 Swap-Free',
    },
    financial: {
        landingCompany: {
            malta: {
                icon: 'IcWalletMt5CFDs',
                name: 'malta',
                title: 'MT5 CFDs',
            },
            svg: {
                icon: 'IcWalletMt5Financial',
                name: 'svg',
                title: 'MT5 Financial',
            },
            virtual: {
                icon: 'IcWalletMt5Financial',
                name: 'virtual',
                title: 'MT5 CFDs',
            },
        },
        name: 'financial',
        title: 'MT5 Financial',
    },
    synthetic: {
        icon: 'IcWalletMt5Derived',
        name: 'synthetic',
        title: 'MT5 Derived',
    },
} as const;

export const PlatformDetails = {
    binary: {
        icon: 'IcWalletOptionsLight',
        name: 'binary',
        title: 'BinaryBot',
    },
    ctrader: {
        icon: 'IcWalletCTrader',
        name: 'ctrader',
        title: 'Deriv cTrader',
    },
    derivez: {
        icon: 'IcWalletDerivEZ',
        name: 'derivez',
        title: 'DerivEZ',
    },
    dxtrade: {
        icon: 'IcWalletDerivX',
        name: 'dxtrade',
        title: 'Deriv X',
    },
    mt5: {
        marketType: { ...MT5MarketTypeDetails },
        name: 'mt5',
        title: 'Deriv MT5',
    },
    standard: {
        icon: 'IcWalletOptionsLight',
        name: 'standard',
        title: 'Options',
    },
} as const;
