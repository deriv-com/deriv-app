import React, { useEffect, useState } from 'react';
import { useLocalStorage, useReadLocalStorage } from 'usehooks-ts';
import { useActiveWalletAccount, useAuthorize, useAvailableWallets, useWalletAccountsList } from '@deriv/api';
import Joyride, { ACTIONS, CallBackProps, EVENTS, STATUS } from '@deriv/react-joyride';
import useDevice from '../../hooks/useDevice';
import { useTabs } from '../Base/Tabs/Tabs';
import { TooltipComponent, tourStepConfig } from './WalletTourGuideSettings';
import './WalletTourGuide.scss';

const WalletMobileTourGuide = () => {
    const key = 'walletsOnboarding';
    const startValue = 'started';
    const [walletsOnboarding, setWalletsOnboarding] = useLocalStorage(key, useReadLocalStorage(key));
    const { isMobile } = useDevice();
    const { activeTabIndex, setActiveTabIndex } = useTabs();
    const [onboardingStep, setOnboardingStep] = useState(0);

    const { isFetching, isLoading, isSuccess, switchAccount } = useAuthorize();
    const { data: wallets } = useWalletAccountsList();
    const { data: activeWallet } = useActiveWalletAccount();
    const { data: availableWallets } = useAvailableWallets();

    const fiatWalletLoginId = wallets?.[0]?.loginid;
    const activeWalletLoginId = activeWallet?.loginid;

    const callbackHandle = (data: CallBackProps) => {
        const { action, index, status, type } = data;

        const switchTab = (idx: number) => {
            if (activeTabIndex !== idx) setActiveTabIndex(idx);
        };

        if (index >= 4) switchTab(1);
        else switchTab(0);

        if (type === EVENTS.STEP_AFTER || type === EVENTS.TARGET_NOT_FOUND) {
            // Update step to advance the tour
            setOnboardingStep(index + (action === ACTIONS.PREV ? -1 : 1));
        } else if (status === STATUS.FINISHED || status === STATUS.SKIPPED) {
            // Reset onboarding
            setWalletsOnboarding('');
            setOnboardingStep(0);
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

    if (!isMobile) return null;

    return (
        <Joyride
            callback={callbackHandle}
            continuous
            disableCloseOnEsc
            disableOverlayClose
            floaterProps={{ disableAnimation: true }}
            run={walletsOnboarding === startValue && !isLoading && !isFetching && isSuccess}
            scrollOffset={300}
            scrollToFirstStep
            stepIndex={onboardingStep}
            steps={tourStepConfig(
                true,
                isDemoWallet,
                hasMT5Account,
                hasDerivAppsTradingAccount,
                isAllWalletsAlreadyAdded
            )}
            tooltipComponent={TooltipComponent}
        />
    );
};

export default WalletMobileTourGuide;
