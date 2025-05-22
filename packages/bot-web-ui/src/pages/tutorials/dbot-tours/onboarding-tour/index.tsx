import React from 'react';
import { observer } from 'mobx-react-lite';
import OnboardingTourDesktop from './onboarding-tour-desktop';
import OnboardingTourMobile from './onboarding-tour-mobile';

type TOnboardTourHandler = {
    is_mobile: boolean;
};

const OnboardTourHandler: React.FC<TOnboardTourHandler> = observer(({ is_mobile }) => {
    return <>{is_mobile ? <OnboardingTourMobile /> : <OnboardingTourDesktop />}</>;
});

export default OnboardTourHandler;
