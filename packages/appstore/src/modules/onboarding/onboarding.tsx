import React from 'react';
import { useHistory } from 'react-router-dom';
import { routes } from '@deriv/shared';
import EmptyOnboarding from './empty-onboarding';
import { useStore, observer } from '@deriv/stores';

const Onboarding = observer(() => {
    const history = useHistory();
    const { client } = useStore();
    const { is_landing_company_loaded, is_logged_in } = client;

    if (is_logged_in && is_landing_company_loaded) {
        history.push(routes.traders_hub);
    }

    return <EmptyOnboarding />;
});

export default Onboarding;
