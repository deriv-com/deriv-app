/** Add types that are shared between components */
import { ApiToken } from '@deriv/api-types';

type TradingAccountDetail = {
    linked_to: {
        account_id: string;
        balance: string;
        currency: string;
        payment_method: string;
    };
};

export type TAuthAccountInfo = {
    account_type: 'trading' | 'wallet';
    balance: number;
    country: string | undefined;
    created_at: number;
    currency: string;
    email: string;
    is_disabled: 0 | 1;
    is_virtual: 0 | 1;
    landing_company_name: string;
    landing_company_shortcode: string;
    residence: string;
    trading: TradingAccountDetail;
};

export type TPlatformContext = {
    is_appstore: boolean;
};

export type TCurrencyInfo = {
    fractional_digits: number;
    is_deposit_suspended: 0 | 1;
    is_suspended: 0 | 1;
    is_withdrawal_suspended: 0 | 1;
    name: string;
    stake_default: number;
    transfer_between_accounts: {
        fees: {
            [key: string]: number;
        };
        limits: {
            max: number;
            min: number;
        } | null;
    };
    type: 'fiat' | 'crypto';
    value: string;
};

export type TFormValidation = {
    warnings: { [key: string]: string };
    errors: { [key: string]: string };
};

export type TRealAccount = {
    active_modal_index: number;
    current_currency: string;
    error_message: string;
    previous_currency: string;
    success_message: string;
    error_code: number;
};

export type TApiContext = {
    api_tokens: ApiToken[];
    deleteToken: () => void;
};
