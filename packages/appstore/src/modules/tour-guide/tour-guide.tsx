import Joyride from 'react-joyride';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { Localize, localize } from '@deriv/translations';
import {
    getTourStepConfig,
    tour_styles,
    getTourStepLocale,
    tour_styles_dark_mode,
    getTourStepConfigHighRisk,
    getHighRiskTourStepLocale,
} from 'Constants/tour-steps-config-new';
import { useStores } from 'Stores/index';
import { routes, ContentFlag } from '@deriv/shared';
import { SpanButton } from '@deriv/components';

const TourGuide = () => {
    const { traders_hub, ui, client } = useStores();
    const {
        is_tour_open,
        toggleIsTourOpen,
        setIsOnboardingVisited,
        content_flag,
        is_onboarding_visited,
        selectAccountType,
    } = traders_hub;
    const { is_dark_mode_on } = ui;
    const { prev_account_type } = client;

    const history = useHistory();
    const [joyride_index, setJoyrideIndex] = React.useState<number>(0);
    const tour_step_locale = getTourStepLocale();
    const high_risk_tour_step_locale = getHighRiskTourStepLocale();

    tour_step_locale.last = (
        <div
            onClick={() => {
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
                setIsOnboardingVisited(true);
                toggleIsTourOpen(false);
            }}
        >
            <Localize i18n_default_text='OK' />
        </div>
    );

    if (joyride_index === 0) {
        tour_step_locale.next = (
            <div>
                <Localize i18n_default_text='Next' />
            </div>
        );

        high_risk_tour_step_locale.next = (
            <div>
                <Localize i18n_default_text='Next' />
            </div>
        );
    }

    if (getTourStepConfig().length === joyride_index + 1) {
        tour_step_locale.back = (
            <SpanButton
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

    high_risk_tour_step_locale.back = (
        <SpanButton
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

    const low_risk = content_flag === ContentFlag.LOW_RISK_CR_NON_EU || content_flag === ContentFlag.LOW_RISK_CR_EU;

    return (
        <Joyride
            run={!is_onboarding_visited && is_tour_open}
            continuous
            disableScrolling
            hideCloseButton
            disableCloseOnEsc
            steps={low_risk ? getTourStepConfig() : getTourStepConfigHighRisk()}
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
