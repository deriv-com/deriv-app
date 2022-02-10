import { FormikHelpers as FormikActions } from 'formik';
import { TCFDPasswordFormValues } from './cfd-password-modal';

export type TCFDChangePasswordConfirmationProps = {
    confirm_label?: string;
    platform: string;
    className?: string;
    onConfirm: (values: TCFDPasswordFormValues, actions: FormikActions<TCFDPasswordFormValues>) => void;
    onCancel: () => void;
};

export type TCFDDashboardContainer = {
    platform: 'dxtrade' | 'mt5';
    active_index: number;
    is_dark_mode_on: boolean;
};

export type TMT5AccountOpeningRealFinancialStpModal = {
    enableApp: () => void;
    disableApp: () => void;
    disableMt5FinancialStpModal: () => void;
    is_mt5_financial_stp_modal_open: boolean;
};

export type TMissingRealAccount = {
    onClickSignup: () => void;
    platform: 'dxtrade' | 'mt5';
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
