import { GetAccountStatus, Authorize, DetailsOfEachMT5Loginid } from '@deriv/api-types';

type TAccount = NonNullable<Authorize['account_list']>[0];

export type TClientStore = {
    account_status: GetAccountStatus;
    accounts: { [k: string]: TAccount };
    balance?: string;
    currency: string;
    current_currency_type?: string;
    current_fiat_currency?: string;
    is_deposit_lock: boolean;
    is_identity_verification_needed: boolean;
    is_logging_in: boolean;
    is_switching: boolean;
    is_virtual: boolean;
    is_withdrawal_lock: boolean;
    local_currency_config: {
        currency: string;
        decimal_places?: number;
    };
    loginid?: string;
    residence: string;
    verification_code: {
        payment_withdraw: string;
    };
    setVerificationCode: (code: string, action: string) => void;
    updateAccountStatus: () => Promise<void>;
    mt5_login_list: DetailsOfEachMT5Loginid[];
    is_authentication_needed: boolean;
    is_tnc_needed: boolean;
    is_financial_account: boolean;
    is_financial_information_incomplete: boolean;
    is_trading_experience_incomplete: boolean;
    is_eu: boolean;
};
