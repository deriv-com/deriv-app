import React from 'react';
import type { RouteComponentProps } from 'react-router';
import type { Moment } from 'moment';
import type {
    AccountLimitsResponse,
    Authorize,
    ContractUpdate,
    DetailsOfEachMT5Loginid,
    GetAccountStatus,
    GetLimits,
    GetSettings,
    LandingCompany,
    LogOutResponse,
    Portfolio1,
    ProposalOpenContract,
    ResidenceList,
    SetFinancialAssessmentRequest,
    SetFinancialAssessmentResponse,
    StatesList,
} from '@deriv/api-types';
import type { ExchangeRatesStore, FeatureFlagsStore } from './src/stores';

type TRoutes =
    | '/'
    | '/account'
    | '/account/account-limits'
    | '/account/api-token'
    | '/account-closed'
    | '/account/closing-account'
    | '/account/connected-apps'
    | '/account/deactivate-account'
    | '/account/financial-assessment'
    | '/account/languages'
    | '/account/login-history'
    | '/account/passwords'
    | '/account/personal-details'
    | '/account/proof-of-address'
    | '/account/proof-of-identity'
    | '/account/proof-of-ownership'
    | '/account/self-exclusion'
    | '/account/trading-assessment'
    | '/account/two-factor-authentication'
    | '/appstore'
    | '/appstore/onboarding'
    | '/appstore/traders-hub'
    | '/bot'
    | '/cashier'
    | '/cashier/account-transfer'
    | '/cashier/crypto-transactions'
    | '/cashier/deposit'
    | '/cashier/on-ramp'
    | '/cashier/payment-agent'
    | '/cashier/payment-agent-transfer'
    | '/cashier/p2p'
    | '/cashier/p2p/profile'
    | '/cashier/p2p/verification'
    | '/cashier/withdrawal'
    | '/complaints-policy'
    | '/contract/:contract_id'
    | '/derivx'
    | '/endpoint'
    | '/index'
    | '/mt5'
    | '/redirect'
    | '/reports'
    | '/reports/positions'
    | '/reports/profit'
    | '/reports/statement'
    | '/settings/account_password'
    | '/settings/apps'
    | '/settings/cashier_password'
    | '/settings/exclusion'
    | '/settings/financial'
    | '/settings/history'
    | '/settings/limits'
    | '/settings/personal'
    | '/settings'
    | '/settings/token'
    | '/404';

type TPopulateSettingsExtensionsMenuItem = {
    icon: string;
    label: string;
    value: <T extends object>(props: T) => JSX.Element;
};

type TPortfolioPosition = {
    contract_info: ProposalOpenContract &
        Portfolio1 & {
            contract_update?: ContractUpdate;
        };
    contract_update: ProposalOpenContract['limit_order'];
    details?: string;
    display_name: string;
    id?: number;
    indicative: number;
    is_sell_requested: boolean;
    is_unsupported: boolean;
    payout?: number;
    profit_loss: number;
    purchase?: number;
    reference: number;
    type?: string;
};

type TAppRoutingHistory = {
    action: string;
    hash: string;
    key: string;
    pathname: string;
    search: string;
};

type TAccount = NonNullable<Authorize['account_list']>[0] & {
    balance?: number;
};

type TCtraderAccountsList = DetailsOfEachMT5Loginid & {
    display_balance?: string;
    platform?: string;
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
    trader_accounts_list?: DetailsOfEachMT5Loginid[];
    mt5_login_list?: DetailsOfEachMT5Loginid[];
    title?: string;
}[];

// balance is missing in @deriv/api-types
type TActiveAccount = TAccount & {
    is_virtual: number;
    landing_company_shortcode: 'svg' | 'costarica' | 'maltainvest' | 'malta' | 'iom';
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
    shortcode: 'bvi' | 'labuan' | 'svg' | 'vanuatu' | 'maltainvest';
    sub_account_type: string;
};

type TAvailableCFDAccounts = {
    availability: 'Non-EU' | 'EU' | 'All';
    description: string;
    icon: 'Derived' | 'Financial' | 'DerivX' | 'SwapFree' | 'Ctrader';
    market_type: 'synthetic' | 'financial' | 'all' | 'gaming';
    name: string;
    platform: 'mt5' | 'dxtrade' | 'ctrader';
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
    header: string;
    header_popup?: string;
    img_alt?: string;
    img_src?: string;
    is_disposable?: boolean;
    is_persistent?: boolean;
    key: string;
    message: string | JSX.Element;
    message_popup?: string;
    platform?: string;
    primary_btn?: TButtonProps;
    secondary_btn?: TButtonProps;
    should_hide_close_btn?: boolean;
    timeout?: number;
    timeoutMessage?: (remaining: number | string) => string;
    type: string;
};

type TNotification =
    | ((excluded_until: number) => TNotificationMessage)
    | TNotificationMessage
    | ((withdrawal_locked: boolean, deposit_locked: boolean) => TNotificationMessage);

type TStandPoint = {
    financial_company: string;
    gaming_company: string;
    iom: boolean;
    malta: boolean;
    maltainvest: boolean;
    svg: boolean;
};

type TMt5StatusServerType = {
    all: number;
    deposits?: number;
    platform: number;
    server_number: number;
    withdrawals?: number;
};

type TDXTraderStatusServerType = Record<'all' | 'demo' | 'real', number>;

type TMt5StatusServer = Record<'demo' | 'real', TMt5StatusServerType[]>;

type TClientStore = {
    accounts: { [k: string]: TActiveAccount };
    active_accounts: TActiveAccount[];
    active_account_landing_company: string;
    account_limits: Partial<AccountLimitsResponse['get_limits']> & {
        api_initial_load_error?: string;
        is_loading?: boolean;
    };
    account_list: TAccountsList;
    account_settings: GetSettings & {
        upload_file?: string;
        poi_state?: string;
    };
    account_status: GetAccountStatus;
    available_crypto_currencies: string[];
    authentication_status: TAuthenticationStatus;
    balance?: string | number;
    can_change_fiat_currency: boolean;
    cfd_score: number;
    ctrader_accounts_list: TCtraderAccountsList[];
    currency: string;
    current_currency_type?: string;
    current_fiat_currency?: string;
    derivez_accounts_list: DetailsOfEachMT5Loginid[];
    dxtrade_accounts_list: DetailsOfEachMT5Loginid[];
    dxtrade_accounts_list_error: null;
    dxtrade_disabled_signup_types: {
        demo: boolean;
        real: boolean;
    };
    default_currency: string;
    has_enabled_two_fa: boolean;
    has_changed_two_fa: boolean;
    email: string;
    fetchAccountSettings: () => Promise<void>;
    fetchResidenceList?: () => Promise<void>;
    fetchStatesList: () => Promise<StatesList>;
    getChangeableFields: () => string[];
    getLimits: () => Promise<{ get_limits?: GetLimits }>;
    has_account_error_in_dxtrade_demo_list: boolean;
    has_account_error_in_dxtrade_real_list: boolean;
    has_account_error_in_mt5_demo_list: boolean;
    has_account_error_in_mt5_real_list: boolean;
    has_active_real_account: boolean;
    has_any_real_account: boolean;
    has_logged_out: boolean;
    has_maltainvest_account: boolean;
    has_residence: boolean;
    has_restricted_mt5_account: boolean;
    initialized_broadcast: boolean;
    isAccountOfTypeDisabled: (account: Record<string, DetailsOfEachMT5Loginid>) => boolean;
    isEligibleForMoreDemoMt5Svg: (market_type: 'synthetic' | 'financial' | 'gaming' | 'all') => boolean;
    isEligibleForMoreRealMt5: (market_type: 'synthetic' | 'financial' | 'gaming' | 'all') => boolean;
    is_account_setting_loaded: boolean;
    is_authentication_needed: boolean;
    is_authorize: boolean;
    /** @deprecated Use `useCurrencyConfig` or `useCurrentCurrencyConfig` from `@deriv/hooks` package instead. */
    is_crypto: (currency?: string) => boolean;
    is_deposit_lock: boolean;
    is_dxtrade_allowed: boolean;
    is_eu: boolean;
    is_eu_country: boolean;
    is_financial_account: boolean;
    is_financial_assessment_needed: boolean;
    is_financial_information_incomplete: boolean;
    is_fully_authenticated: boolean;
    is_high_risk: boolean;
    is_identity_verification_needed: boolean;
    is_landing_company_loaded: boolean;
    is_language_loaded: boolean;
    is_logged_in: boolean;
    is_logging_in: boolean;
    is_low_risk: boolean;
    is_mt5_allowed: boolean;
    is_pending_proof_of_ownership: boolean;
    is_populating_account_list: boolean;
    is_populating_mt5_account_list: boolean;
    is_svg: boolean;
    is_uk: boolean;
    is_social_signup: boolean;
    is_switching: boolean;
    is_tnc_needed: boolean;
    is_trading_experience_incomplete: boolean;
    is_virtual: boolean;
    is_withdrawal_lock: boolean;
    landing_companies: LandingCompany;
    landing_company: LandingCompany;
    landing_company_shortcode: string;
    local_currency_config: {
        currency: string;
        decimal_places?: number;
    };
    loginid?: string;
    logout: () => Promise<LogOutResponse>;
    mt5_disabled_signup_types: {
        real: boolean;
        demo: boolean;
    };
    mt5_login_list: DetailsOfEachMT5Loginid[];
    prev_account_type: string;
    pre_switch_broadcast: boolean;
    real_account_creation_unlock_date: string;
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
    should_allow_authentication: boolean;
    should_restrict_bvi_account_creation: boolean;
    should_restrict_vanuatu_account_creation: boolean;
    setAccountStatus: (status?: GetAccountStatus) => void;
    setAccountSettings: (get_settings_response: GetSettings) => void;
    setCFDScore: (score: number) => void;
    setBalanceOtherAccounts: (balance: number) => void;
    setFinancialAndTradingAssessment: (
        payload: SetFinancialAssessmentRequest
    ) => Promise<SetFinancialAssessmentResponse>;
    setInitialized: (status?: boolean) => void;
    setLogout: (status?: boolean) => void;
    setPrevAccountType: (account_type: string) => void;
    setPreSwitchAccount: (status?: boolean) => void;
    setP2pAdvertiserInfo: () => void;
    setTwoFAChangedStatus: (status: boolean) => void;
    setTwoFAStatus: (status: boolean) => void;
    setVerificationCode: (code: string, action: string) => void;
    setVisibilityRealityCheck: (value: boolean) => void;
    standpoint: TStandPoint;
    states_list: StatesList;
    switchAccount: (value?: string) => Promise<void>;
    switched: boolean;
    switchEndSignal: () => void;
    switch_broadcast: boolean;
    trading_platform_available_accounts: TTradingPlatformAvailableAccount[];
    verification_code: {
        payment_agent_withdraw: string;
        payment_withdraw: string;
        reset_password: string;
        request_email: string;
        signup: string;
        system_email_change: string;
        trading_platform_dxtrade_password_reset: string;
        trading_platform_mt5_password_reset: string;
    };
    website_status: { mt5_status: TMt5StatusServer; dx_trade_status: TDXTraderStatusServerType };
    updateAccountStatus: () => Promise<void>;
    updateMT5Status: () => Promise<void>;
    upgradeable_landing_companies: unknown[];
};

type TCommonStoreError = {
    app_routing_history: TAppRoutingHistory[];
    header: string | JSX.Element;
    message: string | JSX.Element;
    redirect_label: string;
    redirect_to: string;
    redirectOnClick: (() => void) | null;
    setError: (has_error: boolean, error: React.ReactNode | null) => void;
    should_clear_error_on_click: boolean;
    should_show_refresh: boolean;
    type?: string;
};

type TCommonStore = {
    app_routing_history: TAppRoutingHistory[];
    changeCurrentLanguage: (new_language: string) => void;
    changeSelectedLanguage: (key: string) => void;
    current_language: string;
    error: TCommonStoreError;
    getExchangeRate: (from_currency: string, to_currency: string) => Promise<number>;
    has_error: boolean;
    isCurrentLanguage(language_code: string): boolean;
    is_from_derivgo: boolean;
    is_language_changing: boolean;
    is_network_online: boolean;
    is_socket_opened: boolean;
    network_status: Record<string, never> | { [key: string]: string };
    platform: 'dxtrade' | 'derivez' | 'mt5' | 'ctrader' | '';
    routeBackInApp: (history: Pick<RouteComponentProps, 'history'>, additional_platform_path?: string[]) => void;
    routeTo: (pathname: string) => void;
    services_error: { code: string; message: string; type: string } | Record<string, never>;
    server_time?: Moment;
    setAppstorePlatform: (value: string) => void;
};

type TUiStore = {
    addToast: (toast_config: TAddToastProps) => void;
    app_contents_scroll_ref: React.MutableRefObject<null | HTMLDivElement>;
    closeSuccessTopUpModal: () => void;
    closeTopUpModal: () => void;
    current_focus: string | null;
    disableApp: () => void;
    enableApp: () => void;
    has_only_forward_starting_contracts: boolean;
    has_real_account_signup_ended: boolean;
    is_accounts_switcher_on: boolean;
    is_app_disabled: boolean;
    is_cashier_visible: boolean;
    is_chart_layout_default: boolean;
    is_cfd_reset_password_modal_enabled: boolean;
    is_closing_create_real_account_modal: boolean;
    is_dark_mode_on: boolean;
    is_language_settings_modal_on: boolean;
    is_link_expired_modal_visible: boolean;
    is_loading: boolean;
    is_mobile: boolean;
    is_mobile_language_menu_open: boolean;
    is_need_real_account_for_cashier_modal_visible: boolean;
    is_positions_drawer_on: boolean;
    is_reset_trading_password_modal_visible: boolean;
    is_services_error_visible: boolean;
    is_switch_to_deriv_account_modal_visible: boolean;
    is_ready_to_deposit_modal_visible: boolean;
    is_real_acc_signup_on: boolean;
    is_reports_visible: boolean;
    is_tablet: boolean;
    is_top_up_virtual_open: boolean;
    is_top_up_virtual_in_progress: boolean;
    is_top_up_virtual_success: boolean;
    is_unsupported_contract_modal_visible: boolean;
    openRealAccountSignup: (
        value: 'maltainvest' | 'svg' | 'add_crypto' | 'choose' | 'add_fiat' | 'set_currency' | 'manage'
    ) => void;
    notification_messages_ui: React.ElementType;
    openAccountNeededModal: () => void;
    openDerivRealAccountNeededModal: () => void;
    openSwitchToRealAccountModal: () => void;
    openTopUpModal: () => void;
    populateFooterExtensions: (
        footer_extensions:
            | [
                  {
                      position?: string;
                      Component?: React.FunctionComponent;
                      has_right_separator?: boolean;
                  }
              ]
            | []
    ) => void;
    populateHeaderExtensions: (header_items: JSX.Element | null) => void;
    populateSettingsExtensions: (menu_items: Array<TPopulateSettingsExtensionsMenuItem> | null) => void;
    purchase_states: boolean[];
    reports_route_tab_index: number;
    should_show_cancellation_warning: boolean;
    setAppContentsScrollRef: (ref: React.MutableRefObject<null | HTMLDivElement>) => void;
    setCFDPasswordResetModal: (value: boolean) => void;
    setCurrentFocus: (value: string) => void;
    setDarkMode: (is_dark_mode_on: boolean) => boolean;
    setIsAcuityModalOpen: (value: boolean) => void;
    setIsClosingCreateRealAccountModal: (value: boolean) => void;
    setRealAccountSignupEnd: (status: boolean) => void;
    setHasOnlyForwardingContracts: (has_only_forward_starting_contracts: boolean) => void;
    setMobileLanguageMenuOpen: (is_mobile_language_menu_open: boolean) => void;
    setPurchaseState: (index: number) => void;
    setResetTradingPasswordModalOpen: () => void;
    setReportsTabIndex: (value: number) => void;
    setShouldShowCooldownModal: (value: boolean) => void;
    setSubSectionIndex: (index: number) => void;
    shouldNavigateAfterChooseCrypto: (value: Omit<string, TRoutes> | TRoutes) => void;
    sub_section_index: number;
    toggleAccountsDialog: () => void;
    toggleCashier: () => void;
    toggleLanguageSettingsModal: () => void;
    toggleLinkExpiredModal: (state_change: boolean) => void;
    togglePositionsDrawer: () => void;
    toggleReadyToDepositModal: () => void;
    toggleServicesErrorModal: () => void;
    toggleSetCurrencyModal: () => void;
    toggleShouldShowRealAccountsList: (value: boolean) => void;
    removeToast: (key: string) => void;
    toggleCancellationWarning: (state_change: boolean) => void;
    toggleUnsupportedContractModal: (state_change: boolean) => void;
    toggleReports: (is_visible: boolean) => void;
    toggleNeedRealAccountForCashierModal: () => void;
};

type TPortfolioStore = {
    active_positions: TPortfolioPosition[];
    all_positions: TPortfolioPosition[];
    error: string;
    getPositionById: (id: number) => TPortfolioPosition;
    is_accumulator: boolean;
    is_loading: boolean;
    is_multiplier: boolean;
    is_turbos: boolean;
    onClickCancel: (contract_id?: number) => void;
    onClickSell: (contract_id?: number) => void;
    onMount: () => void;
    positions: TPortfolioPosition[];
    removePositionById: (id: number) => void;
};

type TContractStore = {
    getContractById: (id: number) => ProposalOpenContract;
    contract_info: TPortfolioPosition['contract_info'];
    contract_update_stop_loss: string;
    contract_update_take_profit: string;
    has_contract_update_stop_loss: boolean;
    has_contract_update_take_profit: boolean;
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
    removeNotificationByKey: ({ key }: { key: string }) => void;
    removeNotificationMessage: ({ key, should_show_again }: { key: string; should_show_again?: boolean }) => void;
    setP2POrderProps: () => void;
    setP2PRedirectTo: () => void;
    showAccountSwitchToRealNotification: (loginid: string, currency: string) => void;
};

type TBalance = {
    balance: number;
    currency: string;
};

type TTradersHubStore = {
    available_cfd_accounts: TAvailableCFDAccounts[];
    available_ctrader_accounts: TAvailableCFDAccounts[];
    available_dxtrade_accounts: DetailsOfEachMT5Loginid[];
    available_derivez_accounts: DetailsOfEachMT5Loginid[];
    CFDs_restricted_countries: boolean;
    cfd_demo_balance: TBalance;
    cfd_real_balance: TBalance;
    closeAccountTransferModal: () => void;
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
    getAccount: () => void;
    getExistingAccounts: () => void;
    handleTabItemClick: (idx: number) => void;
    has_any_real_account: boolean;
    is_account_transfer_modal_open: boolean;
    is_demo: boolean;
    is_demo_low_risk: boolean;
    is_eu_user: boolean;
    is_low_risk_cr_eu_real: boolean;
    is_mt5_notification_modal_visible: boolean;
    is_real: boolean;
    is_regulators_compare_modal_visible: boolean;
    is_tour_open: boolean;
    multipliers_account_status: string;
    no_CR_account: boolean;
    no_MF_account: boolean;
    openFailedVerificationModal: (selected_account_type: string) => void;
    openModal: (modal_id: string, props?: unknown) => void;
    platform_demo_balance: TBalance;
    platform_real_balance: TBalance;
    show_eu_related_content: boolean;
    setTogglePlatformType: (platform_type: string) => void;
    toggleRegulatorsCompareModal: () => void;
    selectAccountType: (account_type: string) => void;
    selectRegion: (region: string) => void;
    selected_region: string;
    selected_account: {
        login: string;
        account_id: string;
    };
    selected_account_type: string;
    selected_platform_type: string;
    setMT5NotificationModal: (value: boolean) => void;
    setSelectedAccount: (account: { login?: string; account_id?: string }) => void;
    showTopUpModal: () => void;
    startTrade: () => void;
    toggleAccountTransferModal: () => void;
    toggleAccountTypeModalVisibility: () => void;
    toggleIsTourOpen: (is_tour_open: boolean) => void;
};

/**
 * This is the type that contains all the `core` package stores
 */
export type TCoreStores = {
    client: TClientStore;
    common: TCommonStore;
    contract_trade: TContractStore;
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
