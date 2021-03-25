import React from 'react';
import { PlatformContext } from '@deriv/shared';

const DERIV_DASHBOARD_KEY = 'is_dashboard';

const PlatformContainer = ({ ...props }) => {
    const is_dashboard = window.localStorage.getItem(DERIV_DASHBOARD_KEY)
        ? window.localStorage.getItem(DERIV_DASHBOARD_KEY) === 'true'
        : process.env.IS_DASHBOARD;
    const [deriv_dashboard, setDerivDashboard] = React.useState(is_dashboard);

    const platform_store = {
        is_dashboard: deriv_dashboard,
        setDerivDashboard,
        DERIV_DASHBOARD_KEY,
    };

    return <PlatformContext.Provider value={platform_store} {...props} />;
};

export default PlatformContainer;
