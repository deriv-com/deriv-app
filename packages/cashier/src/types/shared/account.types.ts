/* -------------------------------------------------------------------------- */
/* ACCOUNT TYPES                                                              */
/* -------------------------------------------------------------------------- */
import { DetailsOfEachMT5Loginid } from '@deriv/api-types';

export type TAccount = {
    balance?: string | number;
    currency?: string;
    disabled?: boolean;
    error?: JSX.Element | string;
    is_crypto?: boolean;
    is_dxtrade?: boolean;
    is_mt?: boolean;
    market_type?: string;
    nativepicker_text?: string;
    platform_icon?: string;
    text?: JSX.Element | string;
    value?: string;
};

export type TTransferAccount = {
    account_type?: 'trading' | 'mt5' | 'wallet' | 'dxtrade' | 'binary';
    balance?: string;
    currency?: string;
    demo_account?: 0 | 1;
    landing_company_short?: 'bvi' | 'labuan' | 'malta' | 'maltainvest' | 'samoa' | 'svg' | 'vanuatu';
    loginid?: string;
    market_type?: 'financial' | 'synthetic';
    mt5_group?: string;
    status?: string;
    sub_account_type?: string;
};

export type TAccountsList = {
    account: TAccount;
    icon?: string;
    idx: string | number;
    is_dark_mode_on: boolean;
    loginid?: string;
    mt5_login_list: DetailsOfEachMT5Loginid[];
    title?: string;
};
