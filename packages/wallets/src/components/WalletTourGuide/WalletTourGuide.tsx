import React, { useEffect, useRef, useState } from 'react';
import { useLocalStorage, useReadLocalStorage } from 'usehooks-ts';
import { useActiveWalletAccount, useAllWalletAccounts, useAuthorize, useWalletAccountsList } from '@deriv/api';
import Joyride, { ACTIONS, CallBackProps } from '@deriv/react-joyride';
import { PlatformDetails } from '../../features/cfd/constants';
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
    const [addMoreWalletsTransformValue, setAddMoreWalletsTransformValue] = useState('');
    const { isMobile } = useDevice();

    const { isFetching, isLoading, isSuccess, switchAccount } = useAuthorize();
    const { data: wallets } = useWalletAccountsList();
    const { data: activeWallet } = useActiveWalletAccount();
    const { data: availableWallets } = useAllWalletAccounts();

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
            if (!isAllWalletsAlreadyAdded && addMoreWalletRef.current) {
                addMoreWalletRef.current.style.transform = addMoreWalletsTransformValue;
            }
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
