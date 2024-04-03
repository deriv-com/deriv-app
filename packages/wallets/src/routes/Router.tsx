import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { useWalletAccountsList } from '@deriv/api-v2';
import { WalletNoWalletFoundState } from '../components';
import { CashierModalRoute } from './CashierModalRoute';
import { CompareAccountsRoute } from './CompareAccountsRoute';
import { WalletsListingRoute } from './WalletsListingRoute';

const walletsPrefix = '/appstore/traders-hub';

type TWalletsRoute =
    | ''
    | '/cashier'
    | '/cashier/account-transfer'
    | '/cashier/deposit'
    | '/cashier/on-ramp'
    | '/cashier/reset-balance'
    | '/cashier/transactions'
    | '/cashier/withdraw'
    | '/cfd-compare-acccounts';

export type TRoute = '/endpoint' | `?${string}` | `${typeof walletsPrefix}${TWalletsRoute}`;

// wallets routes which have their states
interface WalletsRouteState {
    '/cashier/account-transfer': { toAccountLoginId: string };
    '/cashier/transactions': { showPending: boolean; transactionType: 'deposit' | 'withdrawal' };
}

type TStatefulRoute = TRoute & `${typeof walletsPrefix}${keyof WalletsRouteState}`;

type TRouteState = {
    [T in TStatefulRoute]: T extends `${typeof walletsPrefix}${infer R extends keyof WalletsRouteState}`
        ? Partial<WalletsRouteState[R]>
        : never;
};

type TLocationInfo = {
    [T in TRoute]: {
        pathname: T;
        state?: T extends TStatefulRoute ? TRouteState[T] : never;
    };
}[TRoute];

declare module 'react-router-dom' {
    export function useHistory(): {
        location: TLocationInfo & {
            hash: string;
            search: string;
        };
        push: <T extends TRoute>(path: T, ...state: T extends TStatefulRoute ? [TRouteState[T]?] : []) => void;
    };

    export function useRouteMatch(path: TRoute): boolean;
}

const Router: React.FC = () => {
    const { data: walletAccounts, isLoading } = useWalletAccountsList();

    if ((!walletAccounts || !walletAccounts.length) && !isLoading)
        return <Route component={WalletNoWalletFoundState} path={walletsPrefix} />;

    return (
        <Switch>
            <Route component={CompareAccountsRoute} path={`${walletsPrefix}/cfd-compare-acccounts`} />
            <Route component={CashierModalRoute} path={`${walletsPrefix}/cashier`} />
            <Route component={WalletsListingRoute} path={walletsPrefix} />
        </Switch>
    );
};

export default Router;
