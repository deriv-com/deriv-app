import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { useWalletAccountsList } from '@deriv/api';
import { WalletNoWalletFoundState } from '../components';
import { CashierModalRoute } from './CashierModalRoute';
import { CompareAccountsRoute } from './CompareAccountsRoute';
import { WalletsListingRoute } from './WalletsListingRoute';

const walletsPrefix = '/wallets';

type TWalletsRoute =
    | ''
    | '/cashier'
    | '/cashier/deposit'
    | '/cashier/on-ramp'
    | '/cashier/reset-balance'
    | '/cashier/transactions'
    | '/cashier/transfer'
    | '/cashier/withdraw'
    | '/compare-accounts';

export type TRoute = '/endpoint' | `${typeof walletsPrefix}${TWalletsRoute}`;

// wallets routes which have their states
interface WalletsRouteState {
    '/cashier/transactions': { showPending?: boolean; transactionType?: 'deposit' | 'withdrawal' };
    '/cashier/transfer': { toAccountLoginId: string };
}

type TRouteState = {
    [K in TWalletsRoute as `${typeof walletsPrefix}${K}`]: K extends keyof WalletsRouteState
        ? WalletsRouteState[K]
        : never;
};

type TLocationInfo = {
    [K in keyof WalletsRouteState]: {
        pathname: `${typeof walletsPrefix}${K}`;
        state?: WalletsRouteState[K];
    };
}[keyof WalletsRouteState];

declare module 'react-router-dom' {
    export function useHistory(): {
        location: TLocationInfo & {
            hash: string;
            search: string;
        };
        push: <T extends TRoute>(
            path: T,
            state?: T extends `${typeof walletsPrefix}${TWalletsRoute}` ? TRouteState[T] : never
        ) => void;
    };

    export function useRouteMatch(path: TRoute): boolean;
}

const Router: React.FC = () => {
    const { data: walletAccounts, isLoading } = useWalletAccountsList();

    if ((!walletAccounts || !walletAccounts.length) && !isLoading)
        return <Route component={WalletNoWalletFoundState} path={walletsPrefix} />;

    return (
        <Switch>
            <Route component={CompareAccountsRoute} path={`${walletsPrefix}/compare-accounts`} />
            <Route component={CashierModalRoute} path={`${walletsPrefix}/cashier`} />
            <Route component={WalletsListingRoute} path={walletsPrefix} />
        </Switch>
    );
};

export default Router;
