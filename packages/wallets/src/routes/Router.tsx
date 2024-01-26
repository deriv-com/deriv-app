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
    | '/cashier/transactions'
    | '/cashier/transfer'
    | '/cashier/withdraw'
    | '/compare-account'}`;

declare module 'react-router-dom' {
    export function useHistory(): {
        location: {
            hash: string;
            pathname: string;
            search: string;
            state: Record<string, unknown>;
        };
        push: (path: TRoutes | string, state?: Record<string, unknown>) => void;
    };

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
