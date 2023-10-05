import React from 'react';
import { useLocation } from 'react-router-dom';
import { PlatformContext, routes } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import DefaultHeader from './default-header.jsx';
import DashboardHeader from './dashboard-header.jsx';
import DTraderHeader from './dtrader-header.jsx';
import TradersHubHeader from './traders-hub-header';
import { useIsP2PEnabled, useP2POrderList } from '@deriv/hooks';

const Header = observer(() => {
    const { client, notifications } = useStore();
    const { is_logged_in, is_authorize } = client;
    const { is_appstore } = React.useContext(PlatformContext);
    const { pathname } = useLocation();
    const { subscribe, data, unsubscribe } = useP2POrderList();
    const { data: is_p2p_enabled } = useIsP2PEnabled();

    React.useEffect(() => {
        if (is_authorize && is_p2p_enabled) {
            subscribe({
                payload: {
                    active: 0,
                },
            });
        } else {
            unsubscribe();
        }
    }, [is_authorize, is_p2p_enabled, subscribe, unsubscribe]);

    React.useEffect(() => {
        // @ts-expect-error `p2p_order_list` return individual `p2p_order_info` after order completion
        if (data?.p2p_order_info && !notifications.p2p_completed_orders.includes(data.p2p_order_info)) {
            // @ts-expect-error `p2p_order_list` return individual `p2p_order_info` after order completion
            notifications.p2p_completed_orders.push(data.p2p_order_info);
        }
        if (data?.p2p_order_list?.list && data?.p2p_order_list?.list !== notifications.p2p_completed_orders) {
            notifications.p2p_completed_orders = data.p2p_order_list.list;
        }
    }, [data, notifications]);

    const traders_hub_routes =
        pathname === routes.traders_hub ||
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
