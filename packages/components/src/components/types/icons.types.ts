export interface IIconsManifest {
    // If a new icon category is added, be sure to add it here as well. This is part of the fix for ts(7053)
    readonly brand: string;
    readonly cashier: string;
    readonly common: string;
    readonly contract: string;
    readonly currency: string;
    readonly dxtrade: string;
    readonly flag: string;
    readonly mt5: string;
    readonly option: string;
    readonly stock: string;
    readonly tradetype: string;
    readonly underlying: string;
    readonly wallet: string;
}
export type TIconProps = {
    className?: string;
    color?: string;
    custom_color?: string;
    data_testid?: string;
    height?: number | string;
    icon: string;
    onClick?: () => void;
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;
    size?: number | string;
    width?: number | string;
    id?: string;
};
