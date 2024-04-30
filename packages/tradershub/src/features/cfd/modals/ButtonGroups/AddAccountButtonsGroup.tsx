import React from 'react';
import { ButtonGroup } from '@/components';
import { useHandleSendEmail, useQueryParams } from '@/hooks';
import { useCFDContext } from '@/providers';
import { Button } from '@deriv-com/ui';
import { CFDPlatforms, PlatformDetails } from '../../constants';
import DxtradeCreateAccountButton from '../DxtradePasswordModal/DxtradeCreateAccountButton';
import MT5CreateAccountButton from '../MT5PasswordModal/MT5CreateAccountButton';

type TAddAccountButtonsGroupProps = {
    password: string;
};

const AddAccountButtonsGroup = ({ password }: TAddAccountButtonsGroupProps) => {
    const { cfdState } = useCFDContext();
    const { platform = CFDPlatforms.MT5 } = cfdState;
    const { openModal } = useQueryParams();
    const { handleSendEmail } = useHandleSendEmail();

    const handleForgotPassword = async () => {
        handleSendEmail();
        openModal('SentEmailContentModal');
    };

    return (
        <ButtonGroup className='justify-end w-full'>
            <Button color='black' onClick={handleForgotPassword} variant='outlined'>
                Forgot password?
            </Button>
            {platform === PlatformDetails.dxtrade.platform && (
                <DxtradeCreateAccountButton buttonText='Add account' password={password} />
            )}
            {platform === PlatformDetails.mt5.platform && (
                <MT5CreateAccountButton buttonText='Add account' password={password} />
            )}
        </ButtonGroup>
    );
};

export default AddAccountButtonsGroup;
