import React from 'react';
import IntroducingWallets from 'Assets/wallets/introducing-wallets.svg';
import IntroducingWalletsEU from 'Assets/wallets/introducing-wallets-eu.svg';
import HowItWorks from 'Assets/wallets/how-it-works.svg';
import TradingAccounts from 'Assets/wallets/trading-accounts.svg';
import { IconProps } from '../svgs/icon-types';

export const PlatformIcons = {
    IntroducingWallets,
    IntroducingWalletsEU,
    HowItWorks,
    TradingAccounts,
};
const TradingPlatformIcon = ({ icon, className, size, onClick }: IconProps<keyof typeof PlatformIcons>) => {
    const PlatformIcon = PlatformIcons[icon] as React.ElementType;

    return <PlatformIcon className={className} style={{ width: size, height: size }} onClick={onClick} />;
};

export default TradingPlatformIcon;
