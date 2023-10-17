import React from 'react';
import Joyride, { CallBackProps } from 'react-joyride';
import { useActiveWalletAccount } from '@deriv/api';
import { WalletText } from '../Base';
import { TooltipComponent, tourStepConfig } from './WalletTourGuideSettings';
import './WalletTourGuide.scss';

type TProps = {
    isStarted?: boolean;
    setIsStarted?: (value: boolean) => void;
};

const WalletTourGuide = ({ isStarted = false, setIsStarted }: TProps) => {
    const { data: activeWallet } = useActiveWalletAccount();
    // const { data: availableWallets } = useAvailableWallets();

    const callbackHandle = (data: CallBackProps) => {
        if (data.action === 'reset') {
            setIsStarted?.(false);
        }
    };

    if (!activeWallet) return <WalletText>...Loading</WalletText>;

    const isDemoWallet = activeWallet?.is_virtual;
    const hasMT5 = Boolean(activeWallet?.linked_to?.some(account => account.platform === 'mt5'));
    const hasDerivAppsTradingAccount = Boolean(activeWallet?.linked_to?.some(account => account.platform === 'dtrade'));
    const isAllWalletsAlreadyAdded = activeWallet?.is_virtual;

    return (
        <Joyride
            callback={callbackHandle}
            continuous
            disableCloseOnEsc
            disableScrolling
            floaterProps={{
                disableAnimation: true,
            }}
            run={isStarted}
            steps={tourStepConfig(isDemoWallet, hasMT5, hasDerivAppsTradingAccount, isAllWalletsAlreadyAdded)}
            tooltipComponent={TooltipComponent}
        />
    );
};

export default WalletTourGuide;
