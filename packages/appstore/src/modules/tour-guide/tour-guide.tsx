import React from 'react';
import Joyride, { CallBackProps, STATUS, EVENTS, ACTIONS } from 'react-joyride';
import { observer } from 'mobx-react-lite';
import {
    tour_step_config,
    getTourStepLocale,
    tour_step_config_high_risk,
    getHighRiskTourStepLocale,
} from 'Constants/tour-steps-config';
import { tour_styles, tour_styles_dark_mode } from 'Constants/tour-steps-styles';
import { useStores } from 'Stores/index';
import { ContentFlag } from '@deriv/shared';
import { useTradersHubTracking } from 'Hooks/index';
import { localize } from '@deriv/translations';
import { SpanButton } from '@deriv/components';

const TourGuide = () => {
    const { traders_hub, ui } = useStores();
    const { is_tour_open, toggleIsTourOpen, content_flag, setIsFirstTimeVisit } = traders_hub;
    const { is_dark_mode_on, should_trigger_tour_guide, setShouldTriggerTourGuide } = ui;

    const [joyride_index, setJoyrideIndex] = React.useState(0);
    const tour_step_locale = getTourStepLocale();
    const high_risk_tour_step_locale = getHighRiskTourStepLocale();
    const low_risk = content_flag === ContentFlag.LOW_RISK_CR_NON_EU || content_flag === ContentFlag.LOW_RISK_CR_EU;

    const { trackLastStep, trackStepForward, trackOnboardingRestart } = useTradersHubTracking();

    const handleNextAction = (index: number) => {
        trackStepForward(7);
        setJoyrideIndex(index + 1);
    };

    const handlePrevAction = (index: number) => {
        if (tour_step_config.length === joyride_index + 1) {
            trackLastStep();
            trackOnboardingRestart();
            setIsFirstTimeVisit(false);
            setJoyrideIndex(0);
        } else {
            setJoyrideIndex(index - 1);
        }
    };

    const callbackHandle = (data: CallBackProps) => {
        const { action, index, type, status } = data;
        const finishedStatuses: string[] = [STATUS.FINISHED];
        const skipTypes: string[] = [EVENTS.STEP_AFTER, EVENTS.TARGET_NOT_FOUND];

        if (finishedStatuses.includes(status)) {
            toggleIsTourOpen(false);
            setShouldTriggerTourGuide(false);
            setJoyrideIndex(0);
            return;
        }

        if (!skipTypes.includes(type)) {
            return;
        }

        if (action === ACTIONS.NEXT) {
            handleNextAction(index);
        } else if (action === ACTIONS.PREV) {
            handlePrevAction(index);
        }
    };

    if (tour_step_config.length === joyride_index + 1) {
        tour_step_locale.back = <SpanButton has_effect text={localize('Repeat tour')} secondary medium />;
    }

    return (
        <Joyride
            run={is_tour_open || should_trigger_tour_guide}
            continuous
            disableScrolling
            hideCloseButton
            disableCloseOnEsc
            steps={low_risk ? tour_step_config : tour_step_config_high_risk}
            stepIndex={joyride_index}
            locale={low_risk ? tour_step_locale : high_risk_tour_step_locale}
            styles={is_dark_mode_on ? tour_styles_dark_mode : tour_styles}
            floaterProps={{ disableAnimation: true }}
            callback={callbackHandle}
        />
    );
};
export default observer(TourGuide);
