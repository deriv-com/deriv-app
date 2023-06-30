import React from 'react';
import Joyride from 'react-joyride';
import { Localize } from '@deriv/translations';
import { getWalletStepConfig, getWalletStepLocale, wallet_tour_styles } from 'Constants/wallets-tour-steps-config';
import { useStore, observer } from '@deriv/stores';

const WalletTourGuide = observer(() => {
    const { traders_hub } = useStore();
    const { is_wallet_tour_open, toggleIsWalletTourOpen } = traders_hub;

    const [joyride_index, setJoyrideIndex] = React.useState<number>(0);
    const wallet_tour_step_locale = getWalletStepLocale();

    wallet_tour_step_locale.last = (
        <div onClick={() => toggleIsWalletTourOpen()}>
            <Localize i18n_default_text='Done' />
        </div>
    );

    if (joyride_index === 0) {
        wallet_tour_step_locale.next = (
            <div>
                <Localize i18n_default_text='Next' />
            </div>
        );
    }

    return (
        <Joyride
            run={is_wallet_tour_open}
            continuous
            disableScrolling
            steps={getWalletStepConfig()}
            styles={wallet_tour_styles}
            locale={wallet_tour_step_locale}
            floaterProps={{
                disableAnimation: true,
            }}
            callback={data => setJoyrideIndex(data.index)}
        />
    );
});

export default WalletTourGuide;
