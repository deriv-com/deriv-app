/* -------------------------------------------------------------------------- */
/* ACCOUNT TYPES                                                              */
/* -------------------------------------------------------------------------- */
import { DetailsOfEachMT5Loginid, TransferBetweenAccountsResponse } from '@deriv/api-types';
import { TReactChildren, TServerError } from 'Types';

export type TAccount = {
    balance?: string | number;
    currency?: string;
    disabled?: boolean;
    error?: TReactChildren;
    is_crypto?: boolean;
    is_dxtrade?: boolean;
    is_mt?: boolean;
    market_type?: string;
    nativepicker_text?: string;
    platform_icon?: string;
    text?: JSX.Element | string;
    value?: string;
};

export type TMt5LoginList = Array<DetailsOfEachMT5Loginid>;

export type TTransferBetweenAccountsResponse = TransferBetweenAccountsResponse & {
    error: TServerError;
};

export type TAccountsList = {
    account: TAccount;
    idx: string | number;
    is_dark_mode_on: boolean;
    mt5_login_list: TMt5LoginList;
};

export type TTradingPlatformAccountsList = {
    trading_platform_accounts: TAccount &
        {
            account_id: string;
        }[];
};
