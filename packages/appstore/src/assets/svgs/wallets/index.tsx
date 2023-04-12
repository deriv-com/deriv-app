import React from 'react';
import UpgradeDesktop from 'Assets/svgs/wallets/wallets-upgrade-desktop.svg';
import UpgradeMobile from 'Assets/svgs/wallets/wallets-upgrade-mobile.svg';
import ReadyDesktop from 'Assets/svgs/wallets/wallets-ready-desktop.svg';
import ReadyDesktopEu from 'Assets/svgs/wallets/wallets-ready-desktop-eu.svg';
import ReadyMobile from 'Assets/svgs/wallets/wallets-ready-mobile.svg';
import ReadyMobileEu from 'Assets/svgs/wallets/wallets-ready-mobile-eu.svg';
import { TImageTestID, TWalletsImagesListKeys, WalletsImageProps } from './image-types';

export const WalletsImagesList = {
    upgrade_desktop: UpgradeDesktop,
    upgrade_mobile: UpgradeMobile,
    upgrading_desktop: ReadyDesktop,
    upgrading_desktop_eu: ReadyDesktopEu,
    upgrading_mobile: ReadyMobile,
    upgrading_mobile_eu: ReadyMobileEu,
    ready_desktop: ReadyDesktop,
    ready_desktop_eu: ReadyDesktopEu,
    ready_mobile: ReadyMobile,
    ready_mobile_eu: ReadyMobileEu,
} as const;

const WalletsImage = ({ image, className, width }: WalletsImageProps<TWalletsImagesListKeys>) => {
    const Component = WalletsImagesList[image] as React.ElementType;
    const data_testid: TImageTestID = `dt_${image}`;

    return <Component className={className} style={{ width }} data-testid={data_testid} />;
};

export default WalletsImage;
