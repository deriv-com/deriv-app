import type { GetAccountStatus, Authorize, DetailsOfEachMT5Loginid, LogOutResponse } from '@deriv/api-types';
import type { RouteComponentProps } from 'react-router';

type TAccount = NonNullable<Authorize['account_list']>[0];

type TAuthenticationStatus = { document_status: string; identity_status: string };

type TClientStore = {
    accounts: { [k: string]: TAccount };
    active_account_landing_company: string;
    account_limits: {
        daily_transfers?: {
            [k: string]: {
                allowed: boolean;
                available: boolean;
            };
        };
    };
    account_status: GetAccountStatus;
    balance?: string;
    can_change_fiat_currency: boolean;
    currency: string;
    current_currency_type?: string;
    current_fiat_currency?: string;
    getLimits: () => void;
    is_account_setting_loaded: boolean;
    is_eu: boolean;
    is_deposit_lock: boolean;
    is_dxtrade_allowed: boolean;
    is_financial_account: boolean;
    is_financial_information_incomplete: boolean;
    is_trading_experience_incomplete: boolean;
    is_identity_verification_needed: boolean;
    is_logged_in: boolean;
    is_logging_in: boolean;
    is_pre_appstore: boolean;
    is_switching: boolean;
    is_tnc_needed: boolean;
    is_virtual: boolean;
    is_withdrawal_lock: boolean;
    landing_company_shortcode: string;
    local_currency_config: {
        currency: string;
        decimal_places?: number;
    };
    loginid?: string;
    residence: string;
    standpoint: {
        iom: string;
    };
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
    email: string;
    setVerificationCode: (code: string, action: string) => void;
    updateAccountStatus: () => Promise<void>;
    is_authentication_needed: boolean;
    authentication_status: TAuthenticationStatus;
    mt5_login_list: DetailsOfEachMT5Loginid[];
    is_risky_client: boolean;
    logout: () => Promise<LogOutResponse>;
    should_allow_authentication: boolean;
    is_landing_company_loaded: boolean;
};

type TCommonStoreError = {
    header: string | JSX.Element;
    message: string | JSX.Element;
    type?: string;
    redirect_label: string;
    redirect_to: string;
    should_clear_error_on_click: boolean;
    should_show_refresh: boolean;
    redirectOnClick: () => void;
    setError: (has_error: boolean, error: TCommonStoreError | null) => void;
    app_routing_history: unknown[];
};

type TCommonStore = {
    error: TCommonStoreError;
    is_from_derivgo: boolean;
    has_error: boolean;
    platform: string;
    routeBackInApp: (history: Pick<RouteComponentProps, 'history'>, additional_platform_path?: string[]) => void;
    routeTo: (pathname: string) => void;
    changeCurrentLanguage: (new_language: string) => void;
};

type TUiStore = {
    current_focus: string | null;
    is_cashier_visible: boolean;
    is_dark_mode_on: boolean;
    is_mobile: boolean;
    disableApp: () => void;
    enableApp: () => void;
    setCurrentFocus: (value: string) => void;
    toggleAccountsDialog: () => void;
    toggleCashier: () => void;
    setDarkMode: (is_dark_mode_on: boolean) => boolean;
};

type TTradersHubStore = {
    closeModal: () => void;
    content_flag: any;
    openModal: (modal_id: string, props?: any) => void;
};

export type TRootStore = {
    client: TClientStore;
    common: TCommonStore;
    ui: TUiStore;
    modules: Record<string, any>;
    traders_hub: TTradersHubStore;
};
