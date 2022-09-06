import { GetAccountStatus, Authorize, DetailsOfEachMT5Loginid } from '@deriv/api-types';

type TAccount = NonNullable<Authorize['account_list']>[0];

export type TClientStore = {
    account_status: GetAccountStatus;
    accounts: { [k: string]: TAccount };
    available_crypto_currencies: string[];
    balance?: string;
    can_change_fiat_currency: boolean;
    currency: string;
    current_currency_type?: string;
    current_fiat_currency?: string;
    is_deposit_lock: boolean;
    is_identity_verification_needed: boolean;
    is_landing_company_loaded: boolean;
    is_logging_in: boolean;
    is_switching: boolean;
    is_virtual: boolean;
    is_withdrawal_lock: boolean;
    local_currency_config: {
        currency: string;
        decimal_places?: number;
    };
    loginid?: string;
    mt5_login_list: DetailsOfEachMT5Loginid[];
    residence: string;
    verification_code: {
        payment_withdraw: string;
    };
};
