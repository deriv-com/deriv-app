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
    const { accounts, is_logged_in, setAccounts, loginid, switchAccount } = client;
    const { pathname } = useLocation();
    const traders_hub_routes =
        [routes.traders_hub, routes.account, routes.cashier, routes.wallets, routes.compare_cfds].includes(pathname) ||
        pathname.startsWith(routes.compare_cfds);

    const client_accounts = useReadLocalStorage('client.accounts');
    const { is_next_wallet_enabled } = useFeatureFlags();
    const { has_wallet } = useStoreWalletAccountsList();
    const should_show_wallets = is_next_wallet_enabled && has_wallet;

    React.useEffect(() => {
        if (should_show_wallets && is_logged_in) {
            const accounts_keys = Object.keys(accounts ?? {});
            const client_accounts_keys = Object.keys(client_accounts ?? {});
            if (client_accounts_keys.length > accounts_keys.length) {
                setAccounts(
                    client_accounts as Record<string, ReturnType<typeof useStore>['client']['accounts'][number]>
                );
                const active_loginig_from_local_storage = localStorage.getItem('active_loginid') ?? '';
                if (loginid !== active_loginig_from_local_storage) switchAccount(active_loginig_from_local_storage);
            }
        }
    }, [accounts, client_accounts, is_logged_in, loginid, setAccounts, should_show_wallets, switchAccount]);

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
