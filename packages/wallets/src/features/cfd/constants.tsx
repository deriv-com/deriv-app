import React, { ReactNode } from 'react';
import DerivedMT5Icon from '../../public/images/mt5-derived.svg';
import { TMarketTypes, TPlatforms } from '../../types';
import FinancialMT5Icon from '../../public/images/mt5-financial.svg';
import SwapFreeMT5Icon from '../../public/images/mt5-swap-free.svg';
import DerivXIcon from '../../public/images/derivx.svg';
import DerivEZIcon from '../../public/images/derivez.svg';
import CTraderIcon from '../../public/images/ctrader.svg';

export const MarketTypeToTitleMapper: Record<TMarketTypes.All, string> = {
    all: 'Swap-Free',
    financial: 'Financial',
    synthetic: 'Derived',
};

export const PlatformToTitleMapper: Record<TPlatforms.All, string> = {
    ctrader: 'cTrader',
    derivez: 'Deriv EZ',
    dxtrade: 'Deriv X',
    mt5: 'Deriv MT5',
};

export const MarketTypeToDescriptionMapper: Record<TMarketTypes.All, string> = {
    all: 'Trade swap-free CFDs on MT5 with synthetics, forex, stocks, stock indices, cryptocurrencies and ETFs',
    financial: 'This account offers CFDs on financial instruments.',
    synthetic: 'This account offers CFDs on derived instruments.',
};

export const MarketTypeToIconMapper: Record<TMarketTypes.All, ReactNode> = {
    all: <SwapFreeMT5Icon />,
    financial: <FinancialMT5Icon />,
    synthetic: <DerivedMT5Icon />,
};

export const PlatformToIconMapper: Record<TPlatforms.All, ReactNode> = {
    mt5: <DerivedMT5Icon />,
    dxtrade: <DerivXIcon />,
    derivez: <DerivEZIcon />,
    ctrader: <CTraderIcon />,
};
