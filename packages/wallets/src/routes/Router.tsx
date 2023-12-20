import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { useWalletAccountsList } from '@deriv/api';
import { WalletNoWalletFoundState } from '../components';
import { CashierModalRoute } from './CashierModalRoute';
import { CompareAccountsRoute } from './CompareAccountsRoute';
import { WalletsListingRoute } from './WalletsListingRoute';

const prefix = '/wallets';

type TRoutes = `${typeof prefix}${
    | ''
    | '/cashier'
    | '/cashier/deposit'
    | '/cashier/reset-balance'
    | '/cashier/transaction'
    | '/cashier/transfer'
    | '/cashier/withdraw'
    | '/compare-account'}`;

declare module 'react-router-dom' {
    export function useHistory(): { push: (path: TRoutes | string) => void };

    export function useRouteMatch(path: TRoutes): boolean;
}

const Router: React.FC = () => {
    const { data: walletAccounts, isLoading } = useWalletAccountsList();

    if ((!walletAccounts || !walletAccounts.length) && !isLoading)
        return <Route component={WalletNoWalletFoundState} path={prefix} />;

    return (
        <Switch>
            <Route component={CompareAccountsRoute} path={`${prefix}/compare-accounts`} />
            <Route component={CashierModalRoute} path={`${prefix}/cashier`} />
            <Route component={WalletsListingRoute} path={prefix} />
        </Switch>
    );
};

export default Router;
