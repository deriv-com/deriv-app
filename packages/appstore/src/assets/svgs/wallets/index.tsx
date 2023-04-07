import React from 'react';
import UpgradeDesktop from 'Assets/svgs/wallets/wallets-upgrade-desktop.svg';
import UpgradeMobile from 'Assets/svgs/wallets/wallets-upgrade-mobile.svg';

export const WalletsImagesList = {
    UpgradeDesktop,
    UpgradeMobile,
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
