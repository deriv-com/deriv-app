import React from 'react';
import Joyride, { ACTIONS, EVENTS, STATUS } from 'react-joyride';
import { getWalletStepConfig, getWalletStepLocale, wallet_tour_styles } from 'Constants/tour-steps-config';
import { useAvailableWallets } from '@deriv/hooks';
import { useStore, observer } from '@deriv/stores';

const WalletTourGuide = observer(() => {
    const { modules, traders_hub } = useStore();
    const { is_wallet_tour_open, toggleIsWalletTourOpen } = traders_hub;
    const { current_list } = modules.cfd;

    const [joyride_index, setJoyrideIndex] = React.useState(0);

    const wallet_tour_step_locale = getWalletStepLocale();

    const { data: sorted_wallets } = useAvailableWallets();

    // if the user has an mt5 account, show a different message for the cfd step
    const has_mt5_account = Object.keys(current_list)
        .map(key => current_list[key])
        .some(account => account.landing_company_short === 'svg' && account.market_type === 'synthetic');

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

    return (
        <Joyride
            callback={handleJoyrideCallback}
            continuous
            disableCloseOnEsc
            disableOverlayClose
            floaterProps={{ disableAnimation: true }}
            locale={wallet_tour_step_locale}
            run={is_wallet_tour_open}
            scrollOffset={200} // TODO: add a function to calculate the scroll offset depending on the steps but for now this works
            scrollToFirstStep
            stepIndex={joyride_index}
            steps={getWalletStepConfig(has_mt5_account, is_all_wallets_added)}
            styles={wallet_tour_styles}
        />
    );
});

export default WalletTourGuide;
