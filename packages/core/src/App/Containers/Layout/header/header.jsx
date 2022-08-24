import React from 'react';
import { PlatformContext } from '@deriv/shared';
import DefaultHeader from './default-header.jsx';
import DashboardPlatformHeader from './dashboard-platform-header.jsx';
import DashboardHeader from './dashboard-header.jsx';
import TradingHubHeader from './trading-hub-header.jsx';

const Header = () => {
    const { is_appstore } = React.useContext(PlatformContext);
    const { is_pre_appstore } = React.useContext(PlatformContext);
    if (is_appstore) {
        /**
         * The below line will implement when the new domain myapps.deriv.com added.
         */
        if (/myapps.deriv/.test(window.location.pathname)) return <DashboardPlatformHeader />;
        return <DashboardHeader />;
    } else if (is_pre_appstore) {
        return <TradingHubHeader />;
    }
    return <DefaultHeader />;
};

export default Header;
