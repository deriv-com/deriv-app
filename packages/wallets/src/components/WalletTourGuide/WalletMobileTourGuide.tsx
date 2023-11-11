import React, { useEffect, useState } from 'react';
import { useLocalStorage, useReadLocalStorage } from 'usehooks-ts';
import { useActiveWalletAccount, useAuthorize, useAvailableWallets, useWalletAccountsList } from '@deriv/api';
import Joyride, { ACTIONS, CallBackProps, EVENTS, STATUS } from '@deriv/react-joyride';
import useDevice from '../../hooks/useDevice';
import { useTabs } from '../Base/Tabs/Tabs';
import {
    TooltipComponent,
    tourStepConfig,
    walletsOnboardingLocalStorageKey as key,
    walletsOnboardingStartValue as startValue,
} from './WalletTourGuideSettings';
import './WalletTourGuide.scss';

type TProps = {
    isMT5PlatformListLoaded?: boolean;
    isOptionsAndMultipliersLoaded?: boolean;
};

const WalletMobileTourGuide = ({ isMT5PlatformListLoaded = true, isOptionsAndMultipliersLoaded = true }: TProps) => {
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

    const callbackHandle = (data: CallBackProps) => {
        const { action, index, status, type } = data;

        const switchTab = (idx: number) => {
            if (activeTabIndex !== idx) {
                setActiveTabIndex(idx);
            }
        };

        // switch tab to Options & Multipliers after step #4
        if (index >= 4) switchTab(1);
        else switchTab(0);

        // wait for isMT5PlatformListLoaded
        if (index === 0) {
            setRun(walletsOnboarding === startValue && isMT5PlatformListLoaded);
        }

        // pause if target was not found
        if (type === EVENTS.TARGET_NOT_FOUND) {
            // check for "Add more wallets" step
            if (onboardingStep !== 6) setRun(false);
            else setOnboardingStep(index + (action === ACTIONS.PREV ? -1 : 1));
        }

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

    // for isMT5PlatformListLoaded
    useEffect(() => {
        if ((onboardingStep === 0 || onboardingStep === 3) && !run)
            setRun(walletsOnboarding === startValue && isMT5PlatformListLoaded);
    }, [isMT5PlatformListLoaded, onboardingStep, run, walletsOnboarding]);

    // for isOptionsAndMultipliersLoaded
    useEffect(() => {
        if (onboardingStep === 4 && !run) setRun(walletsOnboarding === startValue && isOptionsAndMultipliersLoaded);
    }, [isOptionsAndMultipliersLoaded, onboardingStep, run, walletsOnboarding]);

    const isDemoWallet = Boolean(activeWallet?.is_virtual);
    const hasMT5Account = Boolean(activeWallet?.linked_to?.some(account => account.platform === 'mt5'));
    const hasDerivAppsTradingAccount = Boolean(activeWallet?.dtrade_loginid);
    const isAllWalletsAlreadyAdded = Boolean(availableWallets?.every(wallet => wallet.is_added));
    // const isAllWalletsAlreadyAdded = true;

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
