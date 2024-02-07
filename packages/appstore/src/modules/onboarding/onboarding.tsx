import React from 'react';
import { useHistory } from 'react-router-dom';
import { routes } from '@deriv/shared';
import { useStore, observer } from '@deriv/stores';
import OnboardingSkeleton from '../../components/loader';

const Onboarding = observer(() => {
    const history = useHistory();
    const { client } = useStore();
    const { is_landing_company_loaded, is_logged_in } = client;

    if (is_logged_in && is_landing_company_loaded) {
        history.push(routes.traders_hub);
    }

    return (
        <div data-testid='dt_onboarding_skeleton_loader'>
            <OnboardingSkeleton />;
        </div>
    );
});

export default Onboarding;
