import { localize } from '@deriv/translations';
import { TCFDPasswordFormReusedProps } from '../../Containers/props.types';

type TAccountType = 'synthetic' | 'all' | 'financial';

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

export const getButtonLabel = (error_type?: string) => {
    if (error_type === 'PasswordReset') {
        return localize('Try later');
    }
    return localize('Add account');
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
