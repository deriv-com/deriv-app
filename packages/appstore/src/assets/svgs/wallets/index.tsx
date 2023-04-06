import React from 'react';
import UpgradeDesktop from 'Assets/svgs/wallets/wallets-upgrade-desktop.svg';
import UpgradeMobile from 'Assets/svgs/wallets/wallets-upgrade-mobile.svg';

export const WalletsBanners = {
    UpgradeDesktop,
    UpgradeMobile,
};

type WalletsBannerProps<T> = {
    banner: T;
    className?: string;
};

const WalletsBannerImage = ({ banner, className }: WalletsBannerProps<keyof typeof WalletsBanners>) => {
    const WalletsBanner = WalletsBanners[banner] as React.ElementType;

    return <WalletsBanner className={className} data-testid={banner} />;
};

export default WalletsBannerImage;
