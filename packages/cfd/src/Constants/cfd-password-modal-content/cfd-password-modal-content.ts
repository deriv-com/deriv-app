type THasCancelButton = {
    is_mobile?: boolean;
    should_set_trading_password?: boolean;
    error_type?: string;
};
// TODO: Update with other platform and CFDs
export const getWalletAppIcon = (type: string) => {
    switch (type) {
        case 'synthetic':
            return 'IcRebrandingMt5DerivedDashboard';
        case 'all':
            return 'IcRebrandingMt5SwapFree';
        case 'financial':
            return 'IcRebrandingMt5FinancialDashboard';
        default:
            return '';
    }
};

export const hasCancelButton = ({ is_mobile, should_set_trading_password, error_type }: THasCancelButton) => {
    return !is_mobile && (!should_set_trading_password || error_type !== 'trading_password');
};
