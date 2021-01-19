import { GetFinancialAssessment, GetSettings, ResidenceList, StatesList } from '@deriv/api-types';
import { TClientProps, TConfigProps, TRoutesProps, TUIProps } from 'Types';

export type TClientStore = {
    init: (client_props: TClientProps) => void;
    readonly email_address: string;
    readonly has_active_real_account: () => boolean;
    readonly upgradeable_currencies: () => string[];
    currencies_list: unknown;
    currency: string;
    fetchResidenceList: () => void;
    fetchStatesList: () => void;
    fetchFinancialAssessment: () => void;
    needs_financial_assessment: () => boolean;
    financial_assessment: GetFinancialAssessment;
    residence_list: ResidenceList;
    states_list: StatesList;
    account_settings: GetSettings;
    is_fully_authenticated: () => boolean;
    realAccountSignup: () => Promise<void>;
    upgrade_info: any;
    has_currency: () => boolean;
    setAccountCurrency: () => void;
    residence: string;
    upgradeable_landing_companies: string[];
};

export type TConfigStore = {
    asset_path: string;
    has_router: boolean;
    is_deriv_crypto: boolean;
    redirect_404?: string;
    routes: TRoutesProps;
    setConfig: (config: TConfigProps) => void;
};

export type TAccountCategory = 'real' | 'demo';
export type TAccountType = 'synthetic' | 'financial' | 'financial_stp';

export type TMT5Store = {
    account_title: string;
    account_type: {
        category: TAccountCategory;
        type: TAccountType;
    };
    has_mt5_error: boolean;
    is_mt5_success_dialog_enabled: boolean;
    is_mt5_password_modal_enabled: boolean;
    error_message: string;
    setError: (x: boolean) => void;
    setMt5SuccessDialog: (x: boolean) => void;
    submitMt5Password: () => void;
    beginRealSignupForMt5: () => void;
    enableMt5PasswordModal: () => void;
    disableMt5PasswordModal: () => void;
};

export type TRootStore = {
    ui_store: TUIStore;
    client_store: TClientStore;
    config_store: TConfigStore;
    mt5_store: TMT5Store;
};

export type TUIStore = {
    components: {
        LoginPrompt?: React.ComponentType | React.ElementType;
        Page404?: React.ComponentType | React.ElementType;
    };
    is_dark_mode_on: boolean;
    init: (ui_props: TUIProps) => void;
    resetRealAccountSignupParams: () => void;
    real_account_signup: unknown;
    real_account_signup_target: string;
    is_get_wallet_modal_open: boolean;
    is_real_acc_signup_on: boolean;
    enableGetPasswordModal: () => void;
    disableGetPasswordModal: () => void;
};
