import React from 'react';
import { useAccountStatus } from '@deriv/api';
import { Provider } from '@deriv/library';
import { ActionScreen, SentEmailContent } from '../../../../components';
import useMT5AccountHandler from '../../../../hooks/useMT5AccountHandler';
import MT5PasswordIcon from '../../../../public/images/ic-mt5-password.svg';
import { MarketType, QueryStatus, TTM5FilterLandingCompany } from '../../constants';
import { CreatePassword, EnterPassword } from '../../screens';
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
    const selectedJurisdiction = getCFDState('selectedJurisdiction') as TTM5FilterLandingCompany;

    const isMT5PasswordNotSet = accountStatus?.is_mt5_password_not_set;
    const {
        createMT5AccountLoading,
        handleSubmit,
        isCreateMT5AccountError,
        isCreateMT5AccountSuccess,
        tradingPlatformPasswordChangeLoading,
    } = useMT5AccountHandler({
        marketType,
        selectedJurisdiction,
    });

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
