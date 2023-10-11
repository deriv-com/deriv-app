import { localize } from '@deriv/translations';

export const getWalletCFDInfo = (type: string) => {
    switch (type) {
        case 'synthetic':
            return {
                icon: 'IcRebrandingMt5DerivedDashboard',
                account_title: localize('MT5 Derived'),
                modal_title: localize('Derived demo'),
            };
        case 'all':
            return {
                icon: 'IcRebrandingMt5SwapFree',
                account_title: localize('MT5 Swap-Free'),
                modal_title: localize('Swap-Free demo'),
            };
        case 'financial':
            return {
                icon: 'IcRebrandingMt5FinancialDashboard',
                title: localize('MT5 Financial'),
                modal_title: localize('Financial demo'),
            };
        default:
            return {
                icon: '',
                account_title: '',
                modal_title: '',
            };
    }
};

export const PASSWORD_ERRORS = Object.freeze({
    RESET: 'PasswordReset',
    ERROR: 'PasswordError',
    PASSWORD: 'trading_password',
});

export const ACCOUNT_CATEGORY = Object.freeze({
    REAL: 'real',
    DEMO: 'demo',
});
