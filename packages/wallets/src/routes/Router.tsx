import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { useWalletAccountsList } from '@deriv/api';
import { WalletNoWalletFoundState } from '../components';
import { CashierModalRoute } from './CashierModalRoute';
import { CompareAccountsRoute } from './CompareAccountsRoute';
import { WalletsListingRoute } from './WalletsListingRoute';

const prefix = '/wallets';

type TBaseRoute =
    | ''
    | '/cashier'
    | '/cashier/deposit'
    | '/cashier/on-ramp'
    | '/cashier/reset-balance'
    | '/cashier/transactions'
    | '/cashier/transfer'
    | '/cashier/withdraw'
    | '/compare-accounts';

export type TRoute = '/endpoint' | `${typeof prefix}${TBaseRoute}`;

interface BaseRouteState {
    '/cashier/transactions': { showPending: boolean; transactionType: 'deposit' | 'withdrawal' };
    '/cashier/transfer': { toAccountLoginId: string };
}

type TRouteState = {
    [K in TBaseRoute as `${typeof prefix}${K}`]: K extends keyof BaseRouteState ? BaseRouteState[K] : never;
};

type TLocationInfo = {
    [K in keyof BaseRouteState]: {
        pathname: `${typeof prefix}${K}`;
        state: BaseRouteState[K];
    };
}[keyof BaseRouteState];

declare module 'react-router-dom' {
    export function useHistory<T extends TRoute>(): {
        location: TLocationInfo & {
            hash: string;
            search: string;
        };
        push: <T extends TRoute>(
            path: T,
            state?: T extends `${typeof prefix}${TBaseRoute}` ? TRouteState[T] : never
        ) => void;
    };

    export function useRouteMatch(path: TRoute): boolean;
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
