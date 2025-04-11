import React from 'react';
import { useLocation } from 'react-router-dom';
import { useReadLocalStorage } from 'usehooks-ts';
import { makeLazyLoader, moduleLoader, routes } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import classNames from 'classnames';

const HeaderFallback = () => {
    return <div className={classNames('header')} />;
};

const HeaderLegacy = makeLazyLoader(
    () => moduleLoader(() => import(/* webpackChunkName: "dtrader-header" */ './header-legacy')),
    () => <HeaderFallback />
)();

const HeaderWallets = makeLazyLoader(
    () => moduleLoader(() => import(/* webpackChunkName: "dtrader-header-wallets" */ './header-wallets')),
    () => <HeaderFallback />
)();

const Header = observer(() => {
    const { client } = useStore();
    const { accounts, has_wallet, is_logged_in, setAccounts, loginid, switchAccount } = client;
    const { pathname } = useLocation();

    const client_accounts = useReadLocalStorage('client.accounts');
    React.useEffect(() => {
        if (has_wallet && is_logged_in) {
            const accounts_keys = Object.keys(accounts ?? {});
            const client_accounts_keys = Object.keys(client_accounts ?? {});
            if (client_accounts_keys.length > accounts_keys.length) {
                setAccounts(
                    client_accounts as Record<string, ReturnType<typeof useStore>['client']['accounts'][number]>
                );
            }
        }
    }, [accounts, client_accounts, has_wallet, is_logged_in, loginid, setAccounts, switchAccount]);

    if (pathname === routes.onboarding) return null;
    return has_wallet ? <HeaderWallets /> : <HeaderLegacy />;
});

export default Header;
