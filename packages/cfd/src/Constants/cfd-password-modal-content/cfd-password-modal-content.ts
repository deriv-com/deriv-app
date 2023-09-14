import { localize } from '@deriv/translations';
import { TCFDPasswordFormReusedProps } from '../../Containers/props.types';

export const getButtonLabel = (error_type?: string) => {
    if (error_type === 'PasswordReset') {
        return localize('Try later');
    }
    return localize('Add account');
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
