import React, { useEffect, useRef, useState } from 'react';
import { useLocalStorage, useReadLocalStorage } from 'usehooks-ts';
import {
    useActiveWalletAccount,
    useAllWalletAccounts,
    useAuthorize,
    useWalletAccountsList,
    useCtraderAccountsList,
    useDxtradeAccountsList,
    useSortedMT5Accounts,
} from '@deriv/api-v2';
import Joyride, { ACTIONS, CallBackProps } from '@deriv/react-joyride';
import { PlatformDetails } from '../../features/cfd/constants';
import useDevice from '../../hooks/useDevice';
import useWalletAccountSwitcher from '../../hooks/useWalletAccountSwitcher';
import {
    getFiatWalletLoginId,
    getWalletIndexForTarget,
    TooltipComponent,
    tourStepConfig,
    walletsOnboardingLocalStorageKey as key,
    walletsOnboardingStartValue as START_VALUE,
} from './WalletTourGuideSettings';
import './WalletTourGuide.scss';

const WalletTourGuide = () => {
    const [walletsOnboarding, setWalletsOnboarding] = useLocalStorage(key, useReadLocalStorage(key) ?? '');
    const [addMoreWalletsTransformValue, setAddMoreWalletsTransformValue] = useState('');
    const { isMobile } = useDevice();

    // just because someone clicked button in dtrader and set local storage
    // does not mean we should run the tour as we might need to wait for the account to be switched
    const [run, setRun] = useState<boolean>(false);

    const switchWalletAccount = useWalletAccountSwitcher();
    const { isFetching, isLoading, isSuccess } = useAuthorize();
    const { data: wallets } = useWalletAccountsList();
    const { data: activeWallet } = useActiveWalletAccount();
    const { data: availableWallets } = useAllWalletAccounts();

    const { isLoading: ctraderIsLoading } = useCtraderAccountsList();
    const { isLoading: dxtradeIsLoading } = useDxtradeAccountsList();
    const { isLoading: sorteAccountsListLoading } = useSortedMT5Accounts();

    const addMoreWalletRef = useRef<HTMLElement | null>(document.getElementById('wallets_add_more_carousel_wrapper'));

    const fiatWalletLoginId = getFiatWalletLoginId(wallets);
    const walletIndex = getWalletIndexForTarget(fiatWalletLoginId, wallets);
    const activeWalletLoginId = activeWallet?.loginid;

    const isDemoWallet = Boolean(activeWallet?.is_virtual);
    const hasMT5Account = Boolean(
        activeWallet?.linked_to?.some(account => account.platform === PlatformDetails.mt5.platform)
    );
    const hasDerivAppsTradingAccount = Boolean(activeWallet?.dtrade_loginid);
    const isAllWalletsAlreadyAdded = Boolean(availableWallets?.every(wallet => wallet.is_added));

    const callbackHandle = (data: CallBackProps) => {
        const { action, index, lifecycle } = data;

        if (index === 0 && !isAllWalletsAlreadyAdded) {
            if (addMoreWalletRef.current && lifecycle === 'init' && action === 'start') {
                setAddMoreWalletsTransformValue(addMoreWalletRef.current.style.transform);
                addMoreWalletRef.current.style.transform = 'translate3d(0px, 0px, 0px)';
            }
        }

        if (action === ACTIONS.RESET) {
            setWalletsOnboarding('');
            setRun(false);
            if (!isAllWalletsAlreadyAdded && addMoreWalletRef.current) {
                addMoreWalletRef.current.style.transform = addMoreWalletsTransformValue;
            }
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
    ]);

    useEffect(() => {
        if (!addMoreWalletRef.current) {
            addMoreWalletRef.current = document.getElementById('wallets_add_more_carousel_wrapper');
        }
    }, []);

    if (isMobile) return null;

    return (
        <Joyride
            callback={callbackHandle}
            continuous
            disableCloseOnEsc
            disableOverlayClose
            floaterProps={{ disableAnimation: true }}
            run={run}
            scrollDuration={0}
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
