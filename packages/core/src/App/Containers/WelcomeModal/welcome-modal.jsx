import React from 'react';
import { connect } from 'Stores/connect';
import WelcomeModalCR from './welcome-modal-cr.jsx';
import WelcomeModalNonCR from './welcome-modal-non-cr.jsx';

const WelcomeModal = ({ landing_companies, residence }) => {
    const is_excluded_from_cr_onboarding = ['au', 'sg', 'no'].includes(residence);
    const shortcode = landing_companies?.financial_company?.shortcode || landing_companies?.gaming_company?.shortcode;

    if (shortcode === 'svg' && !is_excluded_from_cr_onboarding) {
        return <WelcomeModalCR history={history} />;
    }

    return <WelcomeModalNonCR />;
};

export default connect(({ client }) => ({
    residence: client.residence,
    landing_companies: client.landing_companies,
}))(WelcomeModal);
