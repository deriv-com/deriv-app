export type TCFDChangePasswordConfirmationProps = {
    confirm_label: string;
    platform: string;
    className: string;
    onConfirm: () => void;
    onCancel: () => void;
};

export type TMT5AccountOpeningRealFinancialStpModal = {
    enableApp: () => void;
    disableApp: () => void;
    disableMt5FinancialStpModal: () => void;
    is_mt5_financial_stp_modal_open: boolean;
};
