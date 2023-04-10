import React from 'react';
import ReadyToUpdateWalletsIcon from './ic-wallet-upgrade-form.svg';

export const WalletsImagesList = {
    ReadyToUpdateWalletsIcon,
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
