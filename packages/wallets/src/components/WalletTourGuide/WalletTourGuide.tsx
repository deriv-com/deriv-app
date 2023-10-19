import React, { useEffect, useState } from 'react';
import Joyride, { ACTIONS, CallBackProps } from 'react-joyride';
import { useActiveWalletAccount, useAuthorize, useAvailableWallets, useWalletAccountsList } from '@deriv/api';
import { WalletText } from '../Base';
import { TooltipComponent, tourStepConfig } from './WalletTourGuideSettings';
import './WalletTourGuide.scss';

const WalletTourGuide = () => {
    const key = 'walletsOnboarding';
    const [isStarted, setIsStarted] = useState(localStorage.getItem(key) === 'started');

    const { switchAccount } = useAuthorize();
    const { data: wallets } = useWalletAccountsList();
    const { data: activeWallet } = useActiveWalletAccount();
    const { data: availableWallets } = useAvailableWallets();

    const fiatWalletLoginId = wallets?.[0]?.loginid;
    const activeWalletLoginId = activeWallet?.loginid;

    const callbackHandle = (data: CallBackProps) => {
        const { action } = data;

        if (action === ACTIONS.RESET) {
            localStorage.removeItem(key);
            setIsStarted(false);
        }
    };

    useEffect(() => {
        const switchToFiatWallet = (): boolean => {
            if (fiatWalletLoginId && fiatWalletLoginId !== activeWalletLoginId) {
                switchAccount(fiatWalletLoginId);
                return true;
            }
            return false;
        };

        const onStorage = () => {
            const needToStart = localStorage.getItem(key) === 'started';
            if (needToStart) {
                const isJustSwitched = switchToFiatWallet();
                if (isJustSwitched) setTimeout(() => setIsStarted(true), 1000);
                else setIsStarted(true);
            }
        };

        window.addEventListener('storage', onStorage);

        return () => {
            window.removeEventListener('storage', onStorage);
        };
    }, [activeWalletLoginId, fiatWalletLoginId, switchAccount]);

    if (!activeWallet) return <WalletText>...Loading</WalletText>;

    const isDemoWallet = activeWallet?.is_virtual;
    const hasMT5Account = Boolean(activeWallet?.linked_to?.some(account => account.platform === 'mt5'));
    const hasDerivAppsTradingAccount = Boolean(activeWallet?.dtrade_loginid);
    const isAllWalletsAlreadyAdded = Boolean(availableWallets?.every(wallet => wallet.is_added));

    return (
        <Joyride
            callback={callbackHandle}
            continuous
            disableCloseOnEsc
            disableOverlayClose
            disableScrollParentFix
            floaterProps={{ disableAnimation: true }}
            run={isStarted}
            scrollOffset={150}
            scrollToFirstStep
            steps={tourStepConfig(isDemoWallet, hasMT5Account, hasDerivAppsTradingAccount, isAllWalletsAlreadyAdded)}
            tooltipComponent={TooltipComponent}
        />
    );
};

export default WalletTourGuide;
