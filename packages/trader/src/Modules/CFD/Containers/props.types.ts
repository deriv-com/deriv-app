export type TCFDChangePasswordConfirmationProps = {
    confirm_label: string;
    platform: string;
    className: string;
    onConfirm: () => void;
    onCancel: () => void;
};

export type TCFDDashboardContainer = {
    platform: 'dxtrade' | 'mt5';
    active_index: number;
    is_dark_mode_on: boolean;
};
