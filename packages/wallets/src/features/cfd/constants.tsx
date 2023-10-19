import React, { ReactNode } from 'react';
import { TMarketTypes, TPlatforms } from './types';
import FinancialMT5Icon from '../../public/images/mt5-financial.svg';
import SwapFreeMT5Icon from '../../public/images/mt5-swap-free.svg';
import DerivedMT5Icon from '../../public/images/mt5-derived.svg';
import DocumentsIcon from '../../public/images/ic-documents.svg';
import IdCardIcon from '../../public/images/ic-id-card.svg';
import NotApplicableIcon from '../../public/images/ic-not-applicable.svg';
import SelfieIcon from '../../public/images/ic-selfie.svg';
import VerificationFailedStatusIcon from '../../public/images/ic-verification-failed-status.svg';
import VerificationPendingStatusIcon from '../../public/images/ic-verification-pending-status.svg';
import VerificationSuccessStatusIcon from '../../public/images/ic-verification-success-status.svg';

export const MARKET_TYPE_TO_TITLE_MAPPER: Record<TMarketTypes.All, string> = {
    all: 'Swap-Free',
    financial: 'Financial',
    synthetic: 'Derived',
};

export const PLATFORM_TO_TITLE_MAPPER: Record<TPlatforms.All, string> = {
    ctrader: 'cTrader',
    derivez: 'Deriv EZ',
    dxtrade: 'Deriv X',
    mt5: 'Deriv MT5',
};

export const MARKET_TYPE_TO_DESCRIPTION_MAPPER: Record<TMarketTypes.All, string> = {
    all: 'Trade swap-free CFDs on MT5 with synthetics, forex, stocks, stock indices, cryptocurrencies and ETFs',
    financial: 'This account offers CFDs on financial instruments.',
    synthetic: 'This account offers CFDs on derived instruments.',
};

export const MARKET_TYPE_TO_ICON_MAPPER: Record<TMarketTypes.All, ReactNode> = {
    all: <SwapFreeMT5Icon />,
    financial: <FinancialMT5Icon />,
    synthetic: <DerivedMT5Icon />,
};

export const VERIFICATION_ICONS_MAPPER: Record<string, ReactNode> = {
    documentNumber: <IdCardIcon />,
    nameAndAddress: <DocumentsIcon />,
    notApplicable: <NotApplicableIcon />,
    selfie: <SelfieIcon />,
};

export const VERIFICATION_STATUS_ICONS_MAPPER: Record<string, ReactNode> = {
    verificationFailedStatusIcon: <VerificationFailedStatusIcon />,
    verificationPendingStatusIcon: <VerificationPendingStatusIcon />,
    verificationSuccessStatusIcon: <VerificationSuccessStatusIcon />,
};

export const MARKET_TYPE_DETAILS_MAPPER = {
    all: {
        description:
            'Trade swap-free CFDs on MT5 with synthetics, forex, stocks, stock indices, cryptocurrencies, and ETFs.',
        icon: <SwapFreeMT5Icon />,
        title: 'Swap-Free',
    },
    financial: {
        description: 'Trade CFDs on MT5 with forex, stocks and indices, commodities, cryptocurrencies, and ETFs.',
        icon: <FinancialMT5Icon />,
        title: 'Financial',
    },
    synthetic: {
        description: 'Trade CFDs on MT5 with derived indices that simulate real-world market movements.',
        icon: <DerivedMT5Icon />,
        title: 'Derived',
    },
};
