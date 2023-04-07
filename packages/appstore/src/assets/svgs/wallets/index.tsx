import React from 'react';
import UpgradeDesktop from 'Assets/svgs/wallets/wallets-upgrade-desktop.svg';
import UpgradeMobile from 'Assets/svgs/wallets/wallets-upgrade-mobile.svg';
import UpgradingDesktop from 'Assets/svgs/wallets/wallets-upgrading-desktop.svg';
import UpgradingMobile from 'Assets/svgs/wallets/wallets-upgrading-mobile.svg';
import UpgradingDesktopEU from 'Assets/svgs/wallets/wallets-upgrading-desktop-eu.svg';
import UpgradingMobileEU from 'Assets/svgs/wallets/wallets-upgrading-mobile-eu.svg';
import ReadyDesktop from 'Assets/svgs/wallets/wallets-ready-desktop.svg';
import ReadyMobile from 'Assets/svgs/wallets/wallets-ready-mobile.svg';
import ReadyDesktopEU from 'Assets/svgs/wallets/wallets-ready-desktop-eu.svg';
import ReadyMobileEU from 'Assets/svgs/wallets/wallets-ready-mobile-eu.svg';

export const WalletsImagesList = {
    UpgradeDesktop,
    UpgradeMobile,
    UpgradingDesktop,
    UpgradingMobile,
    UpgradingDesktopEU,
    UpgradingMobileEU,
    ReadyDesktop,
    ReadyMobile,
    ReadyDesktopEU,
    ReadyMobileEU,
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
