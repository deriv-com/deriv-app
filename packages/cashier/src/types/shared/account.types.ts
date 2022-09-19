/* -------------------------------------------------------------------------- */
/* ACCOUNT TYPES                                                              */
/* -------------------------------------------------------------------------- */
import { DetailsOfEachMT5Loginid, TransferBetweenAccountsResponse } from '@deriv/api-types';

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
    value?: string | undefined;
};

export type TTransferAccount = {
    account_type?: 'trading' | 'mt5' | 'wallet' | 'dxtrade' | 'binary';
    sub_account_type?: string;
    balance?: string;
    currency?: string;
    demo_account?: 0 | 1;
    loginid?: string;
    market_type?: 'financial' | 'synthetic';
    mt5_group?: string;
    landing_company_short?: 'bvi' | 'labuan' | 'malta' | 'maltainvest' | 'samoa' | 'svg' | 'vanuatu';
};

export type TTransferBetweensAccounts = TransferBetweenAccountsResponse;

export type TMt5LoginList = Array<DetailsOfEachMT5Loginid>;

export type TAccountsList = {
    mt5_login_list: TMt5LoginList;
    account: TAccount;
    idx: string | number;
    is_dark_mode_on: boolean;
};
