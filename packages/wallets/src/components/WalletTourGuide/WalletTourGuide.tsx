import React, { useEffect, useState } from 'react';
import Joyride, { STATUS, CallBackProps } from '@deriv/react-joyride';
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
import {
    getFiatWalletLoginId,
    TooltipComponent,
    walletsOnboardingLocalStorageKey as key,
    walletsOnboardingStartValue as START_VALUE,
} from './WalletTourGuideSettings';
import { desktopStepTourGuide, mobileStepTourGuide } from './WalletTourGuideSteps';
import './WalletTourGuide.scss';

const WalletTourGuide = () => {
    const [walletsOnboarding, setWalletsOnboarding] = useLocalStorage(key, useReadLocalStorage(key) ?? '');
    const { isMobile } = useDevice();

    // just because someone clicked button in dtrader and set local storage
    // does not mean we should run the tour as we might need to wait for the account to be switched
    const [run, setRun] = useState(false);

    const switchWalletAccount = useWalletAccountSwitcher();
    const { isFetching, isLoading, isSuccess } = useAuthorize();
    const { data: wallets } = useWalletAccountsList();
    const { data: activeWallet } = useActiveWalletAccount();

    const { isFetching: ctraderIsLoading } = useCtraderAccountsList();
    const { isFetching: dxtradeIsLoading } = useDxtradeAccountsList();
    const { isFetching: sortedAccountsIsLoading } = useSortedMT5Accounts();

    const needToStart = walletsOnboarding === START_VALUE;
    const activeWalletLoginId = activeWallet?.loginid;
    const fiatWalletLoginId = getFiatWalletLoginId(wallets);
    const activeFiatWalletLoginId = fiatWalletLoginId == activeWalletLoginId;
    const isEverythingLoaded =
        !isLoading && !isFetching && isSuccess && !ctraderIsLoading && !dxtradeIsLoading && !sortedAccountsIsLoading;

    useEffect(() => {
        const switchAccountAndRun = async () => {
            if (needToStart) {
                if (fiatWalletLoginId && !activeFiatWalletLoginId) {
                    await switchWalletAccount(fiatWalletLoginId);
                }
                if (isEverythingLoaded && activeFiatWalletLoginId) {
                    setWalletsOnboarding('');
                    setRun(true);
                }
            }
        };

        switchAccountAndRun();
    }, [
        run,
        setRun,
        needToStart,
        fiatWalletLoginId,
        activeFiatWalletLoginId,
        isEverythingLoaded,
        switchWalletAccount,
        setWalletsOnboarding,
    ]);

    const callbackHandle = async (data: CallBackProps) => {
        const { status } = data;
        const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];
        if (finishedStatuses.includes(status)) {
            setRun(false);
        }
    };

    return (
        <Joyride
            callback={callbackHandle}
            continuous
            disableCloseOnEsc
            disableOverlayClose
            floaterProps={{ disableAnimation: true }}
            run={run}
            scrollOffset={100}
            steps={isMobile ? mobileStepTourGuide : desktopStepTourGuide}
            tooltipComponent={TooltipComponent}
        />
    );
};

export default WalletTourGuide;
