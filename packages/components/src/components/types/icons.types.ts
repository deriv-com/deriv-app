import { MouseEventHandler } from 'react';
import { TGenericObjectType } from './common.types';

export type TIconsManifest = Readonly<{
    // If a new icon category is added, be sure to add it here as well. This is part of the fix for ts(7053)
    brand: string;
    cashier: string;
    common: string;
    contract: string;
    currency: string;
    dxtrade: string;
    mt5: string;
    option: string;
    stock: string;
    tradetype: string;
    underlying: string;
    wallet: string;
}>;

export type TIconProps = {
    className?: string | TGenericObjectType;
    color?: string;
    custom_color?: string;
    data_testid?: string;
    height?: number | string;
    icon: string;
    onClick?: MouseEventHandler;
    onMouseDown?: () => void;
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;
    onTouchStart?: () => void;
    size?: number | string;
    width?: number | string;
    id?: string;
    description?: string;
};
