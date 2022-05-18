import { History } from 'history';
import { DetailsOfEachMT5Loginid } from '@deriv/api-types';
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

export type TResetPasswordIntent = {
    current_list: Array<DetailsOfEachMT5Loginid> & Record<string, DetailsOfEachMT5Loginid>;
    children({ ...props }): React.ReactElement;
    is_eu: boolean;
};

export type TError = {
    code: string | number;
    message: string;
};

export type TCFDResetPasswordModal = {
    current_list: Array<DetailsOfEachMT5Loginid> & Record<string, DetailsOfEachMT5Loginid>;
    email: string;
    is_cfd_reset_password_modal_enabled: boolean;
    is_eu: boolean;
    is_logged_in: boolean;
    platform: 'dxtrade' | 'mt5';
    setCFDPasswordResetModal: (value: boolean) => void;
    history: History;
};

export type TCFDPasswordSuccessMessage = {
    toggleModal: () => void;
    is_investor: boolean;
};

export type TPasswordManagerModalFormValues = {
    old_password: string;
    new_password: string;
    password_type: string;
};

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
