/* -------------------------------------------------------------------------- */
/* ACCOUNT TYPES                                                              */
/* -------------------------------------------------------------------------- */
import { DetailsOfEachMT5Loginid } from '@deriv/api-types';
import { PlatformIcons } from '../../assets/svgs/trading-platform/index';

export type TAccount = {
    balance?: string | number;
    currency?: string;
    disabled?: boolean;
    is_dxtrade?: boolean;
    is_derivez?: boolean;
    is_mt?: boolean;
    market_type?: string;
    nativepicker_text: string;
    platform_icon?: string & keyof typeof PlatformIcons;
    text: JSX.Element | string;
    value?: string;
};

export type TMt5LoginList = Array<DetailsOfEachMT5Loginid>;

export type TAccountsList = {
    account: TAccount;
    idx: string | number;
    is_pre_appstore: boolean;
};
