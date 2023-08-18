import { WalletsImagesList } from './wallets-image';

export type TWalletsImagesListKeys = keyof typeof WalletsImagesList;
export type TImageTestID = `dt_${TWalletsImagesListKeys}`;

export type WalletsImageProps<T> = {
    image: T;
    className?: string;
    width?: number;
};
