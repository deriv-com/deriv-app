import React from 'react';
import { connect } from 'Stores/connect';
import WelcomeModal1 from './welcome-modal-1.jsx';
import WelcomeModal2 from './welcome-modal-2.jsx';
import { useLandingCompany } from '@deriv/hooks';

const WelcomeModal = ({ is_eu, residence }) => {
    const { data: new_lc } = useLandingCompany();
    const is_excluded_from_cr_onboarding = ['au', 'sg', 'no'].includes(residence);
    const shortcode = new_lc?.financial_company?.shortcode || new_lc?.gaming_company?.shortcode;

    if ((shortcode === 'svg' && !is_excluded_from_cr_onboarding) || is_eu) {
        return <WelcomeModal1 />;
    }

    return <WelcomeModal2 />;
};

export default connect(({ client }) => ({
    residence: client.residence,
    landing_companies: client.landing_companies,
    is_eu: client.is_eu,
}))(WelcomeModal);
