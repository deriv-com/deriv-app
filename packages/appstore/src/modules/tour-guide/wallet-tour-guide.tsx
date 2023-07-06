import React from 'react';
import Joyride, { StoreState } from 'react-joyride';
import { Localize } from '@deriv/translations';
import { getWalletStepConfig, getWalletStepLocale, wallet_tour_styles } from 'Constants/wallets-tour-steps-config';
import { useStore, observer } from '@deriv/stores';

const WalletTourGuide = observer(() => {
    const { traders_hub, ui } = useStore();
    const { is_wallet_switching } = ui;
    const { is_wallet_tour_open, toggleIsWalletTourOpen } = traders_hub;

    const wallet_tour_step_locale = getWalletStepLocale();

    const handleJoyrideCallback = (data: StoreState) => {
        const { action } = data;
        if (action === 'skip') toggleIsWalletTourOpen(false);
    };

    // this will be replaced later with Done once pt.2 is started
    wallet_tour_step_locale.last = (
        <div onClick={() => toggleIsWalletTourOpen(false)}>
            <Localize i18n_default_text='Next' />
        </div>
    );

    return (
        <Joyride
            run={is_wallet_tour_open && !is_wallet_switching}
            continuous
            hideCloseButton
            showSkipButton
            scrollToFirstStep
            steps={getWalletStepConfig()}
            styles={wallet_tour_styles}
            locale={wallet_tour_step_locale}
            floaterProps={{ disableAnimation: true }}
            callback={handleJoyrideCallback}
        />
    );
});

export default WalletTourGuide;
