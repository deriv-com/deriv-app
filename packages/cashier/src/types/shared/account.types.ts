/* -------------------------------------------------------------------------- */
/* ACCOUNT TYPES                                                              */
/* -------------------------------------------------------------------------- */
import { DetailsOfEachMT5Loginid, TransferBetweenAccountsResponse } from '@deriv/api-types';

type TPlatform = 'dxtrade' | 'mt5';

export type TAccount = {
    balance?: string | number;
    currency?: string;
    disabled?: boolean;
    error?: JSX.Element | string;
    is_crypto?: boolean;
    is_dxtrade?: boolean;
    is_derivez?: boolean;
    is_mt?: boolean;
    market_type?: string;
    nativepicker_text?: string;
    platform_icon?: string;
    status?: string;
    text?: JSX.Element | string;
    value?: string;
};

export type TTransferAccount = {
    account_type: TPlatform;
    balance?: string;
    currency?: string;
    demo_account?: 0 | 1;
    landing_company_short?: 'bvi' | 'labuan' | 'malta' | 'maltainvest' | 'samoa' | 'svg' | 'vanuatu';
    loginid?: string;
    market_type?: 'all' | 'financial' | 'synthetic';
    mt5_group?: string;
    status?: string;
    sub_account_type?: 'financial' | 'financial_stp' | 'swap_free';
};

export type TTransferBetweensAccounts = TransferBetweenAccountsResponse;

export type TMt5LoginList = Array<DetailsOfEachMT5Loginid>;

// TODO: this type can be removed when account_id is added to the @deriv/api-types
export type TMT5LoginAccount = DetailsOfEachMT5Loginid & {
    account_id?: string;
    loginid?: string;
};

export type TAccountsList = {
    account: TAccount;
    icon?: string;
    idx: string | number;
    is_dark_mode_on?: boolean;
    is_virtual?: boolean;
    loginid?: string;
    mt5_login_list?: TMt5LoginList;
    title?: string;
};
