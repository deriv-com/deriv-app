import { WalletsImagesList } from './wallets-image';

export type TWalletsImagesListKey = keyof typeof WalletsImagesList;
export type TImageTestID = `dt_${TWalletsImagesListKey}`;

export type WalletsImageProps<T> = {
    image: T;
    className?: string;
    width?: number;
};
