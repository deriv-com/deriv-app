import { localize } from '@deriv/translations';
import { CFD_PLATFORMS } from '@deriv/shared';
import { TCFDPasswordFormReusedProps } from '../../Containers/props.types';
import {
    getDerivezCompanies,
    getDxCompanies,
    getFormattedJurisdictionCode,
    getMtCompanies,
    TDerivezCompanies,
    TDxCompanies,
    TMtCompanies,
} from '../../Stores/Modules/CFD/Helpers/cfd-config';

type TAccountType = 'synthetic' | 'all' | 'financial';
type TCategory = 'demo' | 'real';
type TPlatform = 'mt5' | 'dxtrade' | 'derivez';

type TshowJurisdiction = {
    platform?: TPlatform;
    show_eu_related_content?: boolean;
    jurisdiction_selected_shortcode: string;
};

type TgetTypeLabel = {
    type: TAccountType;
    platform: TPlatform;
    show_eu_related_content: boolean;
    category: TCategory;
};

export const getButtonLabel = (error_type?: string) => {
    if (error_type === 'PasswordReset') {
        return localize('Try later');
    }
    return localize('Add account');
};

export const hasCancelButton = ({
    is_mobile,
    should_set_trading_password,
    error_type,
}: {
    is_mobile: boolean;
    should_set_trading_password: boolean;
    error_type?: string;
}) => {
    return (!is_mobile ? !should_set_trading_password : true) || error_type === 'PasswordReset';
};

export const getCancelButtonLabel = ({
    should_set_trading_password,
    error_type,
    is_mobile,
}: Pick<TCFDPasswordFormReusedProps, 'should_set_trading_password' | 'error_type' | 'is_mobile'>) => {
    if (should_set_trading_password && error_type !== 'PasswordReset') {
        return !is_mobile ? null : localize('Cancel');
    }

    return localize('Forgot password?');
};

export const showJurisdiction = ({
    platform,
    show_eu_related_content,
    jurisdiction_selected_shortcode,
}: TshowJurisdiction) => {
    if (platform !== CFD_PLATFORMS.DXTRADE && show_eu_related_content) {
        return 'CFDs';
    }
    return getFormattedJurisdictionCode(jurisdiction_selected_shortcode);
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

export const getCategoryLabel = (category: TCategory) => {
    if (category === 'real') {
        return localize('real');
    }
    return localize('demo');
};

export const getTypeLabel = ({ type, platform, show_eu_related_content, category }: TgetTypeLabel) => {
    switch (platform) {
        case CFD_PLATFORMS.MT5:
            return getMtCompanies(show_eu_related_content)[category as keyof TMtCompanies][
                type as keyof TMtCompanies['demo' | 'real']
            ].short_title;
            break;
        case CFD_PLATFORMS.DXTRADE:
            return getDxCompanies()[category as keyof TDxCompanies][type as keyof TDxCompanies['demo' | 'real']]
                .short_title;
            break;
        case CFD_PLATFORMS.DERIVEZ:
            return getDerivezCompanies()[category as keyof TDerivezCompanies][
                type as keyof TDerivezCompanies['demo' | 'real']
            ].short_title;
            break;
        default:
            return '';
    }
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

// TODO: Update with other platforms and CFDs
export const getWalletAccountTitle = (type: TAccountType) => {
    switch (type) {
        case 'synthetic':
            return 'MT5 Derived';
            break;
        case 'all':
            return localize('MT5 SwapFree');
            break;
        case 'financial':
            return localize('MT5 Financial');
            break;
        default:
            return '';
    }
};
