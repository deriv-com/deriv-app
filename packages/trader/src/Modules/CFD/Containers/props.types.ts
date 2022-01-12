export type TCFDChangePasswordConfirmationProps = {
    confirm_label: string;
    platform: string;
    className: string;
    onConfirm: () => void;
    onCancel: () => void;
};

export type TMissingRealAccount = {
    onClickSignup: () => void;
    platform: 'dxtrade' | 'mt5';
};
