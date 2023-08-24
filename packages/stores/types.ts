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

interface AvailableAccount {
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
}

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
    description?: string | undefined;
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

type TAuthenticationStatus = { document_status: string; identity_status: string };

type TAddToastProps = {
    key: string;
    content: string;
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

type LoginParams = {
    acct: string;
    token: string;
    curr: string;
    lang: string;
};

type IncrementedProperties<N extends number> = {
    [K in keyof LoginParams as `${string & K}${N}`]: string;
};

export type LoginURLParams<N extends number> = LoginParams & IncrementedProperties<N>;
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

type TClientStore = {
    fetchStatesList: () => Promise<StatesList>;
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
    currency: string;
    current_currency_type?: string;
    current_fiat_currency?: string;
    has_any_real_account: boolean;
    getLimits: () => Promise<{ get_limits?: GetLimits }>;
    has_active_real_account: boolean;
    has_logged_out: boolean;
    has_maltainvest_account: boolean;
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
    isCurrentLanguage(language_code: string): boolean;
    error: TCommonStoreError;
    services_error: { code: string; message: string; type: string } | Record<string, never>;
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
    is_socket_opened: boolean;
    setAppstorePlatform: (value: string) => void;
    app_routing_history: TAppRoutingHistory[];
    getExchangeRate: (from_currency: string, to_currency: string) => Promise<number>;
    network_status: Record<string, never> | { [key: string]: string };
};

type TUiStore = {
    addToast: (toast_config: TAddToastProps) => void;
    app_contents_scroll_ref: React.MutableRefObject<null | HTMLDivElement>;
    current_focus: string | null;
    disableApp: () => void;
    enableApp: () => void;
    has_real_account_signup_ended: boolean;
    is_loading: boolean;
    is_cashier_visible: boolean;
    is_wallet_modal_visible: boolean;
    is_closing_create_real_account_modal: boolean;
    is_unsupported_contract_modal_visible: boolean;
    has_only_forward_starting_contracts: boolean;
    is_dark_mode_on: boolean;
    is_reports_visible: boolean;
    is_language_settings_modal_on: boolean;
    is_app_disabled: boolean;
    is_link_expired_modal_visible: boolean;
    is_mobile: boolean;
    is_positions_drawer_on: boolean;
    is_services_error_visible: boolean;
    openRealAccountSignup: (
        value: 'maltainvest' | 'svg' | 'add_crypto' | 'choose' | 'add_fiat' | 'set_currency' | 'manage'
    ) => void;
    notification_messages_ui: React.ElementType;
    setCurrentFocus: (value: string) => void;
    setDarkMode: (is_dark_mode_on: boolean) => boolean;
    setIsWalletModalVisible: (value: boolean) => void;
    setReportsTabIndex: (value: number) => void;
    setIsClosingCreateRealAccountModal: (value: boolean) => void;
    setRealAccountSignupEnd: (status: boolean) => void;
    setHasOnlyForwardingContracts: (has_only_forward_starting_contracts: boolean) => void;
    sub_section_index: number;
    setSubSectionIndex: (index: number) => void;
    shouldNavigateAfterChooseCrypto: (value: Omit<string, TRoutes> | TRoutes) => void;
    toggleAccountsDialog: () => void;
    toggleCashier: () => void;
    toggleLanguageSettingsModal: () => void;
    toggleLinkExpiredModal: (state_change: boolean) => void;
    togglePositionsDrawer: () => void;
    toggleReadyToDepositModal: () => void;
    toggleSetCurrencyModal: () => void;
    toggleShouldShowRealAccountsList: (value: boolean) => void;
    toggleServicesErrorModal: () => void;
    is_tablet: boolean;
    removeToast: (key: string) => void;
    is_ready_to_deposit_modal_visible: boolean;
    reports_route_tab_index: number;
    should_show_cancellation_warning: boolean;
    toggleCancellationWarning: (state_change: boolean) => void;
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
    setShouldShowCooldownModal: (value: boolean) => void;
    setAppContentsScrollRef: (ref: React.MutableRefObject<null | HTMLDivElement>) => void;
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
    is_wallet_creation_success_modal_open: boolean;
    toggleIsWalletCreationSuccessModalOpen: (value: boolean) => void;
    account_switcher_disabled_message: string;
};

type TPortfolioStore = {
    active_positions: TPortfolioPosition[];
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
};

type TNotificationStore = {
    addNotificationMessage: (message: TNotification) => void;
    addNotificationMessageByKey: (key: string) => void;
    client_notifications: object;
    filterNotificationMessages: () => void;
    refreshNotifications: () => void;
    removeAllNotificationMessages: (should_close_persistent: boolean) => void;
    removeNotificationByKey: (key: string) => void;
    removeNotificationMessage: (key: string, should_show_again?: boolean) => void;
    setP2POrderProps: () => void;
    setP2PRedirectTo: () => void;
    showAccountSwitchToRealNotification: (loginid: string, currency: string) => void;
};

type TBalance = {
    currency: string;
    balance: number;
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
    available_dxtrade_accounts: AvailableAccount[];
    is_wallet_tour_open: boolean;
    toggleIsWalletTourOpen: (value: boolean) => void;
    can_get_more_cfd_mt5_accounts: boolean;
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
    toggleIsTourOpen: (is_tour_open: boolean) => void;
    is_demo_low_risk: boolean;
    is_mt5_notification_modal_visible: boolean;
    setMT5NotificationModal: (value: boolean) => void;
    available_derivez_accounts: DetailsOfEachMT5Loginid[];
};

/**
 * This is the type that contains all the `core` package stores
 */
export type TCoreStores = {
    client: TClientStore;
    common: TCommonStore;
    ui: TUiStore;
    portfolio: TPortfolioStore;
    contract_trade: TContractStore;
    // This should be `any` as this property will be handled in each package.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    modules: Record<string, any>;
    notifications: TNotificationStore;
    traders_hub: TTradersHubStore;
};

export type TStores = TCoreStores & {
    exchange_rates: ExchangeRatesStore;
    feature_flags: FeatureFlagsStore;
};
