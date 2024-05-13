import React, { lazy } from 'react';
import { Route, Switch } from 'react-router-dom';
import { useWalletAccountsList } from '@deriv/api-v2';
import { Loader } from '../components/Loader';

const LazyWalletsNotFoundState = lazy(
    () =>
        import(
            /* webpackChunkName: "wallets-not-found-route" */ '../components/WalletNoWalletFoundState/WalletNoWalletFoundState'
        )
);

const LazyWalletsListingRoute = lazy(
    () => import(/* webpackChunkName: "wallets-listing-route" */ './WalletsListingRoute/WalletsListingRoute')
);
const LazyCashierModalRoute = lazy(
    () => import(/* webpackChunkName: "cashier-modal-route" */ './CashierModalRoute/CashierModalRoute')
);

const LazyCompareAccountsRoute = lazy(
    () => import(/* webpackChunkName: "compare-accounts-route" */ './CompareAccountsRoute/CompareAccountsRoute')
);

type TWalletsRoute =
    | '/'
    | '/cfd-compare-acccounts'
    | '/wallet'
    | '/wallet/account-transfer'
    | '/wallet/deposit'
    | '/wallet/on-ramp'
    | '/wallet/reset-balance'
    | '/wallet/transactions'
    | '/wallet/withdraw';

export type TRoute = TWalletsRoute | '/endpoint' | `?${string}`;

// wallets routes which have their states
interface WalletsRouteState {
    '/wallet/account-transfer': { shouldSelectDefaultWallet: boolean; toAccountLoginId: string };
    '/wallet/transactions': { showPending: boolean; transactionType: 'deposit' | 'withdrawal' };
}

type TStatefulRoute = TRoute & `${keyof WalletsRouteState}`;

type TRouteState = {
    [T in TStatefulRoute]: T extends `${infer R extends keyof WalletsRouteState}`
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
        return (
            <Route
                path={'/'}
                render={() => (
                    <React.Suspense fallback={<Loader />}>
                        <LazyWalletsNotFoundState />
                    </React.Suspense>
                )}
            />
        );

    return (
        <Switch>
            <Route
                path={`/cfd-compare-acccounts`}
                render={() => (
                    <React.Suspense fallback={<Loader />}>
                        <LazyCompareAccountsRoute />
                    </React.Suspense>
                )}
            />
            <Route
                path={`/wallet`}
                render={() => (
                    <React.Suspense fallback={<Loader />}>
                        <LazyCashierModalRoute />
                    </React.Suspense>
                )}
            />
            <Route
                path={'/'}
                render={() => (
                    <React.Suspense fallback={<Loader />}>
                        <LazyWalletsListingRoute />
                    </React.Suspense>
                )}
            />
        </Switch>
    );
};

export default Router;
