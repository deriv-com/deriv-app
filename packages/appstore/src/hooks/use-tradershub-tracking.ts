import { Analytics } from '@deriv-com/analytics';
import { useStore } from '@deriv/stores';
import { useCallback, useMemo } from 'react';

// This hook is used to track the onboarding form in TradersHub
export const useTradersHubTracking = () => {
    const { traders_hub } = useStore();

    const { is_first_time_visit } = traders_hub;

    const form_source = useMemo(
        () => (is_first_time_visit ? 'tradershub_first_entrance' : 'tradershub_dashboard_form'),
        [is_first_time_visit]
    );

    const event_name = 'ce_tradershub_onboarding_form';

    const trackDotNavigation = useCallback(
        (step: number) => {
            Analytics.trackEvent(event_name, {
                action: 'choose_step_navigation',
                form_source,
                step_num: step,
                step_codename: `${step}_step`,
            });
        },
        [form_source]
    );

    const trackLastStep = useCallback(() => {
        Analytics.trackEvent(event_name, {
            action: 'close',
            form_source,
            step_num: 7,
            step_codename: '7_step',
        });
    }, [form_source]);

    const trackStepBack = useCallback(
        (new_step: number) => {
            Analytics.trackEvent(event_name, {
                action: 'step_back',
                form_source,
                step_num: new_step,
                step_codename: `${new_step}_step`,
            });
        },
        [form_source]
    );

    const trackStepForward = useCallback(
        (new_step: number) => {
            Analytics.trackEvent(event_name, {
                action: 'step_passed',
                form_source,
                step_num: new_step,
                step_codename: `${new_step}_step`,
            });
        },
        [form_source]
    );

    const trackOnboardingClose = useCallback(
        (current_step: number) => {
            Analytics.trackEvent(event_name, {
                action: 'close',
                form_source,
                step_num: current_step,
                step_codename: `${current_step}_step`,
            });
        },
        [form_source]
    );

    const trackOnboardingRestart = useCallback(() => {
        Analytics.trackEvent(event_name, {
            action: 'open',
            form_source: 'repeat_tour',
            step_num: 7,
            step_codename: `7_step`,
        });
    }, []);

    const trackOnboardingOpen = useCallback(() => {
        Analytics.trackEvent(event_name, {
            action: 'open',
            form_source,
            step_num: 1,
            step_codename: '1_step',
        });
    }, [form_source]);

    return {
        trackDotNavigation,
        trackLastStep,
        trackStepBack,
        trackStepForward,
        trackOnboardingClose,
        trackOnboardingOpen,
        trackOnboardingRestart,
    };
};
