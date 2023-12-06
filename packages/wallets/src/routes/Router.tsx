import React, { useState } from 'react';
import { Route, Switch } from 'react-router-dom';
import { useWalletAccountsList } from '@deriv/api';
import { WalletNoWalletFoundState } from '../components';
import { CashierModalRoute } from './CashierModalRoute';
import { TraderHubRoute } from './TradersHubRoute';
import { WalletsListingRoute } from './WalletsListingRoute';

const prefix = '/wallets';

type TRoutes =
    | `${typeof prefix}/cashier/deposit`
    | `${typeof prefix}/cashier/reset-balance`
    | `${typeof prefix}/cashier/transactions`
    | `${typeof prefix}/cashier/transfer`
    | `${typeof prefix}/cashier/withdraw`
    | `${typeof prefix}/cashier`
    | `${typeof prefix}`;

declare module 'react-router-dom' {
    export function useHistory(): { push: (path: TRoutes | string) => void };

    export function useRouteMatch(path: TRoutes): boolean;
}

const Router: React.FC = () => {
    const [flag, setFlag] = useState(false); // Initialize the flag state

    const { data: walletAccounts, isLoading } = useWalletAccountsList();
    const toggleFlag = () => setFlag(prevFlag => !prevFlag); // Function to toggle the flag

    if ((!walletAccounts || !walletAccounts.length) && !isLoading)
        return <Route component={WalletNoWalletFoundState} path={prefix} />;

    return (
        <Switch>
            <button onClick={toggleFlag}>Toggle</button>
            {flag && <Route component={TraderHubRoute} path='/traders-hub' />}
            <Route component={CashierModalRoute} path={`${prefix}/cashier`} />
            <Route component={WalletsListingRoute} path={prefix} />
        </Switch>
    );
};

export default Router;
