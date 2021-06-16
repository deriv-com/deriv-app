import React from 'react';
import { PlatformContext } from '@deriv/shared';
import DefaultHeader from './default-header.jsx';
import DashboardPlatformHeader from './dashboard-platform-header.jsx';
import DashboardHeader from './dashboard-header.jsx';
import SignupOnboardingHeader from './signup-onboarding-header.jsx';

const Header = () => {
    const { is_dashboard } = React.useContext(PlatformContext);
    const url_query_string = window.location.search;
    const url_params = new URLSearchParams(url_query_string);
    const url = url_params.get('action');

    if (is_dashboard) {
        /**
         * The below line will implement when the new domain myapps.deriv.com added.
         */
        if (/myapps.deriv/.test(window.location.pathname)) return <DashboardPlatformHeader />;
        return <DashboardHeader />;
    }

    if (url === 'signup') {
        return <SignupOnboardingHeader />;
    }

    return <DefaultHeader />;
};

export default Header;
