import React, { useEffect, useState } from 'react';
import { useLocalStorage, useReadLocalStorage } from 'usehooks-ts';
import { useActiveWalletAccount, useAuthorize, useAvailableWallets, useWalletAccountsList } from '@deriv/api';
import Joyride, { ACTIONS, CallBackProps, EVENTS, STATUS } from '@deriv/react-joyride';
import useDevice from '../../hooks/useDevice';
import useMutationObserver from '../../hooks/useMutationObserver';
import { useTabs } from '../Base/Tabs/Tabs';
import {
    TooltipComponent,
    tourStepConfig,
    walletsOnboardingLocalStorageKey as key,
    walletsOnboardingStartValue as startValue,
} from './WalletTourGuideSettings';
import './WalletTourGuide.scss';

type TProps = {
    cfdRef: React.RefObject<HTMLElement>;
    optionsRef: React.RefObject<HTMLElement>;
};

const WalletMobileTourGuide = ({ cfdRef, optionsRef }: TProps) => {
    const [walletsOnboarding, setWalletsOnboarding] = useLocalStorage(key, useReadLocalStorage(key));
    const { isMobile } = useDevice();
    const { activeTabIndex, setActiveTabIndex } = useTabs();
    const [onboardingStep, setOnboardingStep] = useState(0);
    const [run, setRun] = useState(true);

    const { isFetching, isLoading, isSuccess, switchAccount } = useAuthorize();
    const { data: wallets } = useWalletAccountsList();
    const { data: activeWallet } = useActiveWalletAccount();
    const { data: availableWallets } = useAvailableWallets();

    const fiatWalletLoginId = wallets?.[0]?.loginid;
    const activeWalletLoginId = activeWallet?.loginid;

    const onCFDHandler = (mutationList: MutationRecord[]) => {
        const added = mutationList.some(
            mutation =>
                mutation.type === 'childList' &&
                (mutation.addedNodes?.item(0) as Element)?.className === 'wallets-trading-account-card'
        );

        if ((onboardingStep === 0 || onboardingStep === 3) && !run) setRun(walletsOnboarding === startValue && added);
    };

    const onOptionsHandler = (mutationList: MutationRecord[]) => {
        const added = mutationList.some(
            mutation =>
                mutation.type === 'childList' &&
                (mutation.target as Element)?.className === 'wallets-options-and-multipliers-listing__header-title'
        );

        if (onboardingStep === 4 && !run) setRun(walletsOnboarding === startValue && added);
    };

    useMutationObserver(cfdRef, onCFDHandler);
    useMutationObserver(optionsRef, onOptionsHandler);

    const callbackHandle = (data: CallBackProps) => {
        const { action, index, status, type } = data;

        const switchTab = (idx: number) => {
            if (activeTabIndex !== idx) {
                setActiveTabIndex(idx);
            }
        };

        if (index >= 4) switchTab(1);
        else switchTab(0);

        // wait for switch
        if (index === 0) {
            const exists =
                (cfdRef.current?.childNodes.item(0) as Element)?.className === 'wallets-trading-account-card';
            setRun(walletsOnboarding === startValue && exists);
        }

        // pause if target was not found
        if (type === EVENTS.TARGET_NOT_FOUND) setRun(false);

        if (type === EVENTS.STEP_AFTER) {
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
                setRun(false);
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
            run={walletsOnboarding === startValue && run && !isLoading && !isFetching && isSuccess}
            scrollOffset={300}
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
