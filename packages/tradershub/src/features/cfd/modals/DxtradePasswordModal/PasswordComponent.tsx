import React from 'react';
import { useAccountStatus } from '@deriv/api';
import { Provider } from '@deriv/library';
import { ActionScreen, SentEmailContent } from '../../../../components';
import useDxtradeAccountHandler from '../../../../hooks/useDxtradeAccountHandler';
import DxtradePasswordIcon from '../../../../public/images/ic-dxtrade-password.svg';
import { MarketType, PlatformDetails, QueryStatus } from '../../constants';
import { CreatePassword, EnterPassword } from '../../screens';
import SuccessComponent from './SuccessComponent';

type TPasswordComponentProps = {
    password: string;
    setPassword: (password: string) => void;
};

const PasswordComponent = ({ password, setPassword }: TPasswordComponentProps) => {
    const { data: accountStatus } = useAccountStatus();
    const { show } = Provider.useModal();
    const { getCFDState } = Provider.useCFDContext();

    const marketType = MarketType.ALL;
    const platform = getCFDState('platform') ?? PlatformDetails.dxtrade.platform;

    const isDxtradePasswordNotSet = accountStatus?.is_dxtrade_password_not_set;
    const { createDxtradeAccountError, createDxtradeAccountLoading, createOtherCFDAccountSuccess, handleSubmit } =
        useDxtradeAccountHandler();

    if (status === QueryStatus.ERROR && createDxtradeAccountError?.error?.code !== 'PasswordError') {
        return (
            <ActionScreen
                description={createDxtradeAccountError?.error.message}
                title={createDxtradeAccountError?.error?.code}
            />
        );
    }

    if (createOtherCFDAccountSuccess) return <SuccessComponent />;

    if (isDxtradePasswordNotSet) {
        return (
            <CreatePassword
                icon={<DxtradePasswordIcon />}
                isLoading={createDxtradeAccountLoading}
                onPasswordChange={e => setPassword(e.target.value)}
                onPrimaryClick={() => handleSubmit(password)}
                password={password}
                platform={platform}
            />
        );
    }

    return (
        <EnterPassword
            isLoading={createDxtradeAccountLoading}
            marketType={marketType}
            onPasswordChange={e => setPassword(e.target.value)}
            onPrimaryClick={() => handleSubmit(password)}
            onSecondaryClick={() => show(<SentEmailContent platform={platform} />)}
            password={password}
            passwordError={createDxtradeAccountError?.error?.code === 'PasswordError'}
            platform={platform}
        />
    );
};

export default PasswordComponent;
