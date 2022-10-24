import { GetAccountStatus, Authorize, DetailsOfEachMT5Loginid, GetLimits } from '@deriv/api-types';
import { TAccountsList, TMT5LoginAccount } from 'Types';

type TAccount = NonNullable<Authorize['account_list']>[0];

// balance is missing in @deriv/api-types
type TActiveAccounts = TAccount & {
    balance?: number;
};

type TResponseMt5LoginList = {
    mt5_login_list: Array<DetailsOfEachMT5Loginid>;
};

type TResponseTradingPlatformAccountsList = {
    trading_platform_accounts: Array<TMT5LoginAccount>;
};

type TAuthenticationStatus = { document_status: string; identity_status: string };

export type TClientStore = {
    account_limits: { daily_transfers?: { [k: string]: { allowed: boolean; available: boolean } } };
    account_list: TAccountsList[];
    account_status: GetAccountStatus;
    accounts: { [k: string]: TAccount };
    active_accounts: Array<TActiveAccounts>;
    available_crypto_currencies: string[];
    authentication_status: TAuthenticationStatus;
    balance?: string;
    can_change_fiat_currency: boolean;
    currency: string;
    current_currency_type?: string;
    current_fiat_currency?: string;
    email: string;
    has_active_real_account: boolean;
    has_logged_out: boolean;
    getLimits: () => { get_limits?: GetLimits };
    has_maltainvest_account: boolean;
    initialized_broadcast: boolean;
    is_account_setting_loaded: boolean;
    is_authentication_needed: boolean;
    is_deposit_lock: boolean;
    is_dxtrade_allowed: boolean;
    is_eu: boolean;
    is_financial_account: boolean;
    is_financial_information_incomplete: boolean;
    is_identity_verification_needed: boolean;
    is_landing_company_loaded: boolean;
    is_logged_in: boolean;
    is_logging_in: boolean;
    is_switching: boolean;
    is_tnc_needed: boolean;
    is_virtual: boolean;
    is_withdrawal_lock: boolean;
    landing_company_shortcode: string;
    local_currency_config: { currency: string; decimal_places?: number };
    loginid?: string;
    mt5_login_list: Array<DetailsOfEachMT5Loginid>;
    pre_switch_broadcast: boolean;
    residence: string;
    responseMt5LoginList: ({ mt5_login_list }: TResponseMt5LoginList) => Array<DetailsOfEachMT5Loginid>;
    responseTradingPlatformAccountsList: ({
        trading_platform_accounts,
    }: TResponseTradingPlatformAccountsList) => Array<TMT5LoginAccount>;
    setAccountStatus: (status?: GetAccountStatus) => void;
    setBalanceOtherAccounts: (balance: number) => void;
    setInitialized: (status?: boolean) => void;
    setLogout: (status?: boolean) => void;
    setPreSwitchAccount: (status?: boolean) => void;
    setVerificationCode: (code: string, action: string) => void;
    switch_broadcast: boolean;
    switched: boolean;
    switchEndSignal: () => void;
    standpoint: { iom: string };
    switchAccount: (value?: string) => void;
    updateAccountStatus: () => Promise<void>;
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
