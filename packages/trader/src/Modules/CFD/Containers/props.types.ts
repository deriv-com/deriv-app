export type TCFDChangePasswordConfirmationProps = {
    confirm_label: string;
    platform: string;
    className?: string;
    onConfirm: () => void;
    onCancel: () => void;
};

export type TChangePassword = {
    platform: 'mt5' | 'dxtrade';
    onConfirm: () => void;
};

export type TPasswordResetAndTradingPasswordManager = {
    email: string;
    platform: 'mt5' | 'dxtrade';
    account_group: 'real' | 'demo';
    toggleModal?: () => void;
};

export type TCountdownComponent = {
    count_from: number;
    onTimeout: (value?: boolean) => void;
};

export type TCFDPasswordReset = {
    sendVerifyEmail: () => Promise<any>;
    account_type: string;
    account_group: 'real' | 'demo';
    server: string;
    password_type: string;
};

export type TCFDPasswordSuccessMessage = {
    toggleModal: () => boolean;
    is_investor: boolean;
};

export type TCFDPasswordManagerTabContentWrapper = {
    multi_step_ref: React.MutableRefObject<any>;
    steps: Array<{ component: JSX.Element }>;
};

export type TInvestorPasswordManager = {
    error_message_investor: string;
    is_submit_success_investor: boolean;
    multi_step_ref: React.MutableRefObject<any>;
    onSubmit: (values: any) => Promise<void>;
    setPasswordType: (value: string) => void;
    toggleModal: () => boolean;
    validatePassword: (values: { old_password: string; new_password: string; password_type: string }) => void | object;
};

export type TCFDPasswordManagerTabContent = {
    toggleModal: () => boolean;
    selected_login: string;
    email: string;
    setPasswordType: (value: string) => void;
    multi_step_ref: React.MutableRefObject<any>;
    platform: 'dxtrade' | 'mt5';
    onChangeActiveTabIndex: (value: number) => void;
    account_group: 'real' | 'demo';
    password_type?: string;
};

export type TCFDPasswordManagerModal = {
    enableApp: () => void;
    email: string;
    disableApp: () => void;
    is_visible: boolean;
    platform: 'dxtrade' | 'mt5';
    selected_login: string;
    selected_account: string;
    toggleModal: () => boolean;
    selected_account_type: string;
    selected_account_group: 'real' | 'demo';
    selected_server: string;
    sendVerifyEmail: () => Promise<any>;
};
