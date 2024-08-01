import React from 'react';
import { Localize } from '@deriv-com/translations';
import { TMarketTypes, TMT5LandingCompanyName, TWalletLandingCompanyName } from '../../../types';

type TDefinedMT5LandingCompanyName = Exclude<TMT5LandingCompanyName, 'malta' | 'seychelles' | undefined>;

interface TDefinedMT5LandingCompanyDetails {
    name: TDefinedMT5LandingCompanyName;
    shortcode: string;
}

interface TMT5MarketTypeDetails {
    landingCompany?: Record<TWalletLandingCompanyName, TWalletLandingCompanyDetails>;
    name: TMarketTypes.All;
    title: JSX.Element | string;
}

interface TWalletLandingCompanyDetails {
    name: TWalletLandingCompanyName;
    title: JSX.Element | string;
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
        name: 'all',
        title: <Localize i18n_default_text='MT5 Swap-Free' />,
    },
    financial: {
        landingCompany: {
            malta: {
                name: 'malta',
                title: <Localize i18n_default_text='MT5 CFDs' />,
            },
            svg: {
                name: 'svg',
                title: <Localize i18n_default_text='MT5 Financial' />,
            },
            virtual: {
                name: 'virtual',
                title: <Localize i18n_default_text='MT5 CFDs' />,
            },
        },
        name: 'financial',
        title: <Localize i18n_default_text='MT5 Financial' />,
    },
    synthetic: {
        name: 'synthetic',
        title: <Localize i18n_default_text='MT5 Standard' />,
    },
} as const;

export const PlatformDetails = {
    binary: {
        name: 'binary',
        title: <Localize i18n_default_text='BinaryBot' />,
    },
    ctrader: {
        name: 'ctrader',
        title: <Localize i18n_default_text='Deriv cTrader' />,
    },
    derivez: {
        name: 'derivez',
        title: <Localize i18n_default_text='DerivEZ' />,
    },
    dxtrade: {
        name: 'dxtrade',
        title: <Localize i18n_default_text='Deriv X' />,
    },
    mt5: {
        marketType: { ...MT5MarketTypeDetails },
        name: 'mt5',
        title: <Localize i18n_default_text='Deriv MT5' />,
    },
    standard: {
        name: 'standard',
        title: <Localize i18n_default_text='Options' />,
    },
} as const;
