import React from 'react';
import { connect } from 'Stores/connect';
import { useLocation } from 'react-router-dom';
import { PlatformContext, routes } from '@deriv/shared';
import { useFeatureFlags, useWalletAccountsList } from '@deriv/hooks';
import DefaultHeader from './default-header.jsx';
import DashboardHeader from './dashboard-header.jsx';
import TradingHubHeader from './trading-hub-header.jsx';
import DTraderHeader from './dtrader-header.jsx';
import DtraderHeaderWallets from './dtrader-header-wallets';

const Header = ({ is_logged_in }) => {
    const { is_appstore } = React.useContext(PlatformContext);
    const { pathname } = useLocation();
    const trading_hub_routes =
        pathname === routes.traders_hub ||
        pathname.startsWith(routes.account) ||
        pathname.startsWith(routes.cashier) ||
        pathname.startsWith(routes.compare_cfds);

    const { is_wallet_enabled } = useFeatureFlags();
    const { has_wallet } = useWalletAccountsList();
    const should_show_wallets = is_wallet_enabled && has_wallet;

    if (is_appstore) {
        return <DashboardHeader />;
    } else if (is_logged_in) {
        let result;
        if (trading_hub_routes) {
            result = <TradingHubHeader />;
        } else if (pathname === routes.onboarding) {
            result = null;
        } else {
            result = should_show_wallets ? <DtraderHeaderWallets /> : <DTraderHeader />;
        }
        return result;
    } else if (pathname === routes.onboarding) {
        return null;
    }
    return <DefaultHeader />;
};

export default connect(({ client }) => ({
    is_logged_in: client.is_logged_in,
}))(Header);
