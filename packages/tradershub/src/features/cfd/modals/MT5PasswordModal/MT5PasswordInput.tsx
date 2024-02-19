import React from 'react';
import MT5PasswordIcon from '@/assets/svgs/ic-mt5-password.svg';
import { ActionScreen, SentEmailContent } from '@/components';
import { useMT5AccountHandler } from '@/hooks';
import { MarketType, QueryStatus } from '@cfd/constants';
import { CreatePassword, EnterPassword } from '@cfd/screens';
import { useAccountStatus } from '@deriv/api';
import { Provider } from '@deriv/library';
import MT5SuccessModal from './MT5SuccessModal';

type TMT5PasswordInputProps = {
    password: string;
    setPassword: (password: string) => void;
};

const MT5PasswordInput = ({ password, setPassword }: TMT5PasswordInputProps) => {
    const { data: accountStatus } = useAccountStatus();
    const { show } = Provider.useModal();
    const { getCFDState } = Provider.useCFDContext();

    const marketType = getCFDState('marketType') ?? MarketType.ALL;
    const platform = getCFDState('platform');

    const isMT5PasswordNotSet = accountStatus?.is_mt5_password_not_set;
    const {
        createMT5AccountLoading,
        handleSubmit,
        isCreateMT5AccountError,
        isCreateMT5AccountSuccess,
        tradingPlatformPasswordChangeLoading,
    } = useMT5AccountHandler();

    if (!platform || (status === QueryStatus.ERROR && isCreateMT5AccountError?.error?.code !== 'PasswordError')) {
        return (
            <ActionScreen
                description={isCreateMT5AccountError?.error.message}
                title={isCreateMT5AccountError?.error?.code}
            />
        );
    }

    if (isCreateMT5AccountSuccess) return <MT5SuccessModal />;

    if (isMT5PasswordNotSet) {
        return (
            <CreatePassword
                icon={<MT5PasswordIcon />}
                isLoading={tradingPlatformPasswordChangeLoading || createMT5AccountLoading}
                onPasswordChange={e => setPassword(e.target.value)}
                onPrimaryClick={() => handleSubmit(password)}
                password={password}
                platform={platform}
            />
        );
    }

    return (
        <EnterPassword
            isLoading={tradingPlatformPasswordChangeLoading || createMT5AccountLoading}
            marketType={marketType}
            onPasswordChange={e => setPassword(e.target.value)}
            onPrimaryClick={() => handleSubmit(password)}
            onSecondaryClick={() => show(<SentEmailContent platform={platform} />)}
            password={password}
            passwordError={isCreateMT5AccountError?.error?.code === 'PasswordError'}
            platform={platform}
        />
    );
};

export default MT5PasswordInput;
