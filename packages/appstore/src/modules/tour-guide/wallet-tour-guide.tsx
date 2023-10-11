import React from 'react';
import Joyride, { ACTIONS, EVENTS, STATUS } from 'react-joyride';
import {
    getWalletStepConfig,
    getWalletStepLocale,
    wallet_tour_styles,
    getWalletStepConfigResponsive,
} from 'Constants/tour-steps-config';
import { useAvailableWallets, useCFDAccounts } from '@deriv/hooks';
import { useStore, observer } from '@deriv/stores';

const WalletTourGuide = observer(() => {
    const { traders_hub, ui } = useStore();
    const { is_wallet_tour_open, toggleIsWalletTourOpen } = traders_hub;
    const { is_mobile } = ui;

    const [joyride_index, setJoyrideIndex] = React.useState(0);

    const wallet_tour_step_locale = getWalletStepLocale();

    const { data: sorted_wallets } = useAvailableWallets();
    const { all: cfd_accounts } = useCFDAccounts();

    // if synthetic account exists, show a different message and vice versa
    const has_mt5_account = React.useMemo(() => {
        if (cfd_accounts) {
            return cfd_accounts.some(
                // TODO: remove landing company check in the future for MT5 once all the landing company is enabled
                account => account.market_type === 'synthetic' && account.landing_company_short === 'svg'
            );
        }
        return false;
    }, [cfd_accounts]);

    // if all wallets are added, skip add wallet step
    const is_all_wallets_added = React.useMemo(() => {
        if (sorted_wallets) {
            return sorted_wallets.every(wallet => wallet.is_added);
        }
        return false;
    }, [sorted_wallets]);

    const handleJoyrideCallback: React.ComponentProps<typeof Joyride>['callback'] = data => {
        const { action, index, status, type } = data;

        if (
            ([STATUS.FINISHED, STATUS.SKIPPED] as string[]).includes(status) ||
            ([ACTIONS.CLOSE] as string[]).includes(action)
        ) {
            // closes tour guide when the user clicks on the close button or at the end of the tour
            toggleIsWalletTourOpen(false);
            setJoyrideIndex(0);
        } else if (([EVENTS.STEP_AFTER, EVENTS.TARGET_NOT_FOUND] as string[]).includes(type)) {
            // advances the tour guide to the next step
            // TODO: add an if else statement for scroll offset depending on the steps
            const next_step = index + (action === ACTIONS.PREV ? -1 : 1);
            setJoyrideIndex(next_step);
        }
    };

    const steps = is_mobile
        ? getWalletStepConfigResponsive()
        : getWalletStepConfig(has_mt5_account, is_all_wallets_added);

    return (
        <Joyride
            callback={handleJoyrideCallback}
            continuous
            disableCloseOnEsc
            disableOverlayClose
            disableScrollParentFix
            floaterProps={{ disableAnimation: true }}
            locale={wallet_tour_step_locale}
            run={is_wallet_tour_open}
            scrollOffset={150}
            stepIndex={joyride_index}
            steps={steps}
            styles={wallet_tour_styles}
        />
    );
});

export default WalletTourGuide;
