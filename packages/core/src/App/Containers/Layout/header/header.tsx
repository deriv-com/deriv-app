import React from 'react';
import { useLocation } from 'react-router-dom';
import { useFeatureFlags, useStoreWalletAccountsList } from '@deriv/hooks';
import { routes } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import DefaultHeader from './default-header';
import DefaultHeaderWallets from './defaut-header-wallets';
import DTraderHeader from './dtrader-header';
import TradersHubHeader from './traders-hub-header';
import DTraderHeaderWallets from './dtrader-header-wallets';
import TradersHubHeaderWallets from './traders-hub-header-wallets';
import { useReadLocalStorage } from 'usehooks-ts';

const Header = observer(() => {
    const { client } = useStore();
    const { accounts, is_logged_in, setAccounts, loginid, switchAccount } = client;
    const { pathname } = useLocation();

    const is_wallets_cashier_route = pathname.includes(routes.wallets_cashier);

    const traders_hub_routes =
        [
            routes.traders_hub,
            routes.traders_hub_v2,
            routes.account,
            routes.cashier,
            routes.wallets,
            routes.wallets_compare_accounts,
            routes.compare_cfds,
        ].includes(pathname) ||
        pathname.startsWith(routes.compare_cfds) ||
        is_wallets_cashier_route;

    const client_accounts = useReadLocalStorage('client.accounts');
    const { is_next_wallet_enabled } = useFeatureFlags();
    const { has_wallet, data: wallets } = useStoreWalletAccountsList();
    const should_show_wallets = is_next_wallet_enabled && has_wallet;
    const active_loginid_from_local_storage = localStorage.getItem('active_loginid') ?? '';
    const is_current_account_wallet = active_loginid_from_local_storage?.match(/^(CRW|VRW)/);
    const linked_trading_account = React.useMemo(() => {
        if (is_current_account_wallet) {
            return wallets?.find(wallet => wallet.loginid === active_loginid_from_local_storage);
        }
        return null;
    }, [active_loginid_from_local_storage, is_current_account_wallet, wallets]);

    React.useEffect(() => {
        if (should_show_wallets && is_logged_in) {
            const accounts_keys = Object.keys(accounts ?? {});
            const client_accounts_keys = Object.keys(client_accounts ?? {});
            if (client_accounts_keys.length > accounts_keys.length) {
                setAccounts(
                    // @ts-expect-error TODO: fix types
                    client_accounts as Record<string, ReturnType<typeof useStore>['client']['accounts'][number]>
                );
            }
        }
    }, [accounts, client_accounts, is_logged_in, setAccounts, should_show_wallets]);

    React.useEffect(() => {
        if (
            is_logged_in &&
            is_current_account_wallet &&
            linked_trading_account &&
            active_loginid_from_local_storage &&
            should_show_wallets &&
            loginid !== active_loginid_from_local_storage
        ) {
            switchAccount(linked_trading_account.loginid);
        }
    }, [
        active_loginid_from_local_storage,
        is_current_account_wallet,
        is_logged_in,
        linked_trading_account,
        loginid,
        should_show_wallets,
        switchAccount,
    ]);

    if (is_logged_in) {
        let result;
        if (traders_hub_routes) {
            result = should_show_wallets ? <TradersHubHeaderWallets /> : <TradersHubHeader />;
        } else if (pathname === routes.onboarding) {
            result = null;
        } else {
            result = should_show_wallets ? <DTraderHeaderWallets /> : <DTraderHeader />;
        }
        return result;
    } else if (pathname === routes.onboarding) {
        return null;
    }
    return is_next_wallet_enabled ? <DefaultHeaderWallets /> : <DefaultHeader />;
});

export default Header;
