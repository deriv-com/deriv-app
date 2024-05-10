import React, { useEffect, useState } from 'react';
import Joyride, { ACTIONS, CallBackProps, EVENTS, STATUS } from 'react-joyride';
import { useLocalStorage, useReadLocalStorage } from 'usehooks-ts';
import {
    useActiveWalletAccount,
    useAuthorize,
    useCtraderAccountsList,
    useDxtradeAccountsList,
    useSortedMT5Accounts,
    useWalletAccountsList,
} from '@deriv/api-v2';
import useDevice from '../../hooks/useDevice';
import useWalletAccountSwitcher from '../../hooks/useWalletAccountSwitcher';
import { desktopStepTourGuide } from './DesktopSteps';
import {
    getFiatWalletLoginId,
    TooltipComponent,
    walletsOnboardingLocalStorageKey as key,
    walletsOnboardingStartValue as START_VALUE,
} from './WalletTourGuideSettings';
import './WalletTourGuide.scss';

const WalletTourGuide = () => {
    const [walletsOnboarding, setWalletsOnboarding] = useLocalStorage(key, useReadLocalStorage(key) ?? '');
    const { isMobile } = useDevice();

    // just because someone clicked button in dtrader and set local storage
    // does not mean we should run the tour as we might need to wait for the account to be switched
    const [run, setRun] = useState(false);
    const [joyrideIndex, setJoyrideIndex] = useState(0);

    const switchWalletAccount = useWalletAccountSwitcher();
    const { isFetching, isLoading, isSuccess } = useAuthorize();
    const { data: wallets } = useWalletAccountsList();
    const { data: activeWallet } = useActiveWalletAccount();

    const { isLoading: ctraderIsLoading } = useCtraderAccountsList();
    const { isLoading: dxtradeIsLoading } = useDxtradeAccountsList();
    const { isLoading: sorteAccountsListLoading } = useSortedMT5Accounts();

    const fiatWalletLoginId = getFiatWalletLoginId(wallets);
    const activeWalletLoginId = activeWallet?.loginid;

    const handleNextAction = (index: number) => {
        setJoyrideIndex(index + 1);
    };

    const handlePrevAction = (index: number) => {
        if (desktopStepTourGuide.length === joyrideIndex + 1) {
            setJoyrideIndex(0);
        } else {
            setJoyrideIndex(index - 1);
        }
    };

    useEffect(() => {
        const needToStart = walletsOnboarding === START_VALUE;
        if (needToStart) {
            const isAnythingLoading =
                dxtradeIsLoading ||
                ctraderIsLoading ||
                isFetching ||
                !isSuccess ||
                isLoading ||
                sorteAccountsListLoading;
            if (fiatWalletLoginId && fiatWalletLoginId !== activeWalletLoginId) {
                switchWalletAccount(fiatWalletLoginId);
            } else if (needToStart && !isAnythingLoading) {
                setRun(true);
                setWalletsOnboarding('');
            }
        }
    }, [
        activeWalletLoginId,
        fiatWalletLoginId,
        switchWalletAccount,
        walletsOnboarding,
        isLoading,
        isFetching,
        isSuccess,
        dxtradeIsLoading,
        ctraderIsLoading,
        sorteAccountsListLoading,
        setWalletsOnboarding,
    ]);

    const callbackHandle = (data: CallBackProps) => {
        const { action, index, status, type } = data;
        const finishedStatuses: string[] = [STATUS.FINISHED];
        const skipTypes: string[] = [EVENTS.STEP_AFTER, EVENTS.TARGET_NOT_FOUND];

        if (finishedStatuses.includes(status)) {
            setRun(false);
            setJoyrideIndex(0);
            return;
        }

        if (!skipTypes.includes(type)) {
            return;
        }

        if (action === ACTIONS.NEXT) {
            handleNextAction(index);
        } else if (action === ACTIONS.PREV) {
            handlePrevAction(index);
        }
    };

    if (isMobile) return null;

    return (
        <Joyride
            callback={callbackHandle}
            continuous
            disableCloseOnEsc
            disableOverlayClose
            floaterProps={{ disableAnimation: true }}
            run={run}
            scrollOffset={100}
            stepIndex={joyrideIndex}
            steps={desktopStepTourGuide}
            tooltipComponent={TooltipComponent}
        />
    );
};

export default WalletTourGuide;
