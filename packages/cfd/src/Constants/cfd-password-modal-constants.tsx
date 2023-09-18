import { localize } from '@deriv/translations';

export const getWalletCFDInfo = (type: string) => {
    switch (type) {
        case 'synthetic':
            return {
                icon: 'IcRebrandingMt5DerivedDashboard',
                title: localize('MT5 Derived'),
            };
        case 'all':
            return {
                icon: 'IcRebrandingMt5SwapFree',
                title: localize('MT5 SwapFree'),
            };
        case 'financial':
            return {
                icon: 'IcRebrandingMt5FinancialDashboard',
                title: localize('MT5 Financial'),
            };
        default:
            return {
                icon: '',
                title: '',
            };
    }
};

export const PASSWORD_ERRORS = Object.freeze({
    RESET: 'PasswordReset',
    ERROR: 'PasswordErrors',
    PASSWORD: 'trading_password',
});

export const ACCOUNT_CATEGORY = Object.freeze({
    REAL: 'real',
    DEMO: 'demo',
});
