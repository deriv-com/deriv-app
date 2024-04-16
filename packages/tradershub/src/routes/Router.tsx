import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { TradersHub } from '@/components';
import { CompareAccountsScreen } from '@cfd/screens';

const prefix = '/traders-hub';

type TRoutes = `${typeof prefix}${'' | '/compare-accounts' | '/onboarding'}`;

declare module 'react-router-dom' {
    export function useHistory(): {
        action: 'POP' | 'PUSH' | 'REPLACE';
        location: { pathname: string; search: string };
        push: (path: string | { pathname: string; search: string; state?: Record<string, unknown> }) => void;
    };
    export function useRouteMatch(path: TRoutes): boolean;
}

const Router = () => {
    return (
        <Switch>
            <Route component={CompareAccountsScreen} path={`${prefix}/compare-accounts`} />
            <Route component={TradersHub} path={prefix} />
        </Switch>
    );
};

export default Router;
