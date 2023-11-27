import React from 'react';
import { useLocation } from 'react-router-dom';
import { routes } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import { useFeatureFlags, useStoreWalletAccountsList } from '@deriv/hooks';
import DefaultHeader from './default-header.jsx';
import DTraderHeader from './dtrader-header.jsx';
import TradersHubHeader from './traders-hub-header';
import DTraderHeaderWallets from './dtrader-header-wallets';
import { useReadLocalStorage } from 'usehooks-ts';

const Header = observer(() => {
    const { client } = useStore();
    const { is_logged_in, setAccounts, setLoginId } = client;
    const { pathname } = useLocation();
    const traders_hub_routes =
        [routes.traders_hub, routes.account, routes.cashier, routes.wallets, routes.compare_cfds].includes(pathname) ||
        pathname.startsWith(routes.compare_cfds);

    const clientAccounts = useReadLocalStorage('client.accounts');
    const { is_next_wallet_enabled } = useFeatureFlags();
    const { has_wallet } = useStoreWalletAccountsList();
    const should_show_wallets = is_next_wallet_enabled && has_wallet;

    React.useEffect(() => {
        setAccounts(clientAccounts as Record<string, ReturnType<typeof useStore>['client']['accounts'][number]>);
        setLoginId(String(localStorage.getItem('active_loginid')));
    }, [clientAccounts, setAccounts, setLoginId]);

    if (is_logged_in) {
        let result;
        if (traders_hub_routes) {
            result = <TradersHubHeader />;
        } else if (pathname === routes.onboarding) {
            result = null;
        } else {
            result = should_show_wallets ? <DTraderHeaderWallets /> : <DTraderHeader />;
        }
        return result;
    } else if (pathname === routes.onboarding) {
        return null;
    }
    return <DefaultHeader />;
});

export default Header;
