import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { TradersHubRoute } from './TradersHubRoute';

const prefix = '/traders-hub';

type TRoutes = `${typeof prefix}${'' | '/compare-account' | 'onboarding'}`;

declare module 'react-router-dom' {
    export function useHistory(): { push: (path: TRoutes) => void };

    export function useRouteMatch(path: TRoutes): boolean;
}

const Router: React.FC = () => {
    return (
        <Switch>
            <Route component={TradersHubRoute} path={prefix} />
        </Switch>
    );
};

export default Router;
