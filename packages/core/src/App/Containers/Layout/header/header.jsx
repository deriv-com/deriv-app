import React from 'react';
import { PlatformContext, routes } from '@deriv/shared';
import DefaultHeader from './default-header.jsx';
import DashboardHeader from './dashboard-header.jsx';
import TradingHubHeader from './trading-hub-header.jsx';
import DTraderHeader from './dtrader-header.jsx';
import { useLocation } from 'react-router-dom';
import { observer, useStore } from '@deriv/stores';

const Header = observer(() => {
    const { client } = useStore();
    const { is_logged_in } = client;
    const { is_appstore } = React.useContext(PlatformContext);
    const { pathname } = useLocation();
    const trading_hub_routes =
        pathname === routes.traders_hub || pathname.startsWith(routes.account) || pathname.startsWith(routes.cashier);

    if (is_appstore) {
        return <DashboardHeader />;
    } else if (is_logged_in) {
        let result;
        if (trading_hub_routes) {
            result = <TradingHubHeader />;
        } else if (pathname === routes.onboarding) {
            result = null;
        } else {
            result = <DTraderHeader />;
        }
        return result;
    } else if (pathname === routes.onboarding) {
        return null;
    }
    return <DefaultHeader />;
});

export default Header;
