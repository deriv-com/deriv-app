import React from 'react';
import upgrade_desktop from 'Assets/svgs/wallets/wallets-upgrade-desktop.svg';
import upgrade_mobile from 'Assets/svgs/wallets/wallets-upgrade-mobile.svg';
import { TImageTestID, TWalletsImagesListKeys, WalletsImageProps } from './image-types';

export const WalletsImagesList = {
    upgrade_desktop,
    upgrade_mobile,
};

const WalletsImage = ({ image, className, width }: WalletsImageProps<TWalletsImagesListKeys>) => {
    const Component = WalletsImagesList[image] as React.ElementType;
    const data_testid: TImageTestID = `dt_${image}`;

    return <Component className={className} style={{ width }} data-testid={data_testid} />;
};

export default WalletsImage;
