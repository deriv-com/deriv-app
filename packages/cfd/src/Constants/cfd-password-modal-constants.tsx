import { CFD_PLATFORMS, Jurisdiction } from '@deriv/shared';

export const getWalletCFDInfo = (
    type: string,
    is_demo: boolean,
    platform = CFD_PLATFORMS.MT5,
    jurisdiction = Jurisdiction.SVG
) => {
    // for DerivX icon
    if (platform === CFD_PLATFORMS.DXTRADE)
        return {
            icon: 'IcRebrandingDxtradeDashboard',
            card_title: 'Deriv X',
            title: 'Deriv X',
            description_title: 'Deriv X',
        };

    // for MT5 for Malta
    if (jurisdiction === Jurisdiction.MALTA_INVEST)
        return {
            icon: 'IcRebrandingMt5Cfds',
            card_title: is_demo ? 'MT5 CFDs' : 'MT5 CFDs (Malta)',
            title: is_demo ? 'CFDs' : 'CFDs (Malta)',
            description_title: is_demo ? 'CFDs' : 'CFDs (Malta)',
        };

    // for MT5 another jurisdiction
    switch (type) {
        case 'synthetic':
            switch (jurisdiction) {
                case Jurisdiction.SVG:
                    return {
                        icon: 'IcRebrandingMt5DerivedDashboard',
                        card_title: is_demo ? 'MT5 Derived' : 'MT5 Derived (SVG)',
                        title: is_demo ? 'Derived' : 'Derived (SVG)',
                        description_title: is_demo ? 'Derived' : 'Derived (SVG)',
                    };
                case Jurisdiction.BVI:
                    return {
                        icon: 'IcRebrandingMt5DerivedDashboard',
                        card_title: 'MT5 Derived (BVI)',
                        title: 'Derived (BVI)',
                        description_title: 'Derived (BVI)',
                    };
                case Jurisdiction.VANUATU:
                    return {
                        icon: 'IcRebrandingMt5DerivedDashboard',
                        card_title: 'MT5 Derived (Vanuatu)',
                        title: 'Derived (Vanuatu)',
                        description_title: 'Derived (Vanuatu)',
                    };
                default:
                    return {
                        icon: '',
                        card_title: '',
                        title: '',
                        description_title: '',
                    };
            }

        case 'financial':
            switch (jurisdiction) {
                case Jurisdiction.SVG:
                    return {
                        icon: 'IcRebrandingMt5FinancialDashboard',
                        card_title: is_demo ? 'MT5 Financial' : 'MT5 Financial (SVG)',
                        title: is_demo ? 'Financial' : 'Financial (SVG)',
                        description_title: is_demo ? 'Financial' : 'Financial (SVG)',
                    };
                case Jurisdiction.BVI:
                    return {
                        icon: 'IcRebrandingMt5FinancialDashboard',
                        card_title: 'MT5 Financial (BVI)',
                        title: 'Financial (BVI)',
                        description_title: 'Financial (BVI)',
                    };
                case Jurisdiction.VANUATU:
                    return {
                        icon: 'IcRebrandingMt5FinancialDashboard',
                        card_title: 'MT5 Financial (Vanuatu)',
                        title: 'Financial (Vanuatu)',
                        description_title: 'Financial (Vanuatu)',
                    };
                case Jurisdiction.LABUAN:
                    return {
                        icon: 'IcRebrandingMt5FinancialDashboard',
                        card_title: 'MT5 Financial (Labuan)',
                        title: 'Financial (Labuan)',
                        description_title: 'Financial (Labuan)',
                    };
                default:
                    return {
                        icon: '',
                        card_title: '',
                        title: '',
                        description_title: '',
                    };
            }

        case 'all':
            return {
                icon: 'IcRebrandingMt5SwapFree',
                card_title: is_demo ? 'MT5 Swap-Free' : 'MT5 Swap-Free (SVG)',
                title: is_demo ? 'Swap-Free' : 'Swap-Free (SVG)',
                description_title: is_demo ? 'Swap-Free' : 'Swap-Free (SVG)',
            };

        default:
            return {
                icon: '',
                card_title: '',
                title: '',
                description_title: '',
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
