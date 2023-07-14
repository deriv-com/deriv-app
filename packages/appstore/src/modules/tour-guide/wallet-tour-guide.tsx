import React from 'react';
import Joyride, { ACTIONS, EVENTS, STATUS } from 'react-joyride';
import { getWalletStepConfig, getWalletStepLocale, wallet_tour_styles } from 'Constants/tour-steps-config';
import { useStore, observer } from '@deriv/stores';

const WalletTourGuide = observer(() => {
    const { traders_hub } = useStore();
    const { is_wallet_tour_open, toggleIsWalletTourOpen } = traders_hub;

    const [joyride_index, setJoyrideIndex] = React.useState(0);

    const wallet_tour_step_locale = getWalletStepLocale();

    const handleJoyrideCallback: React.ComponentProps<typeof Joyride>['callback'] = data => {
        const { action, index, status, type } = data;

        if (
            ([STATUS.FINISHED, STATUS.SKIPPED] as string[]).includes(status) ||
            ([ACTIONS.CLOSE] as string[]).includes(action)
        ) {
            // closes tour guide when the us`er clicks on the close button or at the end of the tour
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
            scrollOffset={200}
            scrollToFirstStep
            stepIndex={joyride_index}
            steps={getWalletStepConfig()}
            styles={wallet_tour_styles}
        />
    );
});

export default WalletTourGuide;
