import { FormikHelpers as FormikActions } from 'formik';
import { TCFDPasswordFormValues } from './cfd-password-modal';

export type TCFDChangePasswordConfirmationProps = {
    confirm_label?: string;
    platform: string;
    className?: string;
    onConfirm: (values: TCFDPasswordFormValues, actions: FormikActions<TCFDPasswordFormValues>) => void;
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
