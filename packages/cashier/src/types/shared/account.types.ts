/* -------------------------------------------------------------------------- */
/* ACCOUNT TYPES                                                              */
/* -------------------------------------------------------------------------- */
import { DetailsOfEachMT5Loginid } from '@deriv/api-types';

export type TAccount = {
    balance?: string | number;
    currency?: string;
    disabled?: boolean;
    is_dxtrade?: boolean;
    is_mt?: boolean;
    market_type?: string;
    nativepicker_text: string;
    platform_icon?: string;
    text: JSX.Element | string;
    value?: string;
};

export type TMt5LoginList = Array<DetailsOfEachMT5Loginid>;

export type TAccountsList = {
    mt5_login_list: TMt5LoginList;
    account: TAccount;
    idx: string | number;
    is_dark_mode_on: boolean;
};
