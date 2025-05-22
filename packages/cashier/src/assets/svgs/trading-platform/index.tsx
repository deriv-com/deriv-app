import React from 'react';

import CFDs from './ic-appstore-cfds.svg';
import Derived from './ic-appstore-derived.svg';
import Financial from './ic-appstore-financial.svg';
import Gold from './ic-appstore-gold.svg';
import Options from './ic-appstore-options.svg';
import Standard from './ic-appstore-standard.svg';
import SwapFree from './ic-appstore-swap-free.svg';
import ZeroSpread from './ic-appstore-zero-spread.svg';

export interface IconProps<T> {
    icon: T;
    className?: string;
    size?: number;
    onClick?: () => void;
}

export const PlatformIcons = {
    Derived,
    Financial,
    Options,
    CFDs,
    Standard,
    SwapFree,
    ZeroSpread,
    Gold,
};

const TradingPlatformIcon = ({ icon, className, size, onClick }: IconProps<keyof typeof PlatformIcons>) => {
    const PlatformIcon = PlatformIcons[icon] as React.ElementType;

    return PlatformIcon ? (
        <PlatformIcon className={className} style={{ width: size, height: size }} onClick={onClick} />
    ) : null;
};

export default TradingPlatformIcon;
