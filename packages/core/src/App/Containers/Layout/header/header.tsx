import React from 'react';
import { useLocation } from 'react-router-dom';
import { PlatformContext, routes } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import DefaultHeader from './default-header.jsx';
import DashboardHeader from './dashboard-header.jsx';
import DTraderHeader from './dtrader-header.jsx';
import TradersHubHeader from './traders-hub-header';

const Header = observer(() => {
    const { client } = useStore();
    const { is_logged_in } = client;
    const { is_appstore } = React.useContext(PlatformContext);
    const { pathname } = useLocation();
    const traders_hub_routes =
        pathname === routes.traders_hub ||
        pathname === routes.wallets ||
        pathname.startsWith(routes.account) ||
        pathname.startsWith(routes.cashier) ||
        pathname.startsWith(routes.compare_cfds);

    if (is_appstore) {
        return <DashboardHeader />;
    } else if (is_logged_in) {
        let result;
        if (traders_hub_routes) {
            result = <TradersHubHeader />;
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
