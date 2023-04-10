import React from 'react';
import { TImageTestID, TWalletsImagesListKeys, WalletsImageProps } from './image-types';
import upgrade_desktop from 'Assets/svgs/wallets/wallets-upgrade-desktop.svg';
import upgrade_mobile from 'Assets/svgs/wallets/wallets-upgrade-mobile.svg';
import ready_desktop from 'Assets/svgs/wallets/wallets-ready-desktop.svg';
import ready_desktop_eu from 'Assets/svgs/wallets/wallets-ready-desktop-eu.svg';
import ready_mobile from 'Assets/svgs/wallets/wallets-ready-mobile.svg';
import ready_mobile_eu from 'Assets/svgs/wallets/wallets-ready-mobile-eu.svg';

export const WalletsImagesList = {
    upgrade_desktop,
    upgrade_mobile,
    ready_desktop,
    ready_desktop_eu,
    ready_mobile,
    ready_mobile_eu,
};

const WalletsImage = ({ image, className, width }: WalletsImageProps<TWalletsImagesListKeys>) => {
    const Component = WalletsImagesList[image] as React.ElementType;
    const data_testid: TImageTestID = `dt_${image}`;

    return <Component className={className} style={{ width }} data-testid={data_testid} />;
};

export default WalletsImage;
