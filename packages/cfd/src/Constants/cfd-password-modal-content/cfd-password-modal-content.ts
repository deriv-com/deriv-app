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
