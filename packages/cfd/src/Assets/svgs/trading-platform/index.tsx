import React from 'react';

import CFDs from './ic-appstore-cfds.svg';
import CTrader from './ic-appstore-ctrader.svg';
import DerivX from './ic-appstore-deriv-x.svg';
import Derived from './ic-appstore-derived.svg';
import Financial from './ic-appstore-financial.svg';
import SwapFree from './ic-appstore-swap-free.svg';
import ZeroSpread from './ic-appstore-zero-spread.svg';
import Standard from './ic-appstore-standard.svg';

export interface IconProps<T> {
    icon: T;
    className?: string;
    size?: number;
    onClick?: () => void;
}

export const PlatformIcons = {
    Derived,
    Financial,
    CFDs,
    CTrader,
    SwapFree,
    DerivX,
    ZeroSpread,
    Standard,
};

const TradingPlatformIcon = ({ icon, className, size, onClick }: IconProps<keyof typeof PlatformIcons>) => {
    const PlatformIcon = PlatformIcons[icon] as React.ElementType;

    return PlatformIcon ? (
        <PlatformIcon className={className} style={{ width: size, height: size }} onClick={onClick} />
    ) : null;
};

export default TradingPlatformIcon;
