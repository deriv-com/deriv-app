import { DetailsOfEachMT5Loginid, Mt5NewAccount, VerifyEmailResponse } from '@deriv/api-types';

type TStoreProofOfAddressArgs = {
    file_uploader_ref: HTMLDivElement | null;
    values: {
        [key: string]: string;
    };
};

export type TCFDStore = {
    setMT5TradeAccount: (arg: any) => void;
    toggleCFDVerificationModal: () => void;
    setJurisdictionSelectedShortcode: (shortcode: string) => void;
    setAccountType: (account_type: { category: string; type?: string }) => void;
    dxtrade_tokens: {
        demo: string;
        real: string;
    };
    mt5_trade_account: Required<DetailsOfEachMT5Loginid>;
    real_synthetic_accounts_existing_data: DetailsOfEachMT5Loginid & DetailsOfEachMT5Loginid[];
    real_financial_accounts_existing_data: DetailsOfEachMT5Loginid & DetailsOfEachMT5Loginid[];
    account_type: {
        type: string;
        category: string;
    };
    jurisdiction_selected_shortcode: string;
    toggleJurisdictionModal: () => void;
    has_submitted_cfd_personal_details: boolean;
    is_jurisdiction_modal_visible: boolean;
    clearCFDError: () => void;
    current_list: Record<string, DetailsOfEachMT5Loginid & { enabled: number } & DetailsOfEachMT5Loginid[]>;
    is_compare_accounts_visible: boolean;
    toggleCompareAccounts: () => void;
    dxtrade_companies: Record<string, any>;
    mt5_companies: Record<string, any>;
    platform: string;
    topUpVirtual: (platform: string) => void;
    current_account?: DetailsOfEachMT5Loginid & {
        display_login: string;
        category: string;
        type: string;
    };
    sendVerifyEmail: () => Promise<VerifyEmailResponse>;
    account_title: string;
    disableCFDPasswordModal: () => void;
    error_message: string;
    error_type?: string;
    getAccountStatus: (platform: string) => void;
    has_cfd_error: boolean;
    is_cfd_password_modal_enabled: boolean;
    is_cfd_success_dialog_enabled: boolean;
    setCFDSuccessDialog: (value: boolean) => void;
    setError: (state: boolean, obj?: Error) => void;
    submitMt5Password: (values: { password: string }, actions: any) => void;
    submitCFDPassword: (values: { password: string } & { platform?: string }, actions: any) => void;
    new_account_response: Mt5NewAccount;
    is_cfd_verification_modal_visible: boolean;
    has_created_account_for_selected_jurisdiction: boolean;
    enableCFDPasswordModal: () => void;
    onMount: () => void;
    onUnmount: () => void;
    setCurrentAccount: (
        data: DetailsOfEachMT5Loginid,
        meta: {
            category: string;
            type?: string | undefined;
        }
    ) => void;
    getRealSyntheticAccountsExistingData: (
        getRealSyntheticAccountsExistingData: DetailsOfEachMT5Loginid[] | undefined
    ) => void;
    getRealFinancialAccountsExistingData: (
        getRealSyntheticAccountsExistingData: DetailsOfEachMT5Loginid[] | undefined
    ) => void;
    toggleMT5TradeModal: () => void;
    beginRealSignupForMt5: () => void;
    checkShouldOpenAccount: () => void;
    is_mt5_trade_modal_visible: boolean;
    createCFDAccount: (objCFDAccount: {
        category: string;
        type: string;
        set_password?: number | undefined;
        platform?: string | undefined;
    }) => void;
    storeProofOfAddress: TStoreProofOfAddressArgs;
};
