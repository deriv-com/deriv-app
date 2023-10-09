import { CFD_PLATFORMS, Jurisdiction } from '@deriv/shared';
import { localize } from '@deriv/translations';

export const getWalletCFDInfo = (type: string, platform = CFD_PLATFORMS.MT5, jurisdiction = Jurisdiction.SVG) => {
    // for DerivX icon
    if (platform === CFD_PLATFORMS.DXTRADE)
        return {
            icon: 'IcRebrandingDxtradeDashboard',
            title: localize('Deriv X'),
        };

    // for MT5 for Malta
    if (jurisdiction === Jurisdiction.MALTA_INVEST)
        return {
            icon: 'IcRebrandingMt5Cfds',
            title: localize('MT5 CFDs'),
        };

    // for MT5 another jurisdiction
    switch (type) {
        case 'synthetic':
            return {
                icon: 'IcRebrandingMt5DerivedDashboard',
                title: localize('MT5 Derived'),
            };
        case 'all':
            return {
                icon: 'IcRebrandingMt5SwapFree',
                title: localize('Swap-Free'),
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
    ERROR: 'PasswordError',
    PASSWORD: 'trading_password',
});

export const ACCOUNT_CATEGORY = Object.freeze({
    REAL: 'real',
    DEMO: 'demo',
});
