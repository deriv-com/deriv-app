import React from 'react';
import BinaryBot from 'Assets/svgs/trading-platform/ic-brand-binarybot.svg';
import BinaryBotBlue from 'Assets/svgs/trading-platform/ic-appstore-binarybot-blue.svg';
import DBot from 'Assets/svgs/trading-platform/ic-brand-dbot.svg';
import Demo from 'Assets/svgs/trading-platform/ic-brand-demo.svg';
import Derived from 'Assets/svgs/trading-platform/ic-appstore-derived.svg';
import DerivGo from 'Assets/svgs/trading-platform/ic-brand-derivgo.svg';
import DerivGoBlack from 'Assets/svgs/trading-platform/ic-appstore-derivgo-black.svg';
import DerivLogo from 'Assets/svgs/trading-platform/ic-appstore-deriv-logo.svg';
import DerivTradingLogo from 'Assets/svgs/trading-platform/ic-appstore-deriv-trading-logo.svg';
import DerivX from 'Assets/svgs/trading-platform/ic-appstore-derivx.svg';
import DropDown from 'Assets/svgs/trading-platform/drop-down.svg';
import DTrader from 'Assets/svgs/trading-platform/ic-brand-dtrader.svg';
import Financial from 'Assets/svgs/trading-platform/ic-appstore-financial.svg';
import Options from 'Assets/svgs/trading-platform/ic-appstore-options.svg';
import SmartTrader from 'Assets/svgs/trading-platform/ic-brand-smarttrader.svg';
import SmartTraderBlue from 'Assets/svgs/trading-platform/ic-appstore-smarttrader-blue.svg';
import CFDs from 'Assets/svgs/trading-platform/ic-appstore-cfds.svg';
import SwapFree from 'Assets/svgs/trading-platform/ic-appstore-swap-free.svg';
import { IconProps } from '../icon-types';

export const PlatformIcons = {
    BinaryBot,
    BinaryBotBlue,
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
    CFDs,
};

const TradingPlatformIcon = ({ icon, className, size, onClick }: IconProps<keyof typeof PlatformIcons>) => {
    const PlatformIcon = PlatformIcons[icon] as React.ElementType;

    return PlatformIcon ? (
        <PlatformIcon className={className} style={{ width: size, height: size }} onClick={onClick} />
    ) : null;
};

export default TradingPlatformIcon;
