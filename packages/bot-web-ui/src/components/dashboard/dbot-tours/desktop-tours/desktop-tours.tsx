import React from 'react';
import { observer } from '@deriv/stores';
import { useDBotStore } from 'Stores/useDBotStore';
import BotBuilderTour from './bot-builder-tour';
import OnboardingTour from './onboarding-tour';

const DesktopTours = observer(() => {
    const { dashboard } = useDBotStore();
    const { has_started_onboarding_tour } = dashboard;
    return <>{has_started_onboarding_tour ? <OnboardingTour /> : <BotBuilderTour />}</>;
});

export default DesktopTours;
