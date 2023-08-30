import React from 'react';
import Derived from '../icon/appstore/ic-appstore-derived.svg';
import Financial from '../icon/appstore/ic-appstore-financial.svg';
import CFDs from '../icon/appstore/ic-appstore-cfds.svg';
import DerivEz from '../icon/appstore/ic-appstore-derivez.svg';
import SwapFree from '../icon/appstore/ic-appstore-swap-free.svg';

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
    DerivEz,
    SwapFree,
};

const TradingPlatformIcon = ({ icon, className, size, onClick }: IconProps<keyof typeof PlatformIcons>) => {
    const PlatformIcon = PlatformIcons[icon] as React.ElementType;

    return PlatformIcon ? (
        <PlatformIcon className={className} style={{ width: size, height: size }} onClick={onClick} />
    ) : null;
};

export default TradingPlatformIcon;
