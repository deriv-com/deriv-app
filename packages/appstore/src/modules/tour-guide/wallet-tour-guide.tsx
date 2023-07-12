import React from 'react';
import Joyride, { EVENTS, StoreState } from 'react-joyride';
import { useStore, observer } from '@deriv/stores';
import { getWalletStepConfig, getWalletStepLocale, wallet_tour_styles } from 'Constants/tour-steps-config';

const WalletTourGuide = observer(() => {
    const { traders_hub } = useStore();
    const { is_wallet_tour_open, toggleIsWalletTourOpen } = traders_hub;
    const [scroll_offset, setScrollOffset] = React.useState<number>(200);

    const wallet_tour_step_locale = getWalletStepLocale();

    const handleJoyrideCallback = (data: StoreState) => {
        const { index, type } = data;

        // adding scroll offset for certain steps to make it more visible
        if (index === 5) {
            setScrollOffset(80);
        } else {
            setScrollOffset(200);
        }

        if ([EVENTS.TOUR_END || EVENTS.TOOLTIP_CLOSE].includes(type)) {
            toggleIsWalletTourOpen(false);
        }
    };

    return (
        <Joyride
            callback={handleJoyrideCallback}
            continuous
            disableCloseOnEsc
            floaterProps={{ disableAnimation: true }}
            hideCloseButton
            locale={wallet_tour_step_locale}
            run={is_wallet_tour_open}
            scrollOffset={scroll_offset}
            scrollToFirstStep
            showSkipButton
            steps={getWalletStepConfig()}
            styles={wallet_tour_styles}
        />
    );
});

export default WalletTourGuide;
