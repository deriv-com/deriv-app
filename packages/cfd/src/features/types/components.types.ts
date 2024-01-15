import React, { ReactElement } from 'react';
import { FormikHelpers as FormikActions, FormikValues } from 'formik';
import { TCoreStores } from '@deriv/stores/types';
import { ResidenceList, DetailsOfEachMT5Loginid, GetSettings, GetAccountStatus, KycAuthStatus } from '@deriv/api-types';
import { MARKET_TYPE } from 'Helpers/cfd-config';
import { TCFDPasswordReset } from './containers.types';
import { TCFDPlatform, TTokens, TTradingPlatformAvailableAccount, TAccountCategory, TMarketType } from './shared.types';

type TOnSubmit = (
    index: number,
    value: TFormValues,
    setSubmitting: (isSubmitting: boolean) => void,
    is_dirty?: boolean
) => void;

// cfd-account-copy
export type TCFDAccountCopy = {
    text?: string;
    className: string;
};

// cfd-personal-details-form
export type TCFDPersonalDetailsFormProps = {
    index: number;
    form_error?: string;
    is_loading: boolean;
    onSubmit: TOnSubmit;
    initial_values: TFormValues;
    changeable_fields?: string[];
    residence_list: ResidenceList;
};

export type TValidatePersonalDetailsParams = {
    values: TFormValues;
    residence_list: ResidenceList;
    account_opening_reason: TAccountOpeningReasonList;
};

export type TFindDefaultValuesInResidenceList = (params: {
    citizen_text: GetSettings['citizen'];
    tax_residence_text: GetSettings['tax_residence'];
    place_of_birth_text?: GetSettings['place_of_birth'];
    residence_list: ResidenceList;
}) => {
    citizen?: GetSettings['citizen'];
    tax_residence?: GetSettings['tax_residence'];
    place_of_birth?: GetSettings['place_of_birth'];
};

export type TCFDInputFieldProps = React.ComponentProps<'input'> & {
    optional?: boolean;
};

export type TFormValues = { [key: string]: string };

// cfd-poa
export type TCFDPOA = {
    index: number;
    onSave: (index: number, values: FormikValues) => void;
    onSubmit: (index: number, values: FormikValues) => void;
};

// cfd-poi
type TPOIState = {
    poi_state?: GetAccountStatus['authentication'];
};

export type TCFDPOIProps = {
    index: number;
    height: string;
    value: TPOIState;
    onSave: (index: number, values: TPOIState) => void;
    onSubmit: (index: number, value: TPOIState) => void;
    removeNotificationByKey: TCoreStores['notifications']['removeNotificationByKey'];
    jurisdiction_selected_shortcode: DetailsOfEachMT5Loginid['landing_company_short'];
    removeNotificationMessage: TCoreStores['notifications']['removeNotificationMessage'];
    addNotificationMessageByKey: TCoreStores['notifications']['addNotificationMessageByKey'];
};

// specbox
export type TSpecBoxProps = {
    value?: string;
    is_bold?: boolean;
    is_broker?: boolean;
};

// success-dialog
export type TCheckmark = {
    className: string;
};

export type TSuccessDialog = {
    width: React.CSSProperties['width'];
    title?: string;
    is_open: boolean;
    icon_size: string;
    icon: ReactElement;
    has_cancel: boolean;
    has_submit: boolean;
    text_submit?: string;
    text_cancel?: string;
    onCancel?: () => void;
    onSubmit?: () => void;
    has_close_icon: boolean;
    toggleModal: () => void;
    classNameMessage?: string;
    is_medium_button?: boolean;
    message: ReactElement | string;
    heading?: ReactElement | string;
};

export type TSubmitForm = (
    idx: number,
    is_dirty: boolean,
    values: TFormValues,
    onSubmitFn: TOnSubmit,
    residence_list: ResidenceList,
    actions: FormikActions<TFormValues>
) => void;

export type TAccountOpeningReasonList = {
    text: string;
    value: string;
}[];

export type TDxtradeDesktopDownloadProps = {
    is_demo: string;
    dxtrade_tokens: TTokens;
};

export type TAccountIconValues = { [key: string]: string };

// password-box
export type TPasswordBoxProps = {
    platform: TCFDPlatform;
    onClick: () => void;
};

export type TType = {
    type: TMarketType;
    platform: TCFDPlatform;
    category: TCFDPasswordReset['account_group'];
};

type TOpenAccountTransferMeta = {
    type?: TType['type'];
    category: TAccountCategory;
};

// cfd-account-card
export type TCFDAccountCardActionProps = {
    type: TType['type'];
    title: string;
    platform: TCFDPlatform;
    is_disabled: boolean;
    is_virtual?: boolean;
    has_real_account?: boolean;
    onSelectAccount: () => void;
    is_button_primary?: boolean;
    is_accounts_switcher_on?: boolean;
    button_label?: string | ReactElement;
    handleClickSwitchAccount: () => void;
    real_account_creation_unlock_date: string;
    setShouldShowCooldownModal: (value: boolean) => void;
};

export type TModifiedTradingPlatformAvailableAccount = Omit<TTradingPlatformAvailableAccount, 'market_type'> & {
    platform?: TCFDPlatform;
    market_type: TTradingPlatformAvailableAccount['market_type'] | 'synthetic';
};

export type TCardFlipStatus = {
    svg: boolean;
    bvi: boolean;
    labuan: boolean;
    vanuatu: boolean;
    maltainvest: boolean;
};

export type TClickableDescription = {
    text: string;
    type: 'text' | 'link';
    onClick?: React.MouseEventHandler<HTMLSpanElement>;
};

export type TJurisdictionCardSectionTitleIndicators = {
    display_text?: string;
    display_text_skin_color?: string;
    type: 'displayText' | 'displayIcons';
};

export type TJurisdictionCardSection = {
    key: string;
    title: string;
    description?: string;
    clickable_description?: Array<TClickableDescription>;
    title_indicators?: TJurisdictionCardSectionTitleIndicators;
};

export type TJurisdictionCardVerificationStatus = 'Pending' | 'Verified' | 'Failed' | 'Default';

export type TJurisdictionCardItemVerificationItem =
    | 'selfie'
    | 'document_number'
    | 'identity_document'
    | 'name_and_address'
    | 'not_applicable';

export type TJurisdictionCardItemVerification = Array<TJurisdictionCardItemVerificationItem>;

export type TJurisdictionCardItems = {
    header: string;
    over_header?: string;
    is_over_header_available: boolean;
    synthetic_contents: TJurisdictionCardSection[];
    financial_contents: TJurisdictionCardSection[];
    swapfree_contents?: TJurisdictionCardSection[];
    synthetic_verification_docs?: TJurisdictionCardItemVerification;
    financial_verification_docs?: TJurisdictionCardItemVerification;
};

export type TJurisdictionCardParams = {
    toggleDynamicLeverage: React.MouseEventHandler<HTMLSpanElement>;
};

export type TJurisdictionVerificationSection = {
    icon: string;
    text: string;
};

export type TJurisdictionVerificationItems = {
    selfie?: TJurisdictionVerificationSection;
    not_applicable?: TJurisdictionVerificationSection;
    document_number?: TJurisdictionVerificationSection;
    name_and_address?: TJurisdictionVerificationSection;
    identity_document?: TJurisdictionVerificationSection;
};

type TJurisdictionVerificationColors = React.CSSProperties['color'];

export type TJurisdictionVerificationStatus = {
    icon: string;
    text: string;
    color: TJurisdictionVerificationColors;
};

export type TExistingData = DetailsOfEachMT5Loginid & DetailsOfEachMT5Loginid[];

export type TCFDAccountCard = {
    type: TType;
    title: string;
    platform: TCFDPlatform;
    descriptor: string;
    is_virtual?: boolean;
    is_hovered?: boolean;
    has_banner?: boolean;
    is_disabled: boolean;
    is_logged_in: boolean;
    commission_message: string;
    has_real_account?: boolean;
    is_button_primary?: boolean;
    onSelectAccount: () => void;
    has_cfd_account_error?: boolean;
    is_accounts_switcher_on?: boolean;
    button_label?: string | ReactElement;
    existing_accounts_data?: TExistingData | null;
    toggleAccountsDialog?: (arg?: boolean) => void;
    onClickFund: (arg: DetailsOfEachMT5Loginid) => void;
    toggleShouldShowRealAccountsList?: (arg: boolean) => void;
    specs?: { [key: string]: { key: () => string; value: () => string } };
    onPasswordManager: (
        arg1: string | undefined,
        arg2: string,
        group: TCFDPasswordReset['account_group'],
        arg4: string,
        arg5: string | undefined
    ) => void;
};

export type TTradingPlatformAccounts = {
    account_id?: string;
    account_type?: TAccountCategory;
    balance?: number;
    country?: string;
    currency?: string;
    display_balance?: string;
    display_login?: string;
    landing_company_short?: DetailsOfEachMT5Loginid['landing_company_short'];
    login?: string;
    market_type?: keyof typeof MARKET_TYPE;
    platform?: TCFDPlatform;
};

export type TJurisdictionData = {
    jurisdiction?: DetailsOfEachMT5Loginid['landing_company_short'];
};

type TServerInfo = Exclude<DetailsOfEachMT5Loginid['server_info'], undefined>;

export type TDetailsOfEachMT5Loginid = DetailsOfEachMT5Loginid & {
    display_login?: string;
    landing_company_short?: DetailsOfEachMT5Loginid['landing_company_short'];
    short_code_and_region?: DetailsOfEachMT5Loginid['landing_company_short'] &
        Exclude<TServerInfo['geolocation'], undefined>['region'];
    mt5_acc_auth_identity?: DetailsOfEachMT5Loginid['status'];
    selected_mt5_jurisdiction?: TOpenAccountTransferMeta &
        TJurisdictionData & {
            platform?: TCFDPlatform;
        };

    openFailedVerificationModal?: (from_account: string) => void;
};
