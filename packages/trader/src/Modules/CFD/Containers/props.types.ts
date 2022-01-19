import { History } from 'history';
import { DetailsOfEachMT5Loginid } from '@deriv/api-types';

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

export type TResetPasswordIntent = {
    current_list: { [key: string]: DetailsOfEachMT5Loginid };
    children({ ...props }): React.ReactElement;
    is_eu: boolean;
};

export type TCFDResetPasswordModal = {
    current_list: { [key: string]: DetailsOfEachMT5Loginid };
    email: string;
    is_cfd_reset_password_modal_enabled: boolean;
    is_eu: boolean;
    is_logged_in: boolean;
    platform: 'dxtrade' | 'mt5';
    setCFDPasswordResetModal: (value: boolean) => void;
    history: History;
};
