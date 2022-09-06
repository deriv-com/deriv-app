import React from 'react';
import { PlatformContext, routes } from '@deriv/shared';
import DefaultHeader from './default-header.jsx';
import DashboardPlatformHeader from './dashboard-platform-header.jsx';
import DashboardHeader from './dashboard-header.jsx';
import TradingHubHeader from './trading-hub-header.jsx';
import DTraderHeader from './dtrader-header.jsx';
import { connect } from 'Stores/connect';

const Header = () => {
    const { is_appstore, is_pre_appstore } = React.useContext(PlatformContext);
    if (is_appstore) {
        /**
         * The below line will implement when the new domain myapps.deriv.com added.
         */
        if (/myapps.deriv/.test(window.location.pathname)) return <DashboardPlatformHeader />;
        return <DashboardHeader />;
    } else if (is_pre_appstore) {
        const location = window.location.pathname;
        if (location === routes.trading_hub || location === routes.cashier_deposit || location === routes.account)
            return <TradingHubHeader />;
        if (location === routes.trade) {
            return <DTraderHeader />;
        }
        return <TradingHubHeader />;
    }
    return <DefaultHeader />;
};

export default connect(({ client }) => ({
    is_logged_in: client.is_logged_in,
}))(Header);
