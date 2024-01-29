import React from 'react';
import { useAccountStatus } from '@deriv/api';
import { Provider } from '@deriv/library';
import { SentEmailContent } from '../../../../components';
import useMT5AccountHandler from '../../../../hooks/useMT5AccountHandler';
import MT5PasswordIcon from '../../../../public/images/ic-mt5-password.svg';
import { PlatformDetails } from '../../constants';
import { CreatePassword, EnterPassword } from '../../screens';

type TPasswordComponentProps = {
    password: string;
    setPassword: (password: string) => void;
};

const PasswordComponent = ({ password, setPassword }: TPasswordComponentProps) => {
    const { data: accountStatus } = useAccountStatus();
    const { show } = Provider.useModal();
    const { getCFDState } = Provider.useCFDContext();

    const marketType = getCFDState('marketType') ?? 'all';
    const platform = getCFDState('platform') ?? 'mt5';
    const selectedJurisdiction = getCFDState('selectedJurisdiction') ?? 'maltainvest';

    const isMT5PasswordNotSet = accountStatus?.is_mt5_password_not_set;
    const { createMT5AccountLoading, handleSubmit, isCreateMT5AccountError, tradingPlatformPasswordChangeLoading } =
        useMT5AccountHandler({
            marketType,
            selectedJurisdiction,
        });

    if (isMT5PasswordNotSet) {
        return (
            <CreatePassword
                icon={<MT5PasswordIcon />}
                isLoading={tradingPlatformPasswordChangeLoading || createMT5AccountLoading}
                onPasswordChange={e => setPassword(e.target.value)}
                onPrimaryClick={() => handleSubmit(password)}
                password={password}
                platform={PlatformDetails.mt5.platform}
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
            platform={PlatformDetails.mt5.platform}
        />
    );
};

export default PasswordComponent;
