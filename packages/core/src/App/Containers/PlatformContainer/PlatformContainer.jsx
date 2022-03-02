import React from 'react';
import { PlatformContext } from '@deriv/shared';

const DERIV_DASHBOARD_KEY = 'is_appstore';

const PlatformContainer = ({ ...props }) => {
    const is_appstore = window.localStorage.getItem(DERIV_DASHBOARD_KEY)
        ? window.localStorage.getItem(DERIV_DASHBOARD_KEY) === 'true'
        : process.env.IS_APPSTORE;
    const [deriv_dashboard, setDerivDashboard] = React.useState(is_appstore);

    const platform_store = {
        is_appstore: deriv_dashboard,
        setDerivDashboard,
        DERIV_DASHBOARD_KEY,
    };

    return <PlatformContext.Provider value={platform_store} {...props} />;
};

export default PlatformContainer;
