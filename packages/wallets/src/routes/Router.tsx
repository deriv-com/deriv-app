import React, { useState } from 'react';
import { Route, Switch, useHistory } from 'react-router-dom';
import { useWalletAccountsList } from '@deriv/api';
import { WalletNoWalletFoundState } from '../components';
import { CashierModalRoute } from './CashierModalRoute';
import { TradesHubRoute } from './TradersHubRoute';
import { WalletsListingRoute } from './WalletsListingRoute';

const prefix = '/wallets';

type TRoutes =
    | `${typeof prefix}/cashier/deposit`
    | `${typeof prefix}/cashier/reset-balance`
    | `${typeof prefix}/cashier/transactions`
    | `${typeof prefix}/cashier/transfer`
    | `${typeof prefix}/cashier/withdraw`
    | `${typeof prefix}/cashier`
    | `${typeof prefix}/traders-hub`
    | `${typeof prefix}`;

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
            <Route component={TradesHubRoute} path={`${prefix}/traders-hub`} />
            <Route component={CashierModalRoute} path={`${prefix}/cashier`} />
            <Route component={WalletsListingRoute} path={prefix} />
        </Switch>
    );
};

export default Router;
