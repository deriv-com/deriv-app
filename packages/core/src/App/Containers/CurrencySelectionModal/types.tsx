export interface IconProps<T> {
    icon: T;
    className?: string;
    size?: number;
    onClick?: () => void;
}

export type Currency =
    | 'AUD'
    | 'BCH'
    | 'BTC'
    | 'BUSD'
    | 'DAI'
    | 'ETH'
    | 'EURCHECK'
    | 'EUR'
    | 'EURS'
    | 'EUSDT'
    | 'GBP'
    | 'IDK'
    | 'LTC'
    | 'PAX'
    | 'TUSD'
    | 'TUSDT'
    | 'UNKNOWN'
    | 'USD'
    | 'USDC'
    | 'USDK'
    | 'UST'
    | 'VIRTUAL';

export interface AccountListDetail {
    icon: Currency;
    is_disabled: boolean;
    is_virtual: boolean;
    loginid: string;
    title: string;
}
