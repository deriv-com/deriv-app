import React, { useEffect, useState } from 'react';
import { useLocalStorage, useReadLocalStorage } from 'usehooks-ts';
import { useActiveWalletAccount, useAuthorize, useAvailableWallets, useWalletAccountsList } from '@deriv/api';
import Joyride, { ACTIONS, CallBackProps, EVENTS, STATUS } from '@deriv/react-joyride';
import useDevice from '../../hooks/useDevice';
import useMutationObserver from '../../hooks/useMutationObserver';
import { useTabs } from '../Base/Tabs/Tabs';
import { TooltipComponent, tourStepConfig } from './WalletTourGuideSettings';
import './WalletTourGuide.scss';

type TProps = {
    cfdRef: React.RefObject<HTMLElement>;
    optionsRef: React.RefObject<HTMLElement>;
};

const WalletMobileTourGuide = ({ cfdRef, optionsRef }: TProps) => {
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

    const [run, setRun] = useState(false);
    // const [run, setRun] = useState(walletsOnboarding === startValue && !isLoading && !isFetching && isSuccess);

    const fiatWalletLoginId = wallets?.[0]?.loginid;
    const activeWalletLoginId = activeWallet?.loginid;

    const onCFDHandler = (mutationList: MutationRecord[]) => {
        const added = mutationList.some(
            mutation =>
                mutation.type === 'childList' &&
                (mutation.addedNodes?.[0] as Element)?.className === 'wallets-trading-account-card'
        );

        // console.log('CFD! added = ', added, ', added2 = ', added2);

        if (onboardingStep === 0 || onboardingStep === 3) setRun(walletsOnboarding === startValue && added);
    };

    const onOptionsHandler = (mutationList: MutationRecord[]) => {
        const added = mutationList.some(
            mutation =>
                mutation.type === 'childList' &&
                (mutation.target as Element)?.className === 'wallets-options-and-multipliers-listing__header-title'
        );

        // console.log('Options! added = ', added, ', added2 = ', added2, ', addedNodes = ', mutationList?.[0]);

        if (onboardingStep === 4) setRun(walletsOnboarding === startValue && added);
    };

    // const onRootHandler = useCallback(() => {
    //     console.log('Root = ', rootRef);
    //     // console.log('Root.childList = ', rootRef.current?.childList);
    //     // console.log('Root.childNodes = ', rootRef.current?.childNodes?.[1]?.firstChild?.firstChild);

    //     // wallets-options-and-multipliers-listing ->
    //     // -> wallets-options-and-multipliers-listing__header (1st child) ->
    //     // -> wallets-deriv-apps-section (2nd child)

    //     // wallets-cfd-list ->
    //     // -> wallets-mt5-list__content (3rd child) ->
    //     // -> wallets-trading-account-card (1st child)
    // }, []);

    useMutationObserver(cfdRef, onCFDHandler);
    useMutationObserver(optionsRef, onOptionsHandler);
    // useMutationObserver(rootRef, onRootHandler);

    // console.log('cfdRef.current = ', cfdRef.current);
    // console.log('optionsRef.current = ', optionsRef.current);

    const callbackHandle = (data: CallBackProps) => {
        const { action, index, status, type } = data;

        const switchTab = (idx: number) => {
            if (activeTabIndex !== idx) {
                setActiveTabIndex(idx);
                // setRun(false);
            }
        };

        if (index >= 4) switchTab(1);
        else switchTab(0);

        if (index === 0) setRun(walletsOnboarding === startValue);

        if ((index === 0 || index === 3 || index === 4) && type === EVENTS.STEP_BEFORE) {
            // console.log('cfdRef.current = ', cfdRef.current);
            // setRun(false);
        }

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
            // run={run}
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
