import type {
    AccountLimitsResponse,
    Authorize,
    DetailsOfEachMT5Loginid,
    GetAccountStatus,
    GetLimits,
    GetSettings,
    LogOutResponse,
    ResidenceList,
    StatesList,
    ProposalOpenContract,
} from '@deriv/api-types';
import type { Moment } from 'moment';
import type { RouteComponentProps } from 'react-router';
import type { ExchangeRatesStore, FeatureFlagsStore } from './src/stores';

type TPopulateSettingsExtensionsMenuItem = {
    icon: string;
    label: string;
    value: <T extends object>(props: T) => JSX.Element;
};

type TAccountLimitsCollection = {
    name: string;
    level?: string;
    payout_limit: number;
    profile_name: string;
    turnover_limit: number;
};
type TAccount_limits = {
    account_balance: string | number;
    api_initial_load_error?: string;
    daily_transfers?: object;
    lifetime_limit?: number;
    market_specific: {
        commodities: TAccountLimitsCollection[];
        cryptocurrency: TAccountLimitsCollection[];
        forex: TAccountLimitsCollection[];
        indices: TAccountLimitsCollection[];
        synthetic_index: TAccountLimitsCollection[];
    };
    num_of_days?: number;
    num_of_days_limit: string | number;
    open_positions?: React.ReactNode;
    payout: string | number;
    remainder: string | number;
    withdrawal_for_x_days_monetary?: number;
    withdrawal_since_inception_monetary: string | number;
};
type TAccount = NonNullable<Authorize['account_list']>[0] & {
    balance?: number;
};

type TAccountsList = {
    account?: {
        balance?: string | number;
        currency?: string;
        disabled?: boolean;
        error?: JSX.Element | string;
        is_crypto?: boolean;
        is_dxtrade?: boolean;
        is_mt?: boolean;
        market_type?: string;
        nativepicker_text?: string;
        platform_icon?: {
            Derived: React.SVGAttributes<SVGElement>;
            Financial: React.SVGAttributes<SVGElement>;
            Options: React.SVGAttributes<SVGElement>;
            CFDs: React.SVGAttributes<SVGAElement>;
        };
        text?: JSX.Element | string;
        value?: string;
    };
    icon?: string;
    idx?: string | number;
    is_dark_mode_on?: boolean;
    is_virtual?: boolean | number;
    loginid?: string;
    mt5_login_list?: DetailsOfEachMT5Loginid[];
    title?: string;
}[];

// balance is missing in @deriv/api-types
type TActiveAccount = TAccount & {
    is_virtual: number;
    landing_company_shortcode: 'costarica' | 'iom' | 'malta' | 'maltainvest' | 'svg';
};

type TTradingPlatformAvailableAccount = {
    market_type: 'financial' | 'gaming' | 'all';
    name: string;
    requirements: {
        after_first_deposit: {
            financial_assessment: string[];
        };
        compliance: {
            mt5: string[];
            tax_information: string[];
        };
        signup: string[];
    };
    shortcode: 'bvi' | 'labuan' | 'svg' | 'vanuatu';
    sub_account_type: string;
};

type TAuthenticationStatus = { document_status: string; identity_status: string };

type TMenuItem = {
    icon: JSX.Element;
    id: string;
    link_to: string | boolean;
    login_only: boolean;
    onClick: boolean | (() => void);
    text: () => string;
};

type TAddToastProps = {
    content: string;
    key: string;
    type: string;
};

type TButtonProps = {
    onClick: () => void;
    text: string;
};

type TNotificationMessage = {
    action?: {
        onClick: () => void;
        route?: string;
        text: string;
    };
    className?: string;
    cta_btn?: TButtonProps;
    header_popup?: string;
    header: string;
    img_alt?: string;
    img_src?: string;
    is_disposable?: boolean;
    is_persistent?: boolean;
    key: string;
    message_popup?: string;
    message: string | JSX.Element;
    platform?: string;
    primary_btn?: TButtonProps;
    secondary_btn?: TButtonProps;
    should_hide_close_btn?: boolean;
    timeout?: number;
    timeoutMessage?: (remaining: number | string) => string;
    type: string;
};

type TNotification =
    | TNotificationMessage
    | ((withdrawal_locked: boolean, deposit_locked: boolean) => TNotificationMessage)
    | ((excluded_until: number) => TNotificationMessage);

type TClientStore = {
    accounts: { [k: string]: TActiveAccount };
    active_accounts: TActiveAccount[];
    active_account_landing_company: string;
    account_list: TAccountsList;
    account_settings: GetSettings;
    account_status: Omit<GetAccountStatus, 'status'> & Partial<Pick<GetAccountStatus, 'status'>>;
    available_crypto_currencies: string[];
    account_limits: Partial<AccountLimitsResponse['get_limits']> & {
        is_loading?: boolean;
        api_initial_load_error?: string;
    };
    authentication_status: TAuthenticationStatus;
    balance?: string | number;
    can_change_fiat_currency: boolean;
    cfd_score: number;
    currency: string;
    current_currency_type?: string;
    current_fiat_currency?: string;
    default_currency: string;
    derivez_accounts_list: DetailsOfEachMT5Loginid[];
    dxtrade_accounts_list: DetailsOfEachMT5Loginid[];
    email: string;
    fetchResidenceList: () => Promise<ResidenceList>;
    fetchStatesList: () => Promise<StatesList>;
    getChangeableFields: () => string[];
    getLimits: () => Promise<{ get_limits?: GetLimits }>;
    has_active_real_account: boolean;
    has_any_real_account: boolean;
    has_changed_two_fa: boolean;
    has_enabled_two_fa: boolean;
    has_logged_out: boolean;
    has_maltainvest_account: boolean;
    has_residence: boolean;
    initialized_broadcast: boolean;
    is_account_setting_loaded: boolean;
    is_authentication_needed: boolean;
    is_authorize: boolean;
    is_crypto: (currency?: string) => boolean;
    is_deposit_lock: boolean;
    is_dxtrade_allowed: boolean;
    is_fully_authenticated: boolean;
    is_eu: boolean;
    is_eu_country: boolean;
    is_financial_account: boolean;
    is_financial_information_incomplete: boolean;
    is_identity_verification_needed: boolean;
    is_landing_company_loaded: boolean;
    is_logged_in: boolean;
    is_logging_in: boolean;
    is_low_risk: boolean;
    is_pending_proof_of_ownership: boolean;
    is_populating_account_list: boolean;
    is_social_signup: boolean;
    is_switching: boolean;
    is_tnc_needed: boolean;
    is_trading_experience_incomplete: boolean;
    is_uk: boolean;
    is_virtual: boolean;
    is_withdrawal_lock: boolean;
    landing_company_shortcode: string;
    local_currency_config: {
        currency: string;
        decimal_places?: number;
    };
    loginid?: string;
    logout: () => Promise<LogOutResponse>;
    mt5_login_list: DetailsOfEachMT5Loginid[];
    pre_switch_broadcast: boolean;
    real_account_creation_unlock_date: number;
    resetVirtualBalance: () => Promise<void>;
    residence: string;
    residence_list: ResidenceList;
    responseMt5LoginList: ({
        mt5_login_list,
    }: {
        mt5_login_list: DetailsOfEachMT5Loginid[];
    }) => DetailsOfEachMT5Loginid[];
    responseTradingPlatformAccountsList: ({
        trading_platform_accounts,
    }: {
        trading_platform_accounts: DetailsOfEachMT5Loginid[];
    }) => DetailsOfEachMT5Loginid[];
    setAccountStatus: (status?: GetAccountStatus) => void;
    setBalanceOtherAccounts: (balance: number) => void;
    setCFDScore: (score: number) => void;
    setInitialized: (status?: boolean) => void;
    setLogout: (status?: boolean) => void;
    setPrevAccountType: (account_type: string) => void;
    setPreSwitchAccount: (status?: boolean) => void;
    setP2pAdvertiserInfo: () => void;
    setTwoFAStatus: (status: boolean) => void;
    setTwoFAChangedStatus: (status: boolean) => void;
    setVerificationCode: (code: string, action: string) => void;
    setVisibilityRealityCheck: (value: boolean) => void;
    should_allow_authentication: boolean;
    standpoint: {
        iom: string;
        svg: string;
        malta: string;
        maltainvest: string;
        gaming_company: string;
        financial_company: string;
    };
    states_list: StatesList;
    switched: boolean;
    switchAccount: (value?: string) => Promise<void>;
    switchEndSignal: () => void;
    switch_broadcast: boolean;
    trading_platform_available_accounts: TTradingPlatformAvailableAccount[];
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
    updateAccountStatus: () => Promise<void>;
};

type TCommonStoreError = {
    app_routing_history: unknown[];
    header: string | JSX.Element;
    message: string | JSX.Element;
    redirectOnClick: () => void;
    redirect_label: string;
    redirect_to: string;
    setError: (has_error: boolean, error: React.ReactNode | null) => void;
    should_clear_error_on_click: boolean;
    should_show_refresh: boolean;
    type?: string;
};

type TCommonStore = {
    changeCurrentLanguage: (new_language: string) => void;
    changeSelectedLanguage: (key: string) => Promise<void>;
    current_language: string;
    error: TCommonStoreError;
    has_error: boolean;
    isCurrentLanguage(language_code: string): boolean;
    is_from_derivgo: boolean;
    is_language_changing: boolean;
    is_mobile_language_menu_open: boolean;
    is_network_online: boolean;
    platform: string;
    routeBackInApp: (history: Pick<RouteComponentProps, 'history'>, additional_platform_path?: string[]) => void;
    routeTo: (pathname: string) => void;
    server_time?: Moment;
    setMobileLanguageMenuOpen: (is_mobile_language_menu_open: boolean) => void;
};

type TUiStore = {
    addToast: (toast_config: TAddToastProps) => void;
    app_contents_scroll_ref: React.MutableRefObject<null | HTMLDivElement>;
    current_focus: string | null;
    disableApp: () => void;
    enableApp: () => void;
    has_real_account_signup_ended: boolean;
    is_cashier_visible: boolean;
    is_closing_create_real_account_modal: boolean;
    is_dark_mode_on: boolean;
    is_ready_to_deposit_modal_visible: boolean;
    is_real_acc_signup_on: boolean;
    is_need_real_account_for_cashier_modal_visible: boolean;
    is_reports_visible: boolean;
    is_language_settings_modal_on: boolean;
    is_mobile: boolean;
    is_tablet: boolean;
    notification_messages_ui: React.FC | null;
    openRealAccountSignup: (
        value: 'maltainvest' | 'svg' | 'add_crypto' | 'choose' | 'add_fiat' | 'set_currency' | 'manage'
    ) => void;
    populateHeaderExtensions: (header_items: JSX.Element | null) => void;
    populateSettingsExtensions: (menu_items: Array<TPopulateSettingsExtensionsMenuItem> | null) => void;
    removeToast: (key: string) => void;
    reports_route_tab_index: number;
    should_show_cancellation_warning: boolean;
    setShouldShowCooldownModal: (value: boolean) => void;
    setCurrentFocus: (value: string) => void;
    setDarkMode: (is_dark_mode_on: boolean) => boolean;
    setReportsTabIndex: (value: number) => void;
    setIsClosingCreateRealAccountModal: (value: boolean) => void;
    setRealAccountSignupEnd: (status: boolean) => void;
    setSubSectionIndex: (index: number) => void;
    sub_section_index: number;
    shouldNavigateAfterChooseCrypto: (value: string) => void;
    toggleAccountsDialog: () => void;
    toggleCashier: () => void;
    toggleCancellationWarning: (state_change: boolean) => void;
    toggleLanguageSettingsModal: () => void;
    toggleNeedRealAccountForCashierModal: () => void;
    toggleReadyToDepositModal: () => void;
    toggleReports: (is_visible: boolean) => void;
    toggleSetCurrencyModal: () => void;
    toggleShouldShowRealAccountsList: (value: boolean) => void;
    toggleUnsupportedContractModal: (state_change: boolean) => void;
};

type TPortfolioStore = {
    active_positions: ProposalOpenContract[];
    error: TCommonStoreError;
    getPositionById: (id: number) => ProposalOpenContract;
    is_accumulator: boolean;
    is_loading: boolean;
    is_multiplier: boolean;
    onClickCancel: (contract_id: number) => void;
    onClickSell: (contract_id: number) => void;
    onMount: () => void;
    removePositionById: (id: number) => void;
};

type TContractStore = {
    getContractById: (id: number) => ProposalOpenContract;
};

type TMenuStore = {
    attach: (item: TMenuItem) => void;
    update: (menu: TMenuItem, index: number) => void;
};

type TNotificationStore = {
    addNotificationMessage: (message: TNotification) => void;
    addNotificationMessageByKey: (key: string) => void;
    client_notifications: object;
    filterNotificationMessages: () => void;
    refreshNotifications: () => void;
    removeNotificationByKey: (obj: { key: string }) => void;
    removeNotificationMessage: (obj: { key: string; should_show_again?: boolean }) => void;
    setP2POrderProps: () => void;
    setP2PRedirectTo: () => void;
    showAccountSwitchToRealNotification: (loginid: string, currency: string) => void;
};

type TTradersHubStore = {
    CFDs_restricted_countries: boolean;
    closeModal: () => void;
    combined_cfd_mt5_accounts: DetailsOfEachMT5Loginid &
        {
            short_code_and_region: string;
            login: string;
            sub_title: string;
            icon: 'Derived' | 'Financial' | 'Options' | 'CFDs';
        }[];
    content_flag: 'low_risk_cr_eu' | 'low_risk_cr_non_eu' | 'high_risk_cr' | 'cr_demo' | 'eu_demo' | 'eu_real' | '';
    financial_restricted_countries: boolean;
    is_demo: boolean;
    is_eu_user: boolean;
    is_low_risk_cr_eu_real: boolean;
    is_real: boolean;
    multipliers_account_status: string;
    no_CR_account: boolean;
    no_MF_account: boolean;
    openFailedVerificationModal: (selected_account_type: string) => void;
    openModal: (modal_id: string, props?: unknown) => void;
    selectRegion: (region: string) => void;
    selectAccountType: (account_type: string) => void;
    selected_account_type: string;
    selected_account: {
        login: string;
        account_id: string;
    };
    selected_region: string;
    setSelectedAccount: (account: { login?: string; account_id?: string }) => void;
    setTogglePlatformType: (platform_type: string) => void;
    toggleAccountTransferModal: () => void;
    toggleRegulatorsCompareModal: () => void;
};

/**
 * This is the type that contains all the `core` package stores
 */
export type TCoreStores = {
    client: TClientStore;
    contract_trade: TContractStore;
    common: TCommonStore;
    menu: TMenuStore;
    // This should be `any` as this property will be handled in each package.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    modules: Record<string, any>;
    notifications: TNotificationStore;
    portfolio: TPortfolioStore;
    traders_hub: TTradersHubStore;
    ui: TUiStore;
};

export type TStores = TCoreStores & {
    exchange_rates: ExchangeRatesStore;
    feature_flags: FeatureFlagsStore;
};
