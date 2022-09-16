import { GetAccountStatus, Authorize, DetailsOfEachMT5Loginid, GetLimits } from '@deriv/api-types';
import { TAccountsList } from 'types/shared';

type TAccount = NonNullable<Authorize['account_list']>[0];

export type TClientStore = {
    accounts: { [k: string]: TAccount };
    account_limits: {
        daily_transfers?: {
            [k: string]: {
                allowed: boolean;
                available: boolean;
            };
        };
    };
    account_list: TAccountsList[];
    account_status: GetAccountStatus;
    balance?: string;
    currency: string;
    current_currency_type?: string;
    current_fiat_currency?: string;
    getLimits: () => { get_limits?: GetLimits };
    is_account_setting_loaded: boolean;
    is_deposit_lock: boolean;
    is_dxtrade_allowed: boolean;
    is_financial_account: boolean;
    is_financial_information_incomplete: boolean;
    is_trading_experience_incomplete: boolean;
    is_identity_verification_needed: boolean;
    is_logged_in: boolean;
    is_logging_in: boolean;
    is_switching: boolean;
    is_virtual: boolean;
    is_withdrawal_lock: boolean;
    local_currency_config: {
        currency: string;
        decimal_places?: number;
    };
    loginid?: string;
    mt5_login_list: Array<DetailsOfEachMT5Loginid>;
    residence: string;
    switchAccount: (value?: string) => void;
    verification_code: {
        payment_agent_withdraw: string;
        payment_withdraw: string;
        request_email: string;
        reset_password: string;
        signup: string;
        system_email_change: string;
        trading_platform_dxtrade_password_reset: string;
        trading_platform_mt5_password_reset: string;
    };
};
