import { isDesktop } from '@deriv/shared';
import { localize } from '@deriv/translations';

import '../../sass/cfd.scss';
import { TCFDPasswordFormProps } from './cfd-password-modal.types.js';

const getCancelButtonLabel = ({
    should_set_trading_password,
    error_type,
}: Pick<TCFDPasswordFormProps, 'should_set_trading_password' | 'error_type'>) => {
    if (should_set_trading_password && error_type !== 'PasswordReset') {
        return isDesktop() ? null : localize('Cancel');
    }

    return localize('Forgot password?');
};

export default getCancelButtonLabel;
