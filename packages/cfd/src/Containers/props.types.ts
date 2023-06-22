import React from 'react';
import {
    DetailsOfEachMT5Loginid,
    GetAccountStatus,
    GetSettings,
    LandingCompany,
    ResidenceList,
    VerifyEmailResponse,
} from '@deriv/api-types';
import { FormikHelpers as FormikActions } from 'formik';
import { TCFDPasswordFormValues } from './cfd-password-modal';
import {
    TTradingPlatformAvailableAccount,
    TExistingData,
    TJurisdictionCardSection,
    TJurisdictionCardSectionTitleIndicators,
    TClickableDescription,
    TJurisdictionCardItems,
    TJurisdictionCardItemVerification,
} from '../Components/props.types';
import RootStore from '../Stores/index';

export type TCFDPersonalDetailsContainerProps = {
    account_settings: GetSettings;
    getChangeableFields: () => string[];
    context: RootStore;
    landing_company: LandingCompany;
    residence_list: ResidenceList;
    setAccountSettings: (account_settings: GetSettings) => void;
    onSubmit: (index: number, value: { [key: string]: string }) => void;
};

type CFD_Platform = 'dxtrade' | 'mt5';

export type TCFDChangePasswordConfirmationProps = {
    confirm_label?: string;
    platform: string;
    className?: string;
    onConfirm: (values: TCFDPasswordFormValues, actions: FormikActions<TCFDPasswordFormValues>) => void;
    onCancel: () => void;
    context?: RootStore;
};

export type TCFDDashboardContainer = {
    platform: CFD_Platform;
    active_index: number;
    is_dark_mode_on: boolean;
    dxtrade_tokens: {
        demo: string;
        real: string;
    };
};

export type TMT5AccountOpeningRealFinancialStpModal = {
    enableApp: () => void;
    disableApp: () => void;
    toggleCFDVerificationModal: () => void;
    is_cfd_verification_modal_visible: boolean;
};

export type TMissingRealAccount = {
    onClickSignup: () => void;
    platform: CFD_Platform;
};

export type TChangePassword = {
    platform: string;
    onConfirm: () => void;
};

export type TPasswordResetAndTradingPasswordManager = {
    email: string;
    platform: CFD_Platform;
    account_group: 'real' | 'demo';
    toggleModal?: () => void;
};

export type TResetPasswordIntent = {
    current_list: Record<string, DetailsOfEachMT5Loginid>;
    context?: RootStore;
    children({ ...props }): React.ReactElement;
    is_eu: boolean;
};

export type TError = {
    code: string | number;
    message: string;
};

export type TCFDResetPasswordModal = {
    current_list: Record<string, DetailsOfEachMT5Loginid>;
    email: string;
    context?: RootStore;
    is_cfd_reset_password_modal_enabled: boolean;
    is_eu: boolean;
    is_logged_in: boolean;
    platform: CFD_Platform;
    setCFDPasswordResetModal: (value: boolean) => void;
};

export type TCFDPasswordSuccessMessage = {
    toggleModal: () => void;
    is_investor: boolean;
};

export type TFormValues = Record<'old_password' | 'new_password' | 'password_type', string>;

export type TPasswordManagerModalFormValues = Record<'old_password' | 'new_password' | 'password_type', string>;

export type TMultiStepRefProps = {
    goNextStep: () => void;
    goPrevStep: () => void;
};

export type TInvestorPasswordManager = {
    error_message_investor: string;
    is_submit_success_investor: boolean;
    multi_step_ref: React.MutableRefObject<TMultiStepRefProps | undefined>;
    onSubmit: (values: TPasswordManagerModalFormValues) => Promise<void>;
    setPasswordType: (value: string) => void;
    toggleModal: () => void;
    validatePassword: (values: { old_password: string; new_password: string; password_type: string }) => void | object;
};

export type TCountdownComponent = {
    count_from: number;
    onTimeout: () => void;
};

export type TCFDPasswordReset = {
    sendVerifyEmail: () => Promise<VerifyEmailResponse>;
    account_type: string;
    account_group: 'real' | 'demo';
    server: string;
    context: RootStore;
    password_type: string;
};

export type TCFDPasswordManagerTabContentWrapper = {
    multi_step_ref: React.MutableRefObject<TMultiStepRefProps | undefined>;
    steps: Array<{ component: JSX.Element }>;
};

export type TCFDPasswordManagerTabContent = {
    toggleModal: () => void;
    selected_login: string;
    email: string;
    context: RootStore;
    setPasswordType: (value: string) => void;
    multi_step_ref: React.MutableRefObject<TMultiStepRefProps | undefined>;
    platform: CFD_Platform;
    onChangeActiveTabIndex: (value: number) => void;
    account_group: 'real' | 'demo';
};

export type TCFDPasswordManagerModal = {
    enableApp: () => void;
    email: string;
    is_eu: boolean;
    context: RootStore;
    disableApp: () => void;
    is_visible: boolean;
    platform: CFD_Platform;
    selected_login: string;
    selected_account: string;
    toggleModal: () => void;
    selected_account_type: string;
    selected_account_group: 'real' | 'demo';
    selected_server: string;
    sendVerifyEmail: () => Promise<VerifyEmailResponse>;
};

export type TJurisdictionCardProps = {
    account_status: GetAccountStatus;
    account_type: string;
    disabled: boolean;
    is_non_idv_design: boolean;
    jurisdiction_selected_shortcode: string;
    setJurisdictionSelectedShortcode: (card_type: string) => void;
    type_of_card: TJurisdictionCardType;
};

export type TJurisdictionCardBackProps = {
    card_classname: string;
    disabled: boolean;
    is_card_selected: boolean;
    toggleCardFlip: React.MouseEventHandler<HTMLSpanElement>;
    verification_docs: TJurisdictionCardItemVerification | undefined;
};

export type TJurisdictionCardFrontProps = TJurisdictionCardBackProps & {
    account_status: GetAccountStatus;
    card_data: TJurisdictionCardSection[];
    card_values: TJurisdictionCardItems;
    disabled: boolean;
    type_of_card: TJurisdictionCardType;
};

export type TJurisdictionClickableDescriptionProps = {
    clickable_description: Array<TClickableDescription>;
    toggleCardFlip: React.MouseEventHandler<HTMLSpanElement>;
};

export type TJurisdictionTitleIndicatorProps = {
    account_status: GetAccountStatus;
    title_indicators: TJurisdictionCardSectionTitleIndicators;
    type_of_card: TJurisdictionCardType;
    verification_docs: TJurisdictionCardItemVerification | undefined;
};

export type TJurisdictionCardSectionProps = {
    account_status: GetAccountStatus;
    card_section_item: TJurisdictionCardSection;
    toggleCardFlip: React.MouseEventHandler<HTMLSpanElement>;
    type_of_card: TJurisdictionCardType;
    verification_docs: TJurisdictionCardItemVerification | undefined;
};

export type TJurisdictionCardType = 'svg' | 'bvi' | 'vanuatu' | 'labuan' | 'maltainvest';

export type TVerificationStatusBannerProps = {
    account_status: GetAccountStatus;
    account_type: string;
    context: RootStore;
    card_classname: string;
    disabled: boolean;
    is_virtual: boolean;
    type_of_card: string;
    real_synthetic_accounts_existing_data: TExistingData;
    real_financial_accounts_existing_data: TExistingData;
    real_swapfree_accounts_existing_data: TExistingData;
    should_restrict_bvi_account_creation: boolean;
    should_restrict_vanuatu_account_creation: boolean;
};

export type TJurisdictionCheckBoxProps = {
    class_name: string;
    context: RootStore;
    is_checked: boolean;
    jurisdiction_selected_shortcode: string;
    onCheck: () => void;
    should_restrict_bvi_account_creation: boolean;
    should_restrict_vanuatu_account_creation: boolean;
};
type TOpenAccountTransferMeta = {
    category: string;
    type?: string;
};

type TJurisdictionModalCommonProps = {
    account_type: {
        type: string;
        category: string;
    };
    context: RootStore;
    is_jurisdiction_modal_visible: boolean;
    openPasswordModal: (account_type: TOpenAccountTransferMeta) => void;
    show_eu_related_content: boolean;
    toggleJurisdictionModal: () => void;
};

export type TJurisdictionModalContentWrapperProps = TJurisdictionModalCommonProps & {
    account_status: GetAccountStatus;
    fetchAccountSettings: () => void;
    has_submitted_cfd_personal_details: boolean;
    is_virtual: boolean;
    jurisdiction_selected_shortcode: string;
    real_financial_accounts_existing_data: TExistingData;
    real_swapfree_accounts_existing_data: TExistingData;
    real_synthetic_accounts_existing_data: TExistingData;
    residence: string;
    residence_list: ResidenceList;
    setJurisdictionSelectedShortcode: (shortcode: string) => void;
    should_restrict_bvi_account_creation: boolean;
    should_restrict_vanuatu_account_creation: boolean;
    toggleCFDVerificationModal: () => void;
    trading_platform_available_accounts: TTradingPlatformAvailableAccount[];
    updateMT5Status: () => void;
};

export type TJurisdictionModalProps = TJurisdictionModalCommonProps & {
    disableApp: () => void;
    enableApp: () => void;
};

export type TJurisdictionModalContentProps = {
    account_status: GetAccountStatus;
    account_type: string;
    is_non_idv_design: boolean;
    jurisdiction_selected_shortcode: string;
    setJurisdictionSelectedShortcode: (card_type: string) => void;
    synthetic_available_accounts: TTradingPlatformAvailableAccount[];
    financial_available_accounts: TTradingPlatformAvailableAccount[];
    swapfree_available_accounts: TTradingPlatformAvailableAccount[];
    real_synthetic_accounts_existing_data: TExistingData;
    real_financial_accounts_existing_data: TExistingData;
    real_swapfree_accounts_existing_data: TExistingData;
    is_virtual: boolean;
};

export type TJurisdictionModalFootNoteProps = {
    account_status: GetAccountStatus;
    account_type: string;
    card_classname: string;
    context: RootStore;
    jurisdiction_selected_shortcode: string;
    should_restrict_bvi_account_creation: boolean;
    should_restrict_vanuatu_account_creation: boolean;
};

export type TCompareAccountRowItem = {
    text: string;
    tooltip_msg?: string;
    options?: Record<string, string | boolean | Record<string, string>>;
};

export type TCompareAccountContentValues = Record<
    string,
    TCompareAccountRowItem | TCompareAccountRowItem[] | undefined
>;

export type TCompareAccountRowProps = TCompareAccountContentProps & {
    available_accounts_count: number;
    classname_for_demo_and_eu: string | null;
    content_flag: string;
    is_pre_appstore_setting: boolean;
    pre_appstore_class: string;
    is_high_risk_for_mt5: boolean;
    CFDs_restricted_countries: string[];
    financial_restricted_countries: string[];
    is_preappstore_restricted_cr_demo_account: boolean;
};

export type TCompareAccountContentProps = {
    id: string;
    attribute: string;
    values: TCompareAccountContentValues;
};

export type TCompareAccountFooterButtonData = { label: string; action: string };

export type TDMT5CompareModalContentProps = {
    account_settings: GetSettings;
    account_status: GetAccountStatus;
    account_type: TOpenAccountTransferMeta;
    clearCFDError: () => void;
    content_flag: string;
    context: RootStore;
    current_list: Record<string, DetailsOfEachMT5Loginid>;
    has_real_account: boolean;
    is_demo_tab: boolean;
    is_logged_in: boolean;
    is_pre_appstore_setting: boolean;
    is_preappstore_cr_demo_account: boolean;
    is_preappstore_restricted_cr_demo_account: boolean;
    is_real_enabled: boolean;
    is_virtual: boolean;
    openDerivRealAccountNeededModal: () => void;
    openPasswordModal: (account_type: TOpenAccountTransferMeta) => void;
    openSwitchToRealAccountModal: () => void;
    real_account_creation_unlock_date: string;
    setAccountSettings: (get_settings_response: GetSettings) => void;
    setAccountType: (account_type: TOpenAccountTransferMeta) => void;
    setAppstorePlatform: (platform: string) => void;
    setJurisdictionSelectedShortcode: (shortcode: string) => void;
    setShouldShowCooldownModal: (value: boolean) => void;
    should_restrict_bvi_account_creation: boolean;
    should_restrict_vanuatu_account_creation: boolean;
    should_show_derivx: boolean;
    show_eu_related_content: boolean;
    toggleCFDPersonalDetailsModal: (is_from_mt5_compare_accounts?: boolean) => void;
    toggleCFDVerificationModal: () => void;
    toggleCompareAccounts: () => void;
    trading_platform_available_accounts: TTradingPlatformAvailableAccount[];
    updateMT5Status: () => void;
    upgradeable_landing_companies: unknown[];
    no_CR_account: boolean;
    is_eu_user: boolean;
    no_MF_account: boolean;
    CFDs_restricted_countries: string[];
    financial_restricted_countries: string[];
};

export type TCFDDbviOnboardingProps = {
    account_status: GetAccountStatus;
    context: RootStore;
    disableApp: () => void;
    enableApp: () => void;
    fetchAccountSettings: () => void;
    has_created_account_for_selected_jurisdiction: boolean;
    has_submitted_cfd_personal_details: boolean;
    is_cfd_verification_modal_visible: boolean;
    is_virtual: boolean;
    jurisdiction_selected_shortcode: string;
    openPasswordModal: () => void;
    toggleCFDVerificationModal: () => void;
    updateAccountStatus: () => void;
    updateMT5Status: () => void;
};
