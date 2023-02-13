import React from 'react';
import BinaryBot from 'Assets/svgs/trading-platform/branding/ic-branding-binarybot-dashboard.svg';
import BinaryBotBlue from 'Assets/svgs/trading-platform/ic-appstore-binarybot-blue.svg';
import DBot from 'Assets/svgs/trading-platform/branding/ic-branding-dbot-dashboard.svg';
import Demo from 'Assets/svgs/trading-platform/ic-brand-demo.svg';
import Derived from 'Assets/svgs/trading-platform/branding/ic-branding-mt5-derived-dashboard.svg';
import DerivGo from 'Assets/svgs/trading-platform/branding/ic-branding-derivgo-dashboard.svg';
import DerivGoBlack from 'Assets/svgs/trading-platform/ic-appstore-derivgo-black.svg';
import DerivLogo from 'Assets/svgs/trading-platform/branding/onboarding/ic-branding-deriv-logo.svg';
import DerivTradingLogo from 'Assets/svgs/trading-platform/ic-appstore-deriv-trading-logo.svg';
import DerivX from 'Assets/svgs/trading-platform/branding/ic-branding-derivx-dashboard.svg';
import DropDown from 'Assets/svgs/trading-platform/drop-down.svg';
import DTrader from 'Assets/svgs/trading-platform/branding/ic-branding-dtrader-dashboard.svg';
import Financial from 'Assets/svgs/trading-platform/branding/ic-branding-mt5-financial-dashboard.svg';
import Options from 'Assets/svgs/trading-platform/ic-appstore-options.svg';
import SmartTrader from 'Assets/svgs/trading-platform/branding/ic-branding-smarttrader-dashboard.svg';
import SmartTraderBlue from 'Assets/svgs/trading-platform/ic-appstore-smarttrader-blue.svg';
import CFDs from 'Assets/svgs/trading-platform/ic-appstore-cfds.svg';
import DBotRebranding from 'Assets/svgs/trading-platform/ic-brand-dbot.svg';
import DerivGoRebranding from 'Assets/svgs/trading-platform/ic-brand-derivgo.svg';
import MT5DerivedRebranding from 'Assets/svgs/trading-platform/ic-brand-mt5-derived.svg';
import MT5FinancialRebranding from 'Assets/svgs/trading-platform/ic-brand-mt5-financial.svg';
import DTraderOnboarding from 'Assets/svgs/trading-platform/branding/onboarding/ic-branding-dtrader-onboarding.svg';
import BinaryBotOnboarding from 'Assets/svgs/trading-platform/branding/onboarding/ic-branding-binarybot-onboarding.svg';
import DBotOnboarding from 'Assets/svgs/trading-platform/branding/onboarding/ic-branding-dbot-onboarding.svg';
import DerivGoOnboarding from 'Assets/svgs/trading-platform/branding/onboarding/ic-branding-derivgo-onboarding.svg';
import SmartTraderOnboarding from 'Assets/svgs/trading-platform/branding/onboarding/ic-branding-smarttrader-onboarding.svg';
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
    Options,
    SmartTrader,
    SmartTraderBlue,
    CFDs,
    DBotRebranding,
    DerivGoRebranding,
    MT5DerivedRebranding,
    MT5FinancialRebranding,
    DTraderOnboarding,
    BinaryBotOnboarding,
    DBotOnboarding,
    DerivGoOnboarding,
    SmartTraderOnboarding,
};

const TradingPlatformIcon = ({ icon, className, size, onClick }: IconProps<keyof typeof PlatformIcons>) => {
    const PlatformIcon = PlatformIcons[icon] as React.ElementType;

    return PlatformIcon ? (
        <PlatformIcon className={className} style={{ width: size, height: size }} onClick={onClick} />
    ) : null;
};

export default TradingPlatformIcon;
