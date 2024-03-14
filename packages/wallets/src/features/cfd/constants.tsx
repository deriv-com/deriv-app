import React from 'react';
import CTraderIcon from '../../public/images/ctrader.svg';
import DerivXIcon from '../../public/images/derivx.svg';
import DerivedMT5Icon from '../../public/images/mt5-derived.svg';
import FinancialMT5Icon from '../../public/images/mt5-financial.svg';
import SwapFreeMT5Icon from '../../public/images/mt5-swap-free.svg';
import i18n from '../../translations/i18n';
import { TPlatforms } from '../../types';

export const MarketTypeDetails = {
    all: {
        description: i18n.t(
            'Trade swap-free CFDs on MT5 with synthetics, forex, stocks, stock indices, cryptocurrencies and ETFs'
        ),

        icon: <SwapFreeMT5Icon />,
        title: i18n.t('Swap-Free'),
    },
    financial: {
        description: 'This account offers CFDs on financial instruments.',
        icon: <FinancialMT5Icon />,
        title: i18n.t('Financial'),
    },
    synthetic: {
        description: i18n.t('This account offers CFDs on derived instruments.'),
        icon: <DerivedMT5Icon />,
        title: i18n.t('Derived'),
    },
} as const;

export const PlatformDetails = {
    ctrader: {
        icon: <CTraderIcon />,
        link: 'https://onelink.to/hyqpv7',
        platform: i18n.t('ctrader') as TPlatforms.OtherAccounts,
        title: i18n.t('Deriv cTrader'),
    },
    dxtrade: {
        icon: <DerivXIcon />,
        link: 'https://onelink.to/grmtyx',
        platform: i18n.t('dxtrade') as TPlatforms.OtherAccounts,
        title: i18n.t('Deriv X'),
    },
    mt5: {
        icon: <DerivedMT5Icon />,
        link: 'https://onelink.to/grmtyx',
        platform: i18n.t('mt5') as TPlatforms.MT5,
        title: i18n.t('Deriv MT5'),
    },
};

export const companyNamesAndUrls = {
    bvi: { name: i18n.t('Deriv (BVI) Ltd'), shortcode: 'BVI', tncUrl: 'tnc/deriv-(bvi)-ltd.pdf' },
    labuan: { name: i18n.t('Deriv (FX) Ltd'), shortcode: 'Labuan', tncUrl: 'tnc/deriv-(fx)-ltd.pdf' },
    maltainvest: {
        name: i18n.t('Deriv Investments (Europe) Limited'),
        shortcode: 'Maltainvest',
        tncUrl: 'tnc/deriv-investments-(europe)-limited.pdf',
    },
    svg: { name: i18n.t('Deriv (SVG) LLC'), shortcode: 'SVG', tncUrl: 'tnc/deriv-(svg)-llc.pdf' },
    vanuatu: { name: i18n.t('Deriv (V) Ltd'), shortcode: 'Vanuatu', tncUrl: 'tnc/general-terms.pdf' },
} as const;

export const CFD_PLATFORMS = {
    CFDS: 'CFDs',
    CTRADER: 'ctrader',
    DXTRADE: 'dxtrade',
    MT5: 'mt5',
} as const;

export const MARKET_TYPE = {
    ALL: 'all',
    FINANCIAL: 'financial',
    SYNTHETIC: 'synthetic',
} as const;

export const JURISDICTION = {
    BVI: 'bvi',
    LABUAN: 'labuan',
    MALTA_INVEST: 'maltainvest',
    SVG: 'svg',
    VANUATU: 'vanuatu',
} as const;
