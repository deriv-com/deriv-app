import React, { useEffect, useState } from 'react';
import Joyride, { CallBackProps, STATUS } from 'react-joyride';
import {
    useAllWalletAccounts,
    useAuthorize,
    useCtraderAccountsList,
    useDxtradeAccountsList,
    useSortedMT5Accounts,
} from '@deriv/api-v2';
import { useDevice } from '@deriv-com/ui';
import useIsRtl from '../../hooks/useIsRtl';
import useWalletAccountSwitcher from '../../hooks/useWalletAccountSwitcher';
import { TooltipComponent } from './WalletTourGuideSettings';
import { desktopStepTourGuide, mobileStepTourGuide } from './WalletTourGuideSteps';

type TProps = {
    onWalletsOnboardingTourGuideCloseHandler: VoidFunction;
};

const WalletTourGuide: React.FC<TProps> = ({ onWalletsOnboardingTourGuideCloseHandler }) => {
    const [run, setRun] = useState(false);
    const { isDesktop } = useDevice();
    const isRtl = useIsRtl();

    const switchWalletAccount = useWalletAccountSwitcher();
    const { isFetching, isLoading, isSuccess } = useAuthorize();
    const { isFetching: ctraderIsLoading } = useCtraderAccountsList();
    const { isFetching: dxtradeIsLoading } = useDxtradeAccountsList();
    const { isFetching: sortedAccountsIsLoading } = useSortedMT5Accounts();
    const { data: availableWallets } = useAllWalletAccounts();

    const isEverythingLoaded =
        !isLoading && !isFetching && isSuccess && !ctraderIsLoading && !dxtradeIsLoading && !sortedAccountsIsLoading;
    const allWalletsAreAdded = Boolean(availableWallets?.every(wallet => wallet.is_added));

    useEffect(() => {
        if (isEverythingLoaded) {
            setRun(true);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [run, setRun, isEverythingLoaded, switchWalletAccount]);

    const callbackHandle = async (data: CallBackProps) => {
        const { status } = data;
        const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];
        if (finishedStatuses.includes(status)) {
            setRun(false);
            onWalletsOnboardingTourGuideCloseHandler();
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
            scrollOffset={isDesktop ? 80 : 100}
            steps={
                isDesktop ? desktopStepTourGuide(allWalletsAreAdded, isRtl) : mobileStepTourGuide(allWalletsAreAdded)
            }
            tooltipComponent={TooltipComponent}
        />
    );
};

export default WalletTourGuide;
