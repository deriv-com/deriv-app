import React from 'react';
import WelcomeModal1 from './welcome-modal-1.jsx';
import WelcomeModal2 from './welcome-modal-2.jsx';
import { observer, useStore } from '@deriv/stores';

const WelcomeModal = observer(() => {
    const { client } = useStore();
    const { is_eu, landing_companies, residence } = client;
    const is_excluded_from_cr_onboarding = ['au', 'sg', 'no'].includes(residence);
    const shortcode = landing_companies?.financial_company?.shortcode || landing_companies?.gaming_company?.shortcode;

    if ((shortcode === 'svg' && !is_excluded_from_cr_onboarding) || is_eu) {
        return <WelcomeModal1 />;
    }

    return <WelcomeModal2 />;
});

export default WelcomeModal;
