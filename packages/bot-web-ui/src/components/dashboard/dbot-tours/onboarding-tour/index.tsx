import React from 'react';
import { observer } from 'mobx-react';
import { isMobile } from '@deriv/shared';
import OnboardingTourDesktop from './onboarding-tour-desktop';
import OnboardingTourMobile from './onboarding-tour-mobile';

const is_mobile = isMobile();
const OnboardTourHandler = observer(() => {
    return <>{is_mobile ? <OnboardingTourMobile /> : <OnboardingTourDesktop />}</>;
});

export default OnboardTourHandler;
