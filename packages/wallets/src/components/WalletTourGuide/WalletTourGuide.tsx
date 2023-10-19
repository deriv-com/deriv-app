import React, { useEffect, useState } from 'react';
import Joyride, { ACTIONS, CallBackProps } from 'react-joyride';
import { useActiveWalletAccount, useAvailableWallets } from '@deriv/api';
import { WalletText } from '../Base';
import { TooltipComponent, tourStepConfig } from './WalletTourGuideSettings';
import './WalletTourGuide.scss';

const WalletTourGuide = () => {
    const key = 'walletsOnboarding';
    const [isStarted, setIsStarted] = useState(localStorage.getItem(key) === 'started');

    const { data: activeWallet } = useActiveWalletAccount();
    const { data: availableWallets } = useAvailableWallets();

    const callbackHandle = (data: CallBackProps) => {
        const { action } = data;

        if (action === ACTIONS.RESET) {
            setIsStarted(false);
        }
    };

    useEffect(() => {
        const onStorage = () => {
            setIsStarted(localStorage.getItem(key) === 'started');
        };

        window.addEventListener('storage', onStorage);

        return () => {
            window.removeEventListener('storage', onStorage);
        };
    }, []);

    if (!activeWallet) return <WalletText>...Loading</WalletText>;

    const isDemoWallet = activeWallet?.is_virtual;
    const hasMT5Account = Boolean(activeWallet?.linked_to?.some(account => account.platform === 'mt5'));
    const hasDerivAppsTradingAccount = Boolean(activeWallet?.linked_to?.some(account => account.platform === 'dtrade'));
    const isAllWalletsAlreadyAdded = Boolean(availableWallets?.every(wallet => wallet.is_added));

    return (
        <Joyride
            callback={callbackHandle}
            continuous
            disableCloseOnEsc
            disableScrolling
            floaterProps={{
                disableAnimation: true,
            }}
            run={isStarted}
            steps={tourStepConfig(isDemoWallet, hasMT5Account, hasDerivAppsTradingAccount, isAllWalletsAlreadyAdded)}
            tooltipComponent={TooltipComponent}
        />
    );
};

export default WalletTourGuide;
