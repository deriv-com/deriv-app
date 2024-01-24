import React from 'react';
import { useAccountStatus } from '@deriv/api';
import { Provider } from '@deriv/library';
import { SentEmailContent } from '../../../../components';
import MT5PasswordIcon from '../../../../public/images/ic-mt5-password.svg';
import { PlatformDetails } from '../../constants';
import { CreatePassword, EnterPassword } from '../../screens';
import { useSubmitHandler } from './useSubmitHandler';

type TPasswordComponentProps = {
    password: string;
    setPassword: (password: string) => void;
};

const PasswordComponent = ({ password, setPassword }: TPasswordComponentProps) => {
    const { data: accountStatus } = useAccountStatus();
    const { show } = Provider.useModal();

    const { getCFDState } = Provider.useCFDContext();
    const error = getCFDState('error');
    const createMT5AccountLoading = getCFDState('createMT5AccountLoading');
    const tradingPlatformPasswordChangeLoading = getCFDState('tradingPlatformPasswordChangeLoading');

    const marketType = getCFDState('marketType') ?? 'all';
    const platform = getCFDState('platform') ?? 'mt5';

    const isMT5PasswordNotSet = accountStatus?.is_mt5_password_not_set;
    const submitHandler = useSubmitHandler({ password });

    return isMT5PasswordNotSet ? (
        <CreatePassword
            icon={<MT5PasswordIcon />}
            isLoading={tradingPlatformPasswordChangeLoading || createMT5AccountLoading}
            onPasswordChange={e => setPassword(e.target.value)}
            onPrimaryClick={() => submitHandler}
            password={password}
            platform={PlatformDetails.mt5.platform}
        />
    ) : (
        <EnterPassword
            isLoading={tradingPlatformPasswordChangeLoading || createMT5AccountLoading}
            marketType={marketType}
            onPasswordChange={e => setPassword(e.target.value)}
            onPrimaryClick={() => submitHandler}
            onSecondaryClick={() => show(<SentEmailContent platform={platform} />)}
            password={password}
            passwordError={error?.error?.code === 'PasswordError'}
            platform={PlatformDetails.mt5.platform}
        />
    );
};

export default PasswordComponent;
