import React from 'react';
import { observer } from '@deriv/stores';
import { DBOT_ONBOARDING } from '../config';
import ReactJoyrideWrapper from './common/react-joyride-wrapper';

const OnboardingTour = observer(() => {
    return <ReactJoyrideWrapper steps={DBOT_ONBOARDING} spotlightClicks hideCloseButton />;
});

export default OnboardingTour;
