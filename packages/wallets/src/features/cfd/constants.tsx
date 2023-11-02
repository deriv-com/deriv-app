import React from 'react';
import DerivedMT5Icon from '../../public/images/mt5-derived.svg';
import FinancialMT5Icon from '../../public/images/mt5-financial.svg';
import SwapFreeMT5Icon from '../../public/images/mt5-swap-free.svg';
import { TPlatforms } from '../../types';

export const MarketTypeDetails = {
    all: {
        description:
            'Trade swap-free CFDs on MT5 with synthetics, forex, stocks, stock indices, cryptocurrencies and ETFs',
        icon: <SwapFreeMT5Icon />,
        title: 'Swap-Free',
    },
    financial: {
        description: 'This account offers CFDs on financial instruments.',
        icon: <FinancialMT5Icon />,
        title: 'Financial',
    },
    synthetic: {
        description: 'This account offers CFDs on derived instruments.',
        icon: <DerivedMT5Icon />,
        title: 'Derived',
    },
} as const;

export const PlatformToTitleMapper: Record<TPlatforms.All, string> = {
    ctrader: 'Deriv cTrader',
    derivez: 'Deriv EZ',
    dxtrade: 'Deriv X',
    mt5: 'Deriv MT5',
};
