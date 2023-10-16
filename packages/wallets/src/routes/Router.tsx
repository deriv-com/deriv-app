import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { useWalletAccountsList } from '@deriv/api';
import { WalletNoWalletFoundState } from '../components';
import { CashierModalRoute } from './CashierModalRoute';
import { WalletsListingRoute } from './WalletsListingRoute';

const prefix = '/wallets';

type TRoutes =
    | `${typeof prefix}/cashier/deposit`
    | `${typeof prefix}/cashier/transactions`
    | `${typeof prefix}/cashier/transfer`
    | `${typeof prefix}/cashier/withdraw`
    | `${typeof prefix}/cashier`
    | `${typeof prefix}`;

declare module 'react-router-dom' {
    export function useHistory(): { push: (path: TRoutes) => void };

    export function useRouteMatch(path: TRoutes): boolean;
}

const Router: React.FC = () => {
    const { data: walletAccounts } = useWalletAccountsList();

    if (!walletAccounts || !walletAccounts.length) return <Route component={WalletNoWalletFoundState} path={prefix} />;

    return (
        <Switch>
            <Route component={CashierModalRoute} path={`${prefix}/cashier`} />
            <Route component={WalletsListingRoute} path={prefix} />
        </Switch>
    );
};

export default Router;
