import React, { useEffect, useState } from 'react';
import Joyride, { ACTIONS, CallBackProps, EVENTS, STATUS } from 'react-joyride';
import { useLocalStorage, useReadLocalStorage } from 'usehooks-ts';
import { useActiveWalletAccount, useAuthorize, useWalletAccountsList } from '@deriv/api-v2';
import useDevice from '../../hooks/useDevice';
import useWalletAccountSwitcher from '../../hooks/useWalletAccountSwitcher';
import { useTabs } from '../WalletsPrimaryTabs/WalletsPrimaryTabs';
import {
    getFiatWalletLoginId,
    TooltipComponent,
    walletsOnboardingLocalStorageKey as key,
    walletsOnboardingStartValue as startValue,
} from './WalletTourGuideSettings';
import { mobileStepTourGuide } from './WalletTourSteps';
import './WalletTourGuide.scss';

type TProps = {
    isMT5PlatformListLoaded?: boolean;
    isOptionsAndMultipliersLoaded?: boolean;
    isWalletSettled?: boolean;
};

const WalletMobileTourGuide = ({ isWalletSettled = true }: TProps) => {
    const switchWalletAccount = useWalletAccountSwitcher();

    const [walletsOnboarding, setWalletsOnboarding] = useLocalStorage(key, useReadLocalStorage(key) ?? '');
    const { isMobile } = useDevice();
    const { activeTabIndex, setActiveTabIndex } = useTabs();
    const [onboardingStep, setOnboardingStep] = useState(0);
    const [run, setRun] = useState(true);

    const { isFetching, isLoading, isSuccess } = useAuthorize();
    const { data: wallets } = useWalletAccountsList();
    const { data: activeWallet } = useActiveWalletAccount();

    const fiatWalletLoginId = getFiatWalletLoginId(wallets);
    const activeWalletLoginId = activeWallet?.loginid;

    const callbackHandle = (data: CallBackProps) => {
        const { action, index, status, type } = data;

        const switchTab = (idx: number) => {
            if (activeTabIndex !== idx) {
                setActiveTabIndex(idx);
            }
        };

        const setPrevNextStep = () => {
            setOnboardingStep(index + (action === ACTIONS.PREV ? -1 : 1));
        };

        // switch tab to Options & Multipliers after step #4
        if (index >= 4) switchTab(1);
        else switchTab(0);

        // wait for isWalletSettled
        if (index === 0) {
            setRun(walletsOnboarding === startValue && isWalletSettled);
        }

        // pause if target was not found
        if (type === EVENTS.TARGET_NOT_FOUND) {
            // check for "Add more wallets" step
            if (onboardingStep !== 6) setRun(false);
            else setPrevNextStep();
        }

        // Update step to advance the tour
        if (type === EVENTS.STEP_AFTER) {
            setPrevNextStep();
        } else if (status === STATUS.FINISHED || status === STATUS.SKIPPED) {
            // Reset onboarding
            setWalletsOnboarding('');
            setOnboardingStep(0);
        }
    };

    useEffect(() => {
        const switchToFiatWallet = () => {
            if (fiatWalletLoginId && fiatWalletLoginId !== activeWalletLoginId) {
                switchWalletAccount(fiatWalletLoginId).then(() => {
                    setRun(false);
                });
            }
        };

        const needToStart = walletsOnboarding === startValue;
        if (needToStart) {
            switchToFiatWallet();
        }
    }, [activeWalletLoginId, fiatWalletLoginId, switchWalletAccount, walletsOnboarding]);

    if (!isMobile) return null;

    return (
        <Joyride
            callback={callbackHandle}
            continuous
            disableCloseOnEsc
            disableOverlayClose
            floaterProps={{ disableAnimation: true }}
            run={walletsOnboarding === startValue && run && !isLoading && !isFetching && isSuccess}
            scrollOffset={100}
            stepIndex={onboardingStep}
            steps={mobileStepTourGuide}
            tooltipComponent={TooltipComponent}
        />
    );
};

export default WalletMobileTourGuide;
