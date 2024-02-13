import Joyride from 'react-joyride';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { Localize, localize } from '@deriv/translations';
import {
    tour_step_config,
    tour_styles,
    getTourStepLocale,
    tour_styles_dark_mode,
    tour_step_config_high_risk,
} from 'Constants/tour-steps-config';
import { useStores } from 'Stores/index';
import { ContentFlag } from '@deriv/shared';
import { SpanButton } from '@deriv/components';
import { useTradersHubTracking } from 'Hooks/index';

const TourGuide = () => {
    const { traders_hub, ui, client } = useStores();
    const { is_tour_open, toggleIsTourOpen, content_flag, selectAccountType, setIsFirstTimeVisit } = traders_hub;
    const { is_dark_mode_on, should_trigger_tour_guide, setShouldTriggerTourGuide } = ui;
    const { prev_account_type } = client;

    const [joyride_index, setJoyrideIndex] = React.useState<number>(0);
    const tour_step_locale = getTourStepLocale();
    const high_risk_tour_step_locale = getTourStepLocale();
    const { trackLastStep, trackStepForward, trackOnboardingRestart } = useTradersHubTracking();

    tour_step_locale.last = (
        <div
            style={{ padding: '0.9rem' }}
            onClick={() => {
                trackLastStep();
                toggleIsTourOpen(false);
                selectAccountType(prev_account_type);
                if (should_trigger_tour_guide) {
                    setShouldTriggerTourGuide(false);
                }
            }}
        >
            <Localize i18n_default_text='OK' />
        </div>
    );

    high_risk_tour_step_locale.last = (
        <div
            style={{ padding: '0.9rem' }}
            onClick={() => {
                trackLastStep();
                toggleIsTourOpen(false);
                if (should_trigger_tour_guide) {
                    setShouldTriggerTourGuide(false);
                }
            }}
        >
            <Localize i18n_default_text='OK' />
        </div>
    );

    tour_step_locale.next = (
        <div
            style={{ padding: '0.9rem' }}
            onClick={() => {
                if (joyride_index === 0) trackStepForward(7);
            }}
        >
            <Localize i18n_default_text='Next' />
        </div>
    );

    high_risk_tour_step_locale.next = (
        <div
            style={{ padding: '0.9rem' }}
            onClick={() => {
                if (joyride_index === 0) trackStepForward(7);
            }}
        >
            <Localize i18n_default_text='Next' />
        </div>
    );

    if (tour_step_config.length === joyride_index + 1) {
        tour_step_locale.back = (
            <SpanButton
                style={{ padding: '0.9rem' }}
                has_effect
                text={localize('Repeat tour')}
                secondary
                medium
                onClick={() => {
                    trackOnboardingRestart();
                    setIsFirstTimeVisit(false);
                    toggleIsTourOpen(true);
                }}
            />
        );
    }

    high_risk_tour_step_locale.back = (
        <SpanButton
            style={{ padding: '0.9rem' }}
            has_effect
            text={localize('Repeat tour')}
            secondary
            medium
            onClick={() => {
                trackOnboardingRestart();
                setIsFirstTimeVisit(false);
                toggleIsTourOpen(true);
            }}
        />
    );

    const low_risk = content_flag === ContentFlag.LOW_RISK_CR_NON_EU || content_flag === ContentFlag.LOW_RISK_CR_EU;

    if (!is_tour_open && !should_trigger_tour_guide) return null;
    return (
        <Joyride
            run={true}
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
            callback={data => {
                setJoyrideIndex(data.index);
                if (data.action === 'prev' && data.index === tour_step_config_high_risk.length) {
                    toggleIsTourOpen(false);
                    setTimeout(() => {
                        toggleIsTourOpen(true);
                    }, 0);
                }
            }}
        />
    );
};

export default observer(TourGuide);
