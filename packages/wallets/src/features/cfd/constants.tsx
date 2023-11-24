import React from 'react';
import CTraderIcon from '../../public/images/ctrader.svg';
import DerivXIcon from '../../public/images/derivx.svg';
import DerivedMT5Icon from '../../public/images/mt5-derived.svg';
import FinancialMT5Icon from '../../public/images/mt5-financial.svg';
import SwapFreeMT5Icon from '../../public/images/mt5-swap-free.svg';
import { TMarketTypes, TPlatforms } from '../../types';

type TPlatformDetail = {
    icon: React.ReactNode;
    id: TPlatforms.All;
    link: string;
    title: string;
};

type TMarketTypeDetail = {
    description: string;
    icon: React.ReactNode;
    id: TMarketTypes.All;
    title: string;
};

export const MarketTypeDetails: Record<TMarketTypes.All, TMarketTypeDetail> = {
    all: {
        description:
            'Trade swap-free CFDs on MT5 with synthetics, forex, stocks, stock indices, cryptocurrencies and ETFs',
        icon: <SwapFreeMT5Icon />,
        id: 'all',
        title: 'Swap-Free',
    },
    financial: {
        description: 'This account offers CFDs on financial instruments.',
        icon: <FinancialMT5Icon />,
        id: 'financial',
        title: 'Financial',
    },
    synthetic: {
        description: 'This account offers CFDs on derived instruments.',
        icon: <DerivedMT5Icon />,
        id: 'synthetic',
        title: 'Derived',
    },
} as const;

export const PlatformDetails: Record<TPlatforms.All, TPlatformDetail> = {
    ctrader: {
        icon: <CTraderIcon />,
        id: 'ctrader',
        link: 'https://onelink.to/hyqpv7',
        title: 'Deriv cTrader',
    },
    dxtrade: {
        icon: <DerivXIcon />,
        id: 'dxtrade',
        link: 'https://onelink.to/grmtyx',
        title: 'Deriv X',
    },
    mt5: {
        icon: <DerivedMT5Icon />,
        id: 'mt5',
        link: 'https://onelink.to/grmtyx',
        title: 'Deriv MT5',
    },
} as const;

export const companyNamesAndUrls = {
    bvi: { name: 'Deriv (BVI) Ltd', tncUrl: 'tnc/deriv-(bvi)-ltd.pdf' },
    labuan: { name: 'Deriv (FX) Ltd', tncUrl: 'tnc/deriv-(fx)-ltd.pdf' },
    maltainvest: {
        name: 'Deriv Investments (Europe) Limited',
        tncUrl: 'tnc/deriv-investments-(europe)-limited.pdf',
    },
    vanuatu: { name: 'Deriv (V) Ltd', tncUrl: 'tnc/general-terms.pdf' },
} as const;
