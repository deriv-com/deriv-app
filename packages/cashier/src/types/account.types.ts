/* -------------------------------------------------------------------------- */
/* ACCOUNT TYPES                                                              */
/* -------------------------------------------------------------------------- */
import { DetailsOfEachMT5Loginid, TransferBetweenAccountsResponse } from '@deriv/api-types';

export type TPlatformIcon = 'Derived' | 'Financial' | 'Options' | 'CFDs';

export type TAccount = {
    balance?: string | number;
    currency?: string;
    disabled?: boolean;
    error?: JSX.Element | string;
    is_crypto?: boolean;
    is_derivez?: boolean;
    is_dxtrade?: boolean;
    is_mt?: boolean;
    market_type?: string;
    nativepicker_text?: string;
    platform_icon?: TPlatformIcon;
    status?: null | string;
    text?: JSX.Element | string;
    value?: string;
};

export type TTransferAccount = NonNullable<TransferBetweenAccountsResponse['accounts']>[number] & {
    currency?: string;
    landing_company_short?: string;
    login?: string;
    loginid?: string;
    sub_account_type?: 'standard' | 'financial' | 'financial_stp';
};

export type TAccountsList = {
    account: TAccount;
    icon?: string;
    idx: string | number;
    is_dark_mode_on?: boolean;
    loginid?: string;
    mt5_login_list?: DetailsOfEachMT5Loginid[];
    title?: string;
};
