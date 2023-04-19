import React from 'react';
import { TImageTestID, TWalletsImagesListKeys, WalletsImageProps } from '../image-types';

export const WalletsImagesList = {
    test: 'test',
} as const;

const WalletsImage = ({ image, className, width }: WalletsImageProps<TWalletsImagesListKeys>) => {
    const Component = WalletsImagesList[image] as React.ElementType;
    const data_testid: TImageTestID = `dt_${image}`;

    return <Component className={className} style={{ width }} data-testid={data_testid} />;
};

export default WalletsImage;
