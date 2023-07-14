import React from 'react';
import { getWalletStepConfig, getWalletStepLocale, wallet_tour_styles } from 'Constants/tour-steps-config';
import { useAvailableWallets } from '@deriv/hooks';
import { useStore, observer } from '@deriv/stores';
import Joyride, { ACTIONS, EVENTS, STATUS, StoreState } from 'react-joyride';

type TJoyrideState = {
    run: boolean | ((value: boolean) => boolean);
    step_index: number;
    scroll_offset: number;
};

const WalletTourGuide = observer(() => {
    const { traders_hub } = useStore();
    const { is_wallet_tour_open, toggleIsWalletTourOpen } = traders_hub;

    const [joyride_state, setJoyrideState] = React.useState<TJoyrideState>({
        run: is_wallet_tour_open,
        step_index: 0,
        scroll_offset: 100,
    });

    const { data: sorted_wallets } = useAvailableWallets();

    const is_all_wallets_added = React.useMemo(() => {
        if (sorted_wallets) {
            return sorted_wallets.every(wallet => wallet.is_added);
        }
        return false;
    }, [sorted_wallets]);

    const wallet_tour_step_locale = getWalletStepLocale();

    const handleJoyrideCallback = (data: StoreState) => {
        const { action, index, status, type } = data;

        // closes tour guide when the user clicks on the close button or at the end of the tour
        if (
            ([STATUS.FINISHED, STATUS.SKIPPED] as string[]).includes(status) ||
            ([ACTIONS.CLOSE] as string[]).includes(action)
        ) {
            setJoyrideState({ run: toggleIsWalletTourOpen(false), step_index: 0, scroll_offset: 200 });
        } else if (([EVENTS.STEP_AFTER, EVENTS.TARGET_NOT_FOUND] as string[]).includes(type)) {
            const next_step = index + (action === ACTIONS.PREV ? -1 : 1);
            // scroll page based on the index
            if (index === 4) {
                setJoyrideState(prev_state => ({ ...prev_state, step_index: next_step, scroll_offset: 50 }));
            } else {
                setJoyrideState(prev_state => ({ ...prev_state, step_index: next_step, scroll_offset: 200 }));
            }
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
            scrollOffset={joyride_state.scroll_offset}
            scrollToFirstStep
            stepIndex={joyride_state.step_index}
            steps={getWalletStepConfig(is_all_wallets_added)}
            styles={wallet_tour_styles}
        />
    );
});

export default WalletTourGuide;
