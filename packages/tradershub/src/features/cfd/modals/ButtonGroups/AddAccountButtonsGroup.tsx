import React from 'react';
import { ButtonGroup } from '@/components';
import { useQueryParams } from '@/hooks';
import { useCFDContext } from '@/providers';
import { platformPasswordResetRedirectLink } from '@/utils';
import { useActiveTradingAccount, useSettings, useVerifyEmail } from '@deriv/api-v2';
import { Button } from '@deriv-com/ui';
import { CFDPlatforms, PlatformDetails } from '../../constants';
import DxtradeCreateAccountButton from '../DxtradePasswordModal/DxtradeCreateAccountButton';
import MT5CreateAccountButton from '../MT5PasswordModal/MT5CreateAccountButton';

type TAddAccountButtonsGroupProps = {
    password: string;
};

const AddAccountButtonsGroup = ({ password }: TAddAccountButtonsGroupProps) => {
    const { cfdState } = useCFDContext();
    const { data } = useSettings();
    const { mutate } = useVerifyEmail();
    const { data: activeTrading } = useActiveTradingAccount();
    const { platform = CFDPlatforms.MT5 } = cfdState;
    const { openModal } = useQueryParams();

    const handleSendEmail = async () => {
        if (data.email) {
            await mutate({
                type:
                    platform === PlatformDetails.dxtrade.platform
                        ? 'trading_platform_dxtrade_password_reset'
                        : 'trading_platform_mt5_password_reset',
                url_parameters: {
                    redirect_to: platformPasswordResetRedirectLink(platform, activeTrading?.is_virtual),
                },
                verify_email: data.email,
            });
        }
        openModal('SentEmailContentModal');
    };

    return (
        <ButtonGroup className='justify-end w-full'>
            <Button color='black' onClick={handleSendEmail} variant='outlined'>
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
