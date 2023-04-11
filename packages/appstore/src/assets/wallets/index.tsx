import React from 'react';
import IntroducingWallets from 'Assets/wallets/introducing-wallets.svg';
import IntroducingWalletsEU from 'Assets/wallets/introducing-wallets-eu.svg';
import HowItWorks from 'Assets/wallets/how-it-works.svg';
import TradingAccounts from 'Assets/wallets/trading-accounts.svg';

export const WalletsImagesList = {
    IntroducingWallets,
    IntroducingWalletsEU,
    HowItWorks,
    TradingAccounts,
};

type WalletsImageProps<T> = {
    banner: T;
    className?: string;
};

const WalletsImage = ({ banner, className }: WalletsImageProps<keyof typeof WalletsImagesList>) => {
    const Component = WalletsImagesList[banner] as React.ElementType;

    return <Component className={className} data-testid={banner} />;
};

export default WalletsImage;
