import React, { FC, useState } from 'react';
import { useActiveWalletAccount, useSettings, useVerifyEmail } from '@deriv/api-v2';
import { useModal } from '../../../../../components/ModalProvider';
import { platformPasswordResetRedirectLink } from '../../../../../utils/cfd';
import MT5ChangeInvestorPasswordInputsScreen from './MT5ChangeInvestorPasswordInputsScreen';
import MT5ChangeInvestorPasswordSavedScreen from './MT5ChangeInvestorPasswordSavedScreen';
import './MT5ChangeInvestorPasswordScreens.scss';

type TChangeInvestorPasswordScreenIndex = 'introScreen' | 'savedScreen';

type TProps = {
    setShowEmailSentScreen?: (value: boolean) => void;
};

const MT5ChangeInvestorPasswordScreens: FC<TProps> = ({ setShowEmailSentScreen }) => {
    const [activeScreen, setActiveScreen] = useState<TChangeInvestorPasswordScreenIndex>('introScreen');
    const handleClick = (nextScreen: TChangeInvestorPasswordScreenIndex) => setActiveScreen(nextScreen);
    const { getModalState, hide } = useModal();
    const { data } = useSettings();
    const { mutate } = useVerifyEmail();
    const { data: activeWallet } = useActiveWalletAccount();
    const mt5AccountId = getModalState('accountId') || '';

    const handleSendEmail = async () => {
        if (data.email) {
            await mutate({
                type: 'trading_platform_investor_password_reset',
                url_parameters: {
                    redirect_to: platformPasswordResetRedirectLink('mt5', activeWallet?.is_virtual),
                },
                verify_email: data.email,
            });

            localStorage.setItem('trading_platform_investor_password_reset_account_id', mt5AccountId);
        }
    };

    switch (activeScreen) {
        case 'savedScreen':
            return (
                <div className='wallets-change-investor-password-screens__content'>
                    <MT5ChangeInvestorPasswordSavedScreen setNextScreen={hide} />
                </div>
            );
        case 'introScreen':
        default:
            return (
                <div className='wallets-change-investor-password-screens__content'>
                    <MT5ChangeInvestorPasswordInputsScreen
                        sendEmail={() => {
                            handleSendEmail();
                            setShowEmailSentScreen?.(true);
                        }}
                        setNextScreen={() => handleClick('savedScreen')}
                    />
                </div>
            );
    }
};

export default MT5ChangeInvestorPasswordScreens;
