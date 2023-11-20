import Joyride from 'react-joyride';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { Localize, localize } from '@deriv/translations';
import {
    tour_step_config,
    tour_styles,
    getTourStepLocale,
    tour_styles_dark_mode,
    tour_step_config_high_risk,
} from 'Constants/tour-steps-config';
import { useStores } from 'Stores/index';
import { routes, ContentFlag } from '@deriv/shared';
import { SpanButton } from '@deriv/components';
import { useTradersHubTracking } from 'Hooks/index';

const TourGuide = () => {
    const { traders_hub, ui, client } = useStores();
    const {
        is_tour_open,
        toggleIsTourOpen,
        setIsOnboardingVisited,
        content_flag,
        is_onboarding_visited,
        selectAccountType,
        setIsFirstTimeVisit,
    } = traders_hub;
    const { is_dark_mode_on } = ui;
    const { prev_account_type } = client;

    const history = useHistory();
    const [joyride_index, setJoyrideIndex] = React.useState<number>(0);
    const tour_step_locale = getTourStepLocale();
    const high_risk_tour_step_locale = getTourStepLocale();

    const { trackLastStep, trackStepForward, trackOnboardingRestart } = useTradersHubTracking();

    tour_step_locale.last = (
        <div
            onClick={() => {
                trackLastStep();
                setIsOnboardingVisited(true);
                toggleIsTourOpen(false);
                selectAccountType(prev_account_type);
            }}
        >
            <Localize i18n_default_text='OK' />
        </div>
    );

    high_risk_tour_step_locale.last = (
        <div
            onClick={() => {
                trackLastStep();
                setIsOnboardingVisited(true);
                toggleIsTourOpen(false);
            }}
        >
            <Localize i18n_default_text='OK' />
        </div>
    );

    if (joyride_index === 0) {
        tour_step_locale.next = (
            <div
                onClick={() => {
                    trackStepForward(7);
                }}
            >
                <Localize i18n_default_text='Next' />
            </div>
        );

        high_risk_tour_step_locale.next = (
            <div
                onClick={() => {
                    trackStepForward(7);
                }}
            >
                <Localize i18n_default_text='Next' />
            </div>
        );
    }

    if (tour_step_config.length === joyride_index + 1) {
        tour_step_locale.back = (
            <SpanButton
                has_effect
                text={localize('Repeat tour')}
                secondary
                medium
                onClick={() => {
                    trackOnboardingRestart();
                    setIsFirstTimeVisit(false);
                    history.push(routes.onboarding);
                    toggleIsTourOpen(true);
                }}
            />
        );
    }

    high_risk_tour_step_locale.back = (
        <SpanButton
            has_effect
            text={localize('Repeat tour')}
            secondary
            medium
            onClick={() => {
                trackOnboardingRestart();
                setIsFirstTimeVisit(false);
                history.push(routes.onboarding);
                toggleIsTourOpen(true);
            }}
        />
    );

    const low_risk = content_flag === ContentFlag.LOW_RISK_CR_NON_EU || content_flag === ContentFlag.LOW_RISK_CR_EU;

    return (
        <Joyride
            run={!is_onboarding_visited && is_tour_open}
            continuous
            disableScrolling
            hideCloseButton
            disableCloseOnEsc
            steps={low_risk ? tour_step_config : tour_step_config_high_risk}
            styles={is_dark_mode_on ? tour_styles_dark_mode : tour_styles}
            locale={low_risk ? tour_step_locale : high_risk_tour_step_locale}
            floaterProps={{
                disableAnimation: true,
            }}
            callback={data => setJoyrideIndex(data.index)}
        />
    );
};

export default observer(TourGuide);
