import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
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
            <Route component={CompareAccountsScreen} exact path={`${prefix}/compare-accounts`} />
            <Route component={TradersHub} exact path={prefix} />
            <Route component={() => <Redirect to='/404' />} />
        </Switch>
    );
};

export default Router;
