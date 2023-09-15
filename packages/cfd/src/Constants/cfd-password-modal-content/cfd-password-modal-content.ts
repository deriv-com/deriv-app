import { CFD_PLATFORMS } from '@deriv/shared';
import {
    getDerivezCompanies,
    getDxCompanies,
    getMtCompanies,
    TDerivezCompanies,
    TDxCompanies,
    TMtCompanies,
} from '../../Stores/Modules/CFD/Helpers/cfd-config';

type TAccountType = 'synthetic' | 'all' | 'financial';

export const getAccountTitle = (
    platform: string,
    account_type: {
        category?: string;
        type?: string;
    },
    account_title: string
) => {
    if (platform === CFD_PLATFORMS.DXTRADE) {
        return getDxCompanies()[account_type.category as keyof TDxCompanies][
            account_type.type as keyof TDxCompanies['demo' | 'real']
        ].short_title;
    }

    return account_title;
};

// Wallet App Icon
export const getWalletAppIcon = (type?: TAccountType) => {
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
