import { Jurisdiction, CFD_PLATFORMS } from '@deriv/shared';
import { localize } from '@deriv/translations';
import {
    TDerivezCompanies,
    TDxCompanies,
    TMtCompanies,
    getDerivezCompanies,
    getDxCompanies,
    getMtCompanies,
} from '../../Stores/Modules/CFD/Helpers/cfd-config';

type TGetTypeLabel = {
    platform: string;
    is_eu: boolean;
    category: string;
    type: string;
};

type TCancelButtonProps = {
    should_set_trading_password: boolean;
    error_type?: string;
    is_mobile: boolean;
};

// TODO: Update with other platform and CFDs
export const getWalletCFDTitle = (type: string) => {
    switch (type) {
        case 'synthetic':
            return localize('MT5 Derived');
        case 'all':
            return localize('MT5 SwapFree');
        case 'financial':
            return localize('MT5 Financial');
        default:
            return '';
    }
};

export const getMt5PlatformLabel = (jurisdiction_shortcode: string) => {
    if (jurisdiction_shortcode !== Jurisdiction.MALTA_INVEST) {
        return 'Deriv MT5';
    }
    return '';
};

export const getTypeLabel = ({ platform, is_eu, category, type }: TGetTypeLabel) => {
    switch (platform) {
        case CFD_PLATFORMS.MT5:
            return getMtCompanies(is_eu)[category as keyof TMtCompanies][type as keyof TMtCompanies['demo' | 'real']]
                .short_title;
        case CFD_PLATFORMS.DXTRADE:
            return getDxCompanies()[category as keyof TDxCompanies][type as keyof TDxCompanies['demo' | 'real']]
                .short_title;
        case CFD_PLATFORMS.DERIVEZ:
            return getDerivezCompanies()[category as keyof TDerivezCompanies][
                type as keyof TDerivezCompanies['demo' | 'real']
            ].short_title;
        default:
            return '';
    }
};

export const getCancelButtonLabel = ({ should_set_trading_password, error_type, is_mobile }: TCancelButtonProps) => {
    if (should_set_trading_password && error_type !== 'PasswordReset') {
        return !is_mobile ? null : localize('Cancel');
    }

    return localize('Forgot password?');
};

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

export const getButtonLabel = (error_type?: string) => {
    if (error_type === 'PasswordReset') {
        return localize('Try later');
    }
    return localize('Add account');
};
