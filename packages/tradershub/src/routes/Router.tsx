import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { CompareAccountsScreen } from '@cfd/screens';
import { TradersHubRoute } from './TradersHubRoute';

const prefix = '/traders-hub';

type TRoutes = `${typeof prefix}${'' | '/compare-accounts' | '/onboarding'}`;

declare module 'react-router-dom' {
    export function useHistory(): {
        location: { pathname: string; search: string };
        push: (path: string | { pathname: string; search: string; state?: Record<string, unknown> }) => void;
    };
    export function useRouteMatch(path: TRoutes): boolean;
}

const Router = () => {
    return (
        <Switch>
            <Route component={CompareAccountsScreen} path={`${prefix}/compare-accounts`} />
            <Route component={TradersHubRoute} path={prefix} />
        </Switch>
    );
};

export default Router;
