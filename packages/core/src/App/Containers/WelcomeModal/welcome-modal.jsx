import React from 'react';
import { connect } from 'Stores/connect';
import WelcomeModalCr from './welcome-modal-cr.jsx';
import WelcomeModalMF from './welcome-modal-mf.jsx';

const WelcomeModal = ({ history, landing_companies, residence }) => {
    const is_excluded_from_cr_onboarding = ['au', 'sg', 'no'].includes(residence);
    const shortcode = landing_companies?.financial_company?.shortcode || landing_companies?.gaming_company?.shortcode;

    if (shortcode === 'svg' && !is_excluded_from_cr_onboarding) {
        return <WelcomeModalCr history={history} />;
    }
    return <WelcomeModalMF />;
};

export default connect(({ client }) => ({
    residence: client.residence,
    landing_companies: client.landing_companies,
}))(WelcomeModal);
