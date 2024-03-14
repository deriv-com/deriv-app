import React from 'react';
import { observer } from '@deriv/stores';
import { getSetting } from 'Utils/settings';
import { useDBotStore } from 'Stores/useDBotStore';
import ReactJoyrideWrapper from '../common/react-joyride-wrapper';
import TourStartDialog from '../common/tour-start-dialog';
import { DBOT_ONBOARDING } from '../tour-content';
import { useTourHandler } from '../useTourHandler';

const OnboardingTourDesktop = observer(() => {
    const { dashboard } = useDBotStore();
    const { active_tab, active_tour, setActiveTour, setTourDialogVisibility } = dashboard;
    const { is_close_tour, is_finished, handleJoyrideCallback, setIsCloseTour } = useTourHandler();
    React.useEffect(() => {
        if (is_close_tour || is_finished) {
            setIsCloseTour(false);
            setActiveTour('');
        }
    }, [is_close_tour, is_finished, setActiveTour, setIsCloseTour]);

    const token = getSetting('onboard_tour_token');
    if (!token && active_tab === 0) setTourDialogVisibility(true);

    return (
        <>
            <TourStartDialog />
            {active_tour && (
                <ReactJoyrideWrapper handleCallback={handleJoyrideCallback} steps={DBOT_ONBOARDING} spotlightClicks />
            )}
        </>
    );
});

export default OnboardingTourDesktop;
