import React, { useEffect } from 'react';
import { useLocalStorage, useReadLocalStorage } from 'usehooks-ts';
import { useActiveWalletAccount, useAuthorize, useAvailableWallets, useWalletAccountsList } from '@deriv/api';
import Joyride, { ACTIONS, CallBackProps } from '@deriv/react-joyride';
import { WalletText } from '../Base';
import { TooltipComponent, tourStepConfig } from './WalletTourGuideSettings';
import './WalletTourGuide.scss';

const WalletTourGuide = () => {
    const key = 'walletsOnboarding';
    const startValue = 'started';
    const [walletsOnboarding, setWalletsOnboarding] = useLocalStorage(key, useReadLocalStorage(key));

    const { isFetching, isLoading, isSuccess, switchAccount } = useAuthorize();
    const { data: wallets } = useWalletAccountsList();
    const { data: activeWallet } = useActiveWalletAccount();
    const { data: availableWallets } = useAvailableWallets();

    const fiatWalletLoginId = wallets?.[0]?.loginid;
    const activeWalletLoginId = activeWallet?.loginid;

    const callbackHandle = (data: CallBackProps) => {
        const { action } = data;

        if (action === ACTIONS.RESET) {
            setWalletsOnboarding('');
        }
    };

    useEffect(() => {
        const switchToFiatWallet = () => {
            if (fiatWalletLoginId && fiatWalletLoginId !== activeWalletLoginId) {
                switchAccount(fiatWalletLoginId);
            }
        };

        const needToStart = walletsOnboarding === startValue;
        if (needToStart) {
            switchToFiatWallet();
        }
    }, [activeWalletLoginId, fiatWalletLoginId, switchAccount, walletsOnboarding]);

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
            floaterProps={{ disableAnimation: true }}
            run={walletsOnboarding === startValue && !isLoading && !isFetching && isSuccess}
            scrollOffset={150}
            scrollToFirstStep
            steps={tourStepConfig(isDemoWallet, hasMT5Account, hasDerivAppsTradingAccount, isAllWalletsAlreadyAdded)}
            tooltipComponent={TooltipComponent}
        />
    );
};

export default WalletTourGuide;
