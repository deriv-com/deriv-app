import React from 'react';
import DxtradePasswordIcon from '@/assets/svgs/ic-derivx-password-updated.svg';
import { ActionScreen, SentEmailContent } from '@/components';
import { useCFDContext, useModal } from '@/providers';
import { useAccountStatus } from '@deriv/api-v2';
import useDxtradeAccountHandler from '../../../../hooks/useDxtradeAccountHandler';
import { MarketType, QueryStatus } from '../../constants';
import { CreatePassword, EnterPassword } from '../../screens';
import DxtradeSuccessModal from './DxtradeSuccessModal';

type TDxtradePasswordInputProps = {
    password: string;
    setPassword: (password: string) => void;
};

const DxtradePasswordInput = ({ password, setPassword }: TDxtradePasswordInputProps) => {
    const { data: accountStatus } = useAccountStatus();
    const { show } = useModal();
    const { cfdState } = useCFDContext();

    const marketType = MarketType.ALL;
    const { platform } = cfdState;

    const isDxtradePasswordNotSet = accountStatus?.is_dxtrade_password_not_set;
    const { createDxtradeAccountError, createDxtradeAccountLoading, createOtherCFDAccountSuccess, handleSubmit } =
        useDxtradeAccountHandler();

    if (!platform || (status === QueryStatus.ERROR && createDxtradeAccountError?.error?.code !== 'PasswordError')) {
        return (
            <ActionScreen
                description={createDxtradeAccountError?.error.message}
                title={createDxtradeAccountError?.error?.code}
            />
        );
    }

    if (createOtherCFDAccountSuccess) return <DxtradeSuccessModal />;

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

export default DxtradePasswordInput;
