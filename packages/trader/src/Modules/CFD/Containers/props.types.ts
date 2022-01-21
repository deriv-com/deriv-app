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
};
