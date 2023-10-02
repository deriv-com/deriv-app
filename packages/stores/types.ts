import type {
    AccountLimitsResponse,
    Authorize,
    ContractUpdate,
    ContractUpdateHistory,
    DetailsOfEachMT5Loginid,
    GetAccountStatus,
    GetLimits,
    Portfolio1,
    GetSettings,
    LandingCompany,
    LogOutResponse,
    ProposalOpenContract,
    ResidenceList,
    SetFinancialAssessmentRequest,
    SetFinancialAssessmentResponse,
    StatesList,
    Transaction,
} from '@deriv/api-types';
import type { Moment } from 'moment';
import type { RouteComponentProps } from 'react-router';
import type { ExchangeRatesStore, FeatureFlagsStore } from './src/stores';

type TRoutes =
    | '/404'
    | '/account'
    | '/account/trading-assessment'
    | '/account/languages'
    | '/account/financial-assessment'
    | '/account/personal-details'
    | '/account/proof-of-identity'
    | '/account/proof-of-address'
    | '/account/proof-of-ownership'
    | '/account/passwords'
    | '/account/closing-account'
    | '/account/deactivate-account'
    | '/account-closed'
    | '/account/account-limits'
    | '/account/connected-apps'
    | '/account/api-token'
    | '/account/login-history'
    | '/account/two-factor-authentication'
    | '/account/self-exclusion'
    | '/settings/account_password'
    | '/settings/apps'
    | '/settings/cashier_password'
    | '/contract/:contract_id'
    | '/settings/exclusion'
    | '/settings/financial'
    | '/settings/history'
    | '/index'
    | '/settings/limits'
    | '/mt5'
    | '/derivx'
    | '/settings/personal'
    | '/reports/positions'
    | '/reports/profit'
    | '/reports'
    | '/'
    | '/redirect'
    | '/settings'
    | '/reports/statement'
    | '/settings/token'
    | '/bot'
    | '/cashier'
    | '/cashier/deposit'
    | '/cashier/withdrawal'
    | '/cashier/payment-agent'
    | '/cashier/account-transfer'
    | '/cashier/crypto-transactions'
    | '/cashier/on-ramp'
    | '/cashier/p2p'
    | '/cashier/p2p/profile'
    | '/cashier/p2p/verification'
    | '/cashier/payment-agent-transfer'
    | '/endpoint'
    | '/complaints-policy'
    | '/appstore'
    | '/appstore/traders-hub'
    | '/appstore/onboarding';

type TPopulateSettingsExtensionsMenuItem = {
    icon: string;
    label: string;
    value: <T extends object>(props: T) => JSX.Element;
};

type TRegionAvailability = 'Non-EU' | 'EU' | 'All';

type TIconTypes =
    | 'Derived'
    | 'Financial'
    | 'BinaryBot'
    | 'BinaryBotBlue'
    | 'DBot'
    | 'Demo'
    | 'DerivGo'
    | 'DerivGoBlack'
    | 'DerivLogo'
    | 'DerivTradingLogo'
    | 'DerivX'
    | 'DropDown'
    | 'DTrader'
    | 'Options'
    | 'SmartTrader'
    | 'SmartTraderBlue'
    | 'CFDs';

type AvailableAccount = {
    name: string;
    is_item_blurry?: boolean;
    has_applauncher_account?: boolean;
    sub_title?: string;
    description?: string;
    is_visible?: boolean;
    is_disabled?: boolean;
    platform?: string;
    market_type?: 'all' | 'financial' | 'synthetic';
    icon: TIconTypes;
    availability: TRegionAvailability;
    short_code_and_region?: string;
    login?: string;
};

interface ExistingMT5Account {
    account_type: string;
    action_type: string;
    availability: TRegionAvailability;
    balance: number;
    country: string;
    email: string;
    leverage: number;
    market_type: string;
    login: string;
    landing_company_short: string;
    group: string;
    is_added: boolean;
    short_code_and_region: string;
    platform: 'derivez' | 'dtrade' | 'dwallet' | 'dxtrade' | 'mt5';
    description?: string;
    name: string;
    shortcode: string;
    status: string | null;
    sub_account_type: string;
    sub_account_category: string;
    sub_title: string;
    display_balance: string;
    linkable_landing_companies: string[];
    server: string;
}

type BrandConfig = {
    name: string;
    icon: TIconTypes;
    availability: TRegionAvailability;
    is_deriv_platform?: boolean;
};

type TPortfolioPosition = {
    contract_info: ProposalOpenContract &
        Portfolio1 & {
            contract_update?: ContractUpdate;
        };
    details?: string;
    display_name: string;
    id?: number;
    indicative: number;
    payout?: number;
    purchase?: number;
    reference: number;
    type?: string;
    is_unsupported: boolean;
    contract_update: ProposalOpenContract['limit_order'];
    is_sell_requested: boolean;
    profit_loss: number;
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
    landing_company_shortcode?: 'svg' | 'costarica' | 'maltainvest' | 'malta' | 'iom';
    is_virtual: number;
    account_category?: 'wallet' | 'trading';
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
            CFDs: React.SVGAttributes<SVGElement>;
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
    balance?: string | number;
    landing_company_shortcode: 'svg' | 'costarica' | 'maltainvest' | 'malta' | 'iom';
    is_virtual: number;
    account_category?: 'wallet' | 'trading';
    linked_to?: { loginid: string; platform: string }[];
    token: string;
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

type TAddToastProps = {
    key: string;
    content: string | React.ReactNode;
    is_bottom?: boolean;
    timeout?: number;
    type: string;
};

type TButtonProps = {
    onClick: () => void;
    text: string;
};

type TActionProps = TButtonProps & {
    route?: string;
};

type TNotificationMessage = {
    action?: TActionProps;
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
    should_show_again?: boolean;
    timeout?: number;
    timeoutMessage?: (remaining: number | string) => string;
    type: string;
};

type TNotification =
    | TNotificationMessage
    | ((withdrawal_locked: boolean, deposit_locked: boolean) => TNotificationMessage)
    | ((excluded_until: number) => TNotificationMessage);

type LoginParams = {
    acct: string;
    token: string;
    curr: string;
    lang: string;
};

type IncrementedProperties<N extends number> = {
    [K in keyof LoginParams as `${string & K}${N}`]: string;
};

type LoginURLParams<N extends number> = LoginParams & IncrementedProperties<N>;
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
    platform: number;
    server_number: number;
    deposits?: number;
    withdrawals?: number;
};

type TDXTraderStatusServerType = Record<'all' | 'demo' | 'real', number>;

type TMt5StatusServer = Record<'demo' | 'real', TMt5StatusServerType[]>;

type TCountryStandpoint = {
    is_belgium: boolean;
    is_france: boolean;
    is_isle_of_man: boolean;
    is_other_eu: boolean;
    is_rest_of_eu: boolean;
    is_united_kingdom: boolean;
};

type TClientStore = {
    fetchStatesList: () => Promise<StatesList>;
    account_type: string;
    accounts: { [k: string]: TActiveAccount };
    active_accounts: TActiveAccount[];
    active_account_landing_company: string;
    trading_platform_available_accounts: TTradingPlatformAvailableAccount[];
    account_limits: Partial<AccountLimitsResponse['get_limits']> & {
        is_loading?: boolean;
        api_initial_load_error?: string;
    };
    account_list: TAccountsList;
    account_status: GetAccountStatus;
    available_crypto_currencies: string[];
    balance?: string | number;
    can_change_fiat_currency: boolean;
    cfd_score: number;
    setCFDScore: (score: number) => void;
    country_standpoint: TCountryStandpoint;
    currency: string;
    currencies_list: { text: string; value: string; has_tool_tip?: boolean }[];
    current_currency_type?: string;
    current_fiat_currency?: string;
    has_any_real_account: boolean;
    getLimits: () => Promise<{ get_limits?: GetLimits }>;
    has_active_real_account: boolean;
    has_logged_out: boolean;
    has_maltainvest_account: boolean;
    has_restricted_mt5_account: boolean;
    initialized_broadcast: boolean;
    is_account_setting_loaded: boolean;
    is_deposit_lock: boolean;
    is_dxtrade_allowed: boolean;
    is_eu_country: boolean;
    is_eu: boolean;
    is_uk: boolean;
    is_social_signup: boolean;
    has_residence: boolean;
    is_authorize: boolean;
    is_financial_account: boolean;
    is_financial_assessment_needed: boolean;
    is_financial_information_incomplete: boolean;
    is_identity_verification_needed: boolean;
    is_landing_company_loaded: boolean;
    is_logged_in: boolean;
    is_logging_in: boolean;
    is_low_risk: boolean;
    is_pending_proof_of_ownership: boolean;
    is_single_currency: boolean;
    is_switching: boolean;
    is_tnc_needed: boolean;
    is_high_risk: boolean;
    is_trading_experience_incomplete: boolean;
    is_virtual: boolean;
    is_withdrawal_lock: boolean;
    landing_company_shortcode: string;
    is_populating_account_list: boolean;
    is_language_loaded: boolean;
    local_currency_config: {
        currency: string;
        decimal_places?: number;
    };
    loginid?: string;
    pre_switch_broadcast: boolean;
    residence: string;
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
    standpoint: TStandPoint;
    setAccountStatus: (status?: GetAccountStatus) => void;
    setBalanceOtherAccounts: (balance: number) => void;
    setInitialized: (status?: boolean) => void;
    setLogout: (status?: boolean) => void;
    setVisibilityRealityCheck: (value: boolean) => void;
    setP2pAdvertiserInfo: () => void;
    setPreSwitchAccount: (status?: boolean) => void;
    switchAccount: (value?: string) => Promise<void>;
    setLoginInformation: (client_accounts: { [k: string]: TActiveAccount }, client_id: string) => void;
    switched: boolean;
    switch_broadcast: boolean;
    switchEndSignal: () => void;
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
    website_status: { mt5_status: TMt5StatusServer; dx_trade_status: TDXTraderStatusServerType };
    email: string;
    setVerificationCode: (code: string, action: string) => void;
    updateAccountStatus: () => Promise<void>;
    is_authentication_needed: boolean;
    authentication_status: TAuthenticationStatus;
    mt5_login_list: DetailsOfEachMT5Loginid[];
    logout: () => Promise<LogOutResponse>;
    should_allow_authentication: boolean;
    isEligibleForMoreDemoMt5Svg: (market_type: 'synthetic' | 'financial' | 'gaming' | 'all') => boolean;
    isEligibleForMoreRealMt5: (market_type: 'synthetic' | 'financial' | 'gaming' | 'all') => boolean;
    fetchResidenceList?: () => Promise<void>;
    account_settings: GetSettings & {
        upload_file?: string;
        poi_state?: string;
    };
    residence_list: ResidenceList;
    should_restrict_bvi_account_creation: boolean;
    should_restrict_vanuatu_account_creation: boolean;
    updateMT5Status: () => Promise<void>;
    fetchAccountSettings: () => Promise<void>;
    setAccountSettings: (get_settings_response: GetSettings) => void;
    upgradeable_landing_companies: unknown[];
    is_populating_mt5_account_list: boolean;
    landing_companies: LandingCompany;
    getChangeableFields: () => string[];
    landing_company: LandingCompany;
    isAccountOfTypeDisabled: (account: Record<string, DetailsOfEachMT5Loginid>) => boolean;
    is_mt5_allowed: boolean;
    mt5_disabled_signup_types: {
        real: boolean;
        demo: boolean;
    };
    dxtrade_disabled_signup_types: {
        real: boolean;
        demo: boolean;
    };
    dxtrade_accounts_list_error: null;
    has_account_error_in_mt5_real_list: boolean;
    has_account_error_in_mt5_demo_list: boolean;
    has_account_error_in_dxtrade_real_list: boolean;
    has_account_error_in_dxtrade_demo_list: boolean;
    is_fully_authenticated: boolean;
    states_list: StatesList;
    /** @deprecated Use `useCurrencyConfig` or `useCurrentCurrencyConfig` from `@deriv/hooks` package instead. */
    is_crypto: (currency?: string) => boolean;
    ctrader_accounts_list: TCtraderAccountsList[];
    dxtrade_accounts_list: DetailsOfEachMT5Loginid[];
    derivez_accounts_list: DetailsOfEachMT5Loginid[];
    default_currency: string;
    resetVirtualBalance: () => Promise<void>;
    has_enabled_two_fa: boolean;
    setTwoFAStatus: (status: boolean) => void;
    has_changed_two_fa: boolean;
    setTwoFAChangedStatus: (status: boolean) => void;
    is_svg: boolean;
    real_account_creation_unlock_date: string;
    setPrevAccountType: (account_type: string) => void;
    is_wallet_migration_in_progress_popup: boolean;
    setWalletsMigrationInProgressPopup: (value: boolean) => void;
    init: (login_new_user?: LoginURLParams<1>) => void;
    setLoginId: (loginid: string) => void;
    resetLocalStorageValues: (loginid: string) => void;
    setFinancialAndTradingAssessment: (
        payload: SetFinancialAssessmentRequest
    ) => Promise<SetFinancialAssessmentResponse>;
    prev_account_type: string;
    accountRealReaction: (response: {
        new_account_real?: { oauth_token: string; client_id: string };
        new_account_maltainvest?: { oauth_token: string; client_id: string };
        new_account_wallet?: { oauth_token: string; client_id: string };
    }) => Promise<void>;
    is_bot_allowed: boolean;
};

type TCommonStoreError = {
    app_routing_history?: TAppRoutingHistory[];
    header: string | JSX.Element;
    message: string | JSX.Element;
    redirect_label: string;
    redirect_to?: string;
    redirectOnClick: (() => void) | null;
    setError?: (has_error: boolean, error: React.ReactNode | null) => void;
    should_clear_error_on_click?: boolean;
    should_show_refresh: boolean;
    type?: string;
};
type TCommonStoreServicesError = {
    code?: string;
    message?: string;
    type?: string;
};

type TCommonStore = {
    isCurrentLanguage(language_code: string): boolean;
    error: TCommonStoreError;
    has_error: boolean;
    is_from_derivgo: boolean;
    is_network_online: boolean;
    platform: 'dxtrade' | 'derivez' | 'mt5' | 'ctrader' | '';
    routeBackInApp: (history: Pick<RouteComponentProps, 'history'>, additional_platform_path?: string[]) => void;
    routeTo: (pathname: string) => void;
    server_time?: Moment;
    changeCurrentLanguage: (new_language: string) => void;
    changeSelectedLanguage: (key: string) => void;
    current_language: string;
    is_language_changing: boolean;
    services_error: TCommonStoreServicesError;
    is_socket_opened: boolean;
    setAppstorePlatform: (value: string) => void;
    app_routing_history: TAppRoutingHistory[];
    getExchangeRate: (from_currency: string, to_currency: string) => Promise<number>;
    network_status: Record<string, never> | { [key: string]: string };
};

type TUiStore = {
    advanced_duration_unit: string;
    addToast: (toast_config: TAddToastProps) => void;
    account_switcher_disabled_message: string;
    app_contents_scroll_ref: React.MutableRefObject<null | HTMLDivElement>;
    current_focus: string | null;
    disableApp: () => void;
    enableApp: () => void;
    has_only_forward_starting_contracts: boolean;
    has_real_account_signup_ended: boolean;
    header_extension: JSX.Element | null;
    is_account_settings_visible: boolean;
    is_loading: boolean;
    is_cashier_visible: boolean;
    is_wallet_modal_visible: boolean;
    is_closing_create_real_account_modal: boolean;
    is_dark_mode_on: boolean;
    is_reports_visible: boolean;
    is_route_modal_on: boolean;
    is_language_settings_modal_on: boolean;
    is_app_disabled: boolean;
    is_link_expired_modal_visible: boolean;
    is_mobile: boolean;
    is_positions_drawer_on: boolean;
    is_services_error_visible: boolean;
    is_unsupported_contract_modal_visible: boolean;
    openRealAccountSignup: (
        value: 'maltainvest' | 'svg' | 'add_crypto' | 'choose' | 'add_fiat' | 'set_currency' | 'manage'
    ) => void;
    notification_messages_ui: React.ElementType;
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
    setAppContentsScrollRef: (ref: React.MutableRefObject<null | HTMLDivElement>) => void;
    setCurrentFocus: (value: string | null) => void;
    setDarkMode: (is_dark_mode_on: boolean) => boolean;
    setIsWalletModalVisible: (value: boolean) => void;
    setHasOnlyForwardingContracts: (has_only_forward_starting_contracts: boolean) => void;
    setReportsTabIndex: (value: number) => void;
    setIsClosingCreateRealAccountModal: (value: boolean) => void;
    setRealAccountSignupEnd: (status: boolean) => void;
    setPurchaseState: (index: number) => void;
    sub_section_index: number;
    setSubSectionIndex: (index: number) => void;
    shouldNavigateAfterChooseCrypto: (value: Omit<string, TRoutes> | TRoutes) => void;
    toggleAccountsDialog: () => void;
    toggleAccountSettings: (props?: boolean) => void;
    toggleCashier: () => void;
    toggleLanguageSettingsModal: () => void;
    toggleLinkExpiredModal: (state_change: boolean) => void;
    togglePositionsDrawer: () => void;
    toggleReadyToDepositModal: () => void;
    toggleServicesErrorModal: (is_visible: boolean) => void;
    toggleSetCurrencyModal: () => void;
    toggleShouldShowRealAccountsList: (value: boolean) => void;
    is_tablet: boolean;
    removeToast: (key: string) => void;
    is_ready_to_deposit_modal_visible: boolean;
    reports_route_tab_index: number;
    should_show_cancellation_warning: boolean;
    toggleCancellationWarning: (state_change?: boolean) => void;
    toggleUnsupportedContractModal: (state_change: boolean) => void;
    toggleReports: (is_visible: boolean) => void;
    is_real_acc_signup_on: boolean;
    is_need_real_account_for_cashier_modal_visible: boolean;
    is_chart_layout_default: boolean;
    toggleNeedRealAccountForCashierModal: () => void;
    setIsAcuityModalOpen: (value: boolean) => void;
    is_switch_to_deriv_account_modal_visible: boolean;
    openSwitchToRealAccountModal: () => void;
    openDerivRealAccountNeededModal: () => void;
    is_top_up_virtual_open: boolean;
    is_top_up_virtual_in_progress: boolean;
    is_top_up_virtual_success: boolean;
    closeSuccessTopUpModal: () => void;
    closeTopUpModal: () => void;
    is_cfd_reset_password_modal_enabled: boolean;
    setCFDPasswordResetModal: (value: boolean) => void;
    openAccountNeededModal: () => void;
    is_accounts_switcher_on: boolean;
    openTopUpModal: () => void;
    is_reset_trading_password_modal_visible: boolean;
    setResetTradingPasswordModalOpen: () => void;
    populateHeaderExtensions: (header_items: JSX.Element | null) => void;
    populateSettingsExtensions: (menu_items: Array<TPopulateSettingsExtensionsMenuItem> | null) => void;
    purchase_states: boolean[];
    setShouldShowCooldownModal: (value: boolean) => void;
    is_wallet_creation_success_modal_open: boolean;
    toggleIsWalletCreationSuccessModalOpen: (value: boolean) => void;
    vanilla_trade_type: 'VANILLALONGCALL' | 'VANILLALONGPUT';
};

type TPortfolioStore = {
    active_positions: TPortfolioPosition[];
    all_positions: TPortfolioPosition[];
    error: string;
    getPositionById: (id: number) => TPortfolioPosition;
    is_loading: boolean;
    is_multiplier: boolean;
    is_accumulator: boolean;
    is_turbos: boolean;
    onClickCancel: (contract_id?: number) => void;
    onClickSell: (contract_id?: number) => void;
    onMount: () => void;
    positions: TPortfolioPosition[];
    removePositionById: (id: number) => void;
};

type TContractTradeStore = {
    contract_info: TPortfolioPosition['contract_info'];
    contract_update_stop_loss: string;
    contract_update_take_profit: string;
    getContractById: (id: number) => TContractStore;
    has_contract_update_stop_loss: boolean;
    has_contract_update_take_profit: boolean;
};

type TContractStore = {
    clearContractUpdateConfigValues: () => void;
    contract_info: TPortfolioPosition['contract_info'];
    contract_update_history: ContractUpdateHistory;
    contract_update_take_profit: number | string;
    contract_update_stop_loss: number | string;
    digits_info: { [key: number]: { digit: number; spot: string } };
    display_status: string;
    has_contract_update_take_profit: boolean;
    has_contract_update_stop_loss: boolean;
    is_digit_contract: boolean;
    is_ended: boolean;
    onChange: (param: { name: string; value: string | number | boolean }) => void;
    updateLimitOrder: () => void;
    validation_errors: { contract_update_stop_loss: string[]; contract_update_take_profit: string[] };
};

type TNotificationStore = {
    addNotificationMessage: (message: TNotification) => void;
    addNotificationMessageByKey: (key: string) => void;
    client_notifications: object;
    is_notifications_empty: boolean;
    is_notifications_visible: boolean;
    filterNotificationMessages: () => void;
    refreshNotifications: () => void;
    removeAllNotificationMessages: (should_close_persistent: boolean) => void;
    removeNotifications: (should_close_persistent: boolean) => void;
    removeNotificationByKey: ({ key }: { key: string }) => void;
    removeNotificationMessage: ({ key, should_show_again }: { key: string; should_show_again?: boolean }) => void;
    removeNotificationMessageByKey: ({ key }: { key: string }) => void;
    setP2POrderProps: () => void;
    setP2PRedirectTo: () => void;
    showAccountSwitchToRealNotification: (loginid: string, currency: string) => void;
    toggleNotificationsModal: () => void;
    notifications: Record<string, any>[];
};

type TBalance = {
    currency: string;
    balance: number;
};

type TModalData = {
    active_modal: string;
    data: Record<string, unknown>;
};

type TTradersHubStore = {
    closeModal: () => void;
    content_flag: 'low_risk_cr_eu' | 'low_risk_cr_non_eu' | 'high_risk_cr' | 'cr_demo' | 'eu_demo' | 'eu_real' | '';
    combined_cfd_mt5_accounts: DetailsOfEachMT5Loginid &
        {
            short_code_and_region: string;
            login: string;
            sub_title: string;
            icon: 'Derived' | 'Financial' | 'Options' | 'CFDs';
            status?: string;
            action_type: 'get' | 'none' | 'trade' | 'dxtrade' | 'multi-action';
            key: string;
            name: string;
            landing_company_short?: 'bvi' | 'labuan' | 'svg' | 'vanuatu' | 'maltainvest';
            platform?: string;
            description?: string;
            market_type?: 'all' | 'financial' | 'gaming';
        }[];
    openModal: (modal_id: string, props?: unknown) => void;
    selected_account: {
        login: string;
        account_id: string;
    };
    handleTabItemClick: (idx: number) => void;
    is_account_transfer_modal_open: boolean;
    is_low_risk_cr_eu_real: boolean;
    is_eu_user: boolean;
    setIsOnboardingVisited: (is_visited: boolean) => void;
    show_eu_related_content: boolean;
    setTogglePlatformType: (platform_type: string) => void;
    is_demo: boolean;
    is_real: boolean;
    is_regulators_compare_modal_visible: boolean;
    is_tour_open: boolean;
    selectRegion: (region: string) => void;
    closeAccountTransferModal: () => void;
    toggleRegulatorsCompareModal: () => void;
    openFailedVerificationModal: (selected_account_type: Record<string, unknown> | string) => void;
    modal_data: TModalData;
    multipliers_account_status: string;
    financial_restricted_countries: boolean;
    selected_account_type: string;
    selected_platform_type: string;
    setSelectedAccount: (account: { login?: string; account_id?: string }) => void;
    no_CR_account: boolean;
    no_MF_account: boolean;
    CFDs_restricted_countries: boolean;
    toggleAccountTransferModal: () => void;
    is_real_wallets_upgrade_on: boolean;
    toggleWalletsUpgrade: (value: boolean) => void;
    platform_real_balance: TBalance;
    cfd_demo_balance: TBalance;
    platform_demo_balance: TBalance;
    cfd_real_balance: TBalance;
    selectAccountType: (account_type: string) => void;
    is_wallet_migration_failed: boolean;
    setWalletsMigrationFailedPopup: (value: boolean) => void;
    available_platforms: BrandConfig[];
    selected_region: TRegionAvailability;
    getExistingAccounts: (platform: string, market_type: string) => AvailableAccount[];
    is_wallet_tour_open: boolean;
    toggleIsWalletTourOpen: (value: boolean) => void;
    toggleAccountTypeModalVisibility: () => void;
    active_modal_tab?: 'Deposit' | 'Withdraw' | 'Transfer' | 'Transactions';
    setWalletModalActiveTab: (tab?: 'Deposit' | 'Withdraw' | 'Transfer' | 'Transactions') => void;
    active_modal_wallet_id?: string;
    setWalletModalActiveWalletID: (wallet_id?: string) => void;
    getAccount: () => void;
    showTopUpModal: (existing_account: Partial<ExistingMT5Account>) => void;
    startTrade: (platform: string, account: Partial<ExistingMT5Account>) => void;
    has_any_real_account: boolean;
    getShortCodeAndRegion: (account: Partial<ExistingMT5Account>) => string;
    is_mt5_notificaiton_modal_visible: boolean;
    available_cfd_accounts: TAvailableCFDAccounts[];
    available_dxtrade_accounts: TAvailableCFDAccounts[];
    available_ctrader_accounts: TAvailableCFDAccounts[];
    toggleIsTourOpen: (is_tour_open: boolean) => void;
    is_demo_low_risk: boolean;
    is_mt5_notification_modal_visible: boolean;
    setMT5NotificationModal: (value: boolean) => void;
    available_derivez_accounts: DetailsOfEachMT5Loginid[];
    is_wallet_create_new_account_modal: boolean;
    setWalletCreateNewAccountModal: (value: boolean) => void;
};

type TGtmStore = {
    is_gtm_applicable: boolean;
    visitorId: Readonly<string>;
    common_variables: Readonly<{
        language: string;
        visitorId?: string;
        currency?: string;
        userId?: string;
        email?: string;
        loggedIn: boolean;
        theme: 'dark' | 'light';
        platform: 'DBot' | 'MT5' | 'DTrader' | 'undefined';
    }>;
    accountSwitcherListener: () => Promise<Record<string, unknown>>;
    pushDataLayer: (data: Record<string, unknown>) => void;
    pushTransactionData: (response: Transaction, extra_data: Record<string, unknown>) => void;
    eventHandler: (get_settings: GetSettings) => void;
    setLoginFlag: (event_name: string) => void;
};

/**
 * This is the type that contains all the `core` package stores
 */
export type TCoreStores = {
    client: TClientStore;
    common: TCommonStore;
    ui: TUiStore;
    portfolio: TPortfolioStore;
    contract_trade: TContractTradeStore;
    // This should be `any` as this property will be handled in each package.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    modules: Record<string, any>;
    notifications: TNotificationStore;
    traders_hub: TTradersHubStore;
    gtm: TGtmStore;
    pushwoosh: Record<string, unknown>;
    contract_replay: Record<string, unknown>;
    chart_barrier_store: Record<string, unknown>;
    active_symbols: Record<string, unknown>;
};

export type TStores = TCoreStores & {
    exchange_rates: ExchangeRatesStore;
    feature_flags: FeatureFlagsStore;
};
