import React from 'react';
import { useLocation } from 'react-router-dom';
import { routes } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import DefaultHeader from './default-header.jsx';
import DTraderHeader from './dtrader-header.jsx';
import TradersHubHeader from './traders-hub-header';

const Header = observer(() => {
    const { client } = useStore();
    const { is_logged_in } = client;
    const { pathname } = useLocation();
    const traders_hub_routes =
        [routes.traders_hub, routes.account, routes.cashier, routes.wallets, routes.compare_cfds].includes(pathname) ||
        pathname.startsWith(routes.compare_cfds);

    if (is_logged_in) {
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
