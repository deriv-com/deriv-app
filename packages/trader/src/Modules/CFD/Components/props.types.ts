export type TCFDFinancialStpPendingDialog = {
    enableApp: () => void;
    disableApp: () => void;
    toggleModal: () => void;
    is_cfd_pending_dialog_open: boolean;
    is_fully_authenticated: boolean;
};

export type TCFDAccountCopy = {
    text: string;
    className: string;
};
