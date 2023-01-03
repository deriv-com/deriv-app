import Joyride from 'react-joyride';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { Localize, localize } from '@deriv/translations';
import {
    tour_step_config,
    tour_styles,
    tour_step_locale,
    tour_styles_dark_mode,
} from 'Constants/tour-steps-config-new';
import { useStores } from 'Stores/index';
import { routes } from '@deriv/shared';
import { Button } from '@deriv/components';

const TourGuide = () => {
    const { traders_hub, ui } = useStores();
    const { is_tour_open, toggleIsTourOpen, setIsOnboardingVisited } = traders_hub;
    const { is_dark_mode_on } = ui;

    const history = useHistory();
    const [joyride_index, setJoyrideIndex] = React.useState<number>(0);
    tour_step_locale.last = (
        <div
            onClick={() => {
                setIsOnboardingVisited(true);
                toggleIsTourOpen(false);
            }}
        >
            <Localize i18n_default_text='OK' />
        </div>
    );

    if (tour_step_config.length === joyride_index + 1) {
        tour_step_locale.back = (
            <Button
                has_effect
                text={localize('Repeat tour')}
                secondary
                medium
                onClick={() => {
                    history.push(routes.onboarding);
                    toggleIsTourOpen(true);
                }}
            />
        );
    }

    return (
        <Joyride
            run={is_tour_open}
            continuous
            disableScrolling
            hideCloseButton
            disableCloseOnEsc
            steps={tour_step_config}
            styles={is_dark_mode_on ? tour_styles_dark_mode : tour_styles}
            locale={tour_step_locale}
            floaterProps={{
                disableAnimation: true,
            }}
            callback={data => setJoyrideIndex(data.index)}
        />
    );
};

export default observer(TourGuide);
