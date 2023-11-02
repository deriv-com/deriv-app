import React from 'react';
import DerivedMT5Icon from '../../public/images/mt5-derived.svg';
import FinancialMT5Icon from '../../public/images/mt5-financial.svg';
import SwapFreeMT5Icon from '../../public/images/mt5-swap-free.svg';
import DerivXIcon from '../../public/images/derivx.svg';
import DerivEZIcon from '../../public/images/derivez.svg';
import CTraderIcon from '../../public/images/ctrader.svg';
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

export const PlatformDetails = {
    ctrader: {
        title: 'Deriv cTrader',
        icon: <CTraderIcon />,
    },
    derivez: {
        title: 'Deriv EZ',
        icon: <DerivEZIcon />,
    },
    dxtrade: {
        title: 'Deriv X',
        icon: <DerivXIcon />,
    },
    mt5: {
        title: 'Deriv MT5',
        icon: <DerivedMT5Icon />,
    },
};
