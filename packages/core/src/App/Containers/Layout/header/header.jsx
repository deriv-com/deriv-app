import React from 'react';
import { withRouter } from 'react-router-dom';
import { PlatformContext } from '@deriv/shared';
import DefaultHeader from './default-header.jsx';
import DashboardPlatformHeader from './dashboard-platform-header.jsx';
import DashboardHeader from './dashboard-header.jsx';
import SignupOnboardingHeader from './signup-onboarding-header.jsx';

const Header = ({ location: { pathname } }) => {
    const { is_dashboard } = React.useContext(PlatformContext);

    if (is_dashboard) {
        /**
         * The below line will implement when the new domain myapps.deriv.com added.
         */
        if (/myapps.deriv/.test(window.location.hostname)) return <DashboardPlatformHeader />;
        return <DashboardHeader />;
    }

    if (pathname === '/onboarding') {
        return <SignupOnboardingHeader />;
    }

    return <DefaultHeader />;
};

export default withRouter(Header);
