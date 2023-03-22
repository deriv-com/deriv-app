import React from 'react';
import { connect } from 'Stores/connect';
import { Jurisdiction } from '@deriv/shared';
import WelcomeModal1 from './welcome-modal-1.jsx';
import WelcomeModal2 from './welcome-modal-2.jsx';

const WelcomeModal = ({ is_eu, landing_companies, residence }) => {
    const is_excluded_from_cr_onboarding = ['au', 'sg', 'no'].includes(residence);
    const shortcode = landing_companies?.financial_company?.shortcode || landing_companies?.gaming_company?.shortcode;

    if ((shortcode === Jurisdiction.SVG && !is_excluded_from_cr_onboarding) || is_eu) {
        return <WelcomeModal1 />;
    }

    return <WelcomeModal2 />;
};

export default connect(({ client }) => ({
    residence: client.residence,
    landing_companies: client.landing_companies,
    is_eu: client.is_eu,
}))(WelcomeModal);
