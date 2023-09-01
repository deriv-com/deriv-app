import React from 'react';
import { useDBotStore } from 'Stores/useDBotStore';
import BotBuilderTour from './bot-builder-tour';
import OnboardingTour from './onboarding-tour';

const MobileTours = () => {
    const { dashboard } = useDBotStore();
    const { has_started_onboarding_tour } = dashboard;
    return <>{has_started_onboarding_tour ? <OnboardingTour /> : <BotBuilderTour />}</>;
};

export default MobileTours;
