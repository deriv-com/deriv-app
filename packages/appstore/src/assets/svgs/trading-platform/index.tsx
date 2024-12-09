import React from 'react';

import CTrader from 'Assets/svgs/trading-platform/branding/ic-branding-ctrader.svg';
import DBot from 'Assets/svgs/trading-platform/branding/ic-branding-dbot-dashboard.svg';
import DerivLogo from 'Assets/svgs/trading-platform/branding/ic-branding-deriv-logo.svg';
import DerivGo from 'Assets/svgs/trading-platform/branding/ic-branding-derivgo-dashboard.svg';
import DTrader from 'Assets/svgs/trading-platform/branding/ic-branding-dtrader-dashboard.svg';
import DerivX from 'Assets/svgs/trading-platform/branding/ic-branding-dxtrade-dashboard.svg';
import CFDs from 'Assets/svgs/trading-platform/branding/ic-branding-mt5-cfds.svg';
import Derived from 'Assets/svgs/trading-platform/branding/ic-branding-mt5-derived-dashboard.svg';
import Financial from 'Assets/svgs/trading-platform/branding/ic-branding-mt5-financial-dashboard.svg';
import SmartTrader from 'Assets/svgs/trading-platform/branding/ic-branding-smarttrader-dashboard.svg';
import Standard from 'Assets/svgs/trading-platform/branding/ic-branding-standard-dashboard.svg';
import DropDown from 'Assets/svgs/trading-platform/drop-down.svg';
import DerivTradingLogo from 'Assets/svgs/trading-platform/ic-appstore-deriv-trading-logo.svg';
import DerivGoBlack from 'Assets/svgs/trading-platform/ic-appstore-derivgo-black.svg';
import Options from 'Assets/svgs/trading-platform/ic-appstore-options.svg';
import SmartTraderBlue from 'Assets/svgs/trading-platform/ic-appstore-smarttrader-blue.svg';
import SwapFree from 'Assets/svgs/trading-platform/ic-appstore-swap-free.svg';
import ZeroSpread from 'Assets/svgs/trading-platform/ic-appstore-zero-spread.svg';
import Demo from 'Assets/svgs/trading-platform/ic-brand-demo.svg';

import { IconProps } from '../icon-types';

export const PlatformIcons = {
    CFDs,
    CTrader,
    DBot,
    Demo,
    Derived,
    DerivGo,
    DerivGoBlack,
    DerivLogo,
    DerivTradingLogo,
    DerivX,
    DropDown,
    DTrader,
    Financial,
    SwapFree,
    Options,
    SmartTrader,
    SmartTraderBlue,
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
