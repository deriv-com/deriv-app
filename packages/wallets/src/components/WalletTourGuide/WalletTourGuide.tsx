import React, { useEffect } from 'react';
import { useLocalStorage, useReadLocalStorage } from 'usehooks-ts';
import { useActiveWalletAccount, useAllWalletAccounts, useAuthorize, useWalletAccountsList } from '@deriv/api';
import Joyride, { ACTIONS, CallBackProps } from '@deriv/react-joyride';
import useDevice from '../../hooks/useDevice';
import {
    getFiatWalletLoginId,
    getWalletIndexForTarget,
    TooltipComponent,
    tourStepConfig,
    walletsOnboardingLocalStorageKey as key,
    walletsOnboardingStartValue as startValue,
} from './WalletTourGuideSettings';
import './WalletTourGuide.scss';

const WalletTourGuide = () => {
    const [walletsOnboarding, setWalletsOnboarding] = useLocalStorage(key, useReadLocalStorage(key));
    const { isMobile } = useDevice();

    const { isFetching, isLoading, isSuccess, switchAccount } = useAuthorize();
    const { data: wallets } = useWalletAccountsList();
    const { data: activeWallet } = useActiveWalletAccount();
    const { data: availableWallets } = useAllWalletAccounts();

    const fiatWalletLoginId = getFiatWalletLoginId(wallets);
    const walletIndex = getWalletIndexForTarget(fiatWalletLoginId, wallets);
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

    const isDemoWallet = Boolean(activeWallet?.is_virtual);
    const hasMT5Account = Boolean(activeWallet?.linked_to?.some(account => account.platform === 'mt5'));
    const hasDerivAppsTradingAccount = Boolean(activeWallet?.dtrade_loginid);
    const isAllWalletsAlreadyAdded = Boolean(availableWallets?.every(wallet => wallet.is_added));

    if (isMobile) return null;

    return (
        <Joyride
            callback={callbackHandle}
            continuous
            disableCloseOnEsc
            disableOverlayClose
            floaterProps={{ disableAnimation: true }}
            run={walletsOnboarding === startValue && !isLoading && !isFetching && isSuccess}
            scrollOffset={150}
            steps={tourStepConfig(
                false,
                isDemoWallet,
                hasMT5Account,
                hasDerivAppsTradingAccount,
                isAllWalletsAlreadyAdded,
                walletIndex
            )}
            tooltipComponent={TooltipComponent}
        />
    );
};

export default WalletTourGuide;
