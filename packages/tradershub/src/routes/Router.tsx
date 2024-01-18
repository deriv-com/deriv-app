import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { TradersHubRoute } from './TradersHubRoute';

const prefix = '/traders-hub';

type TRoutes = `${typeof prefix}${'' | '/compare-account' | '/onboarding'}`;

declare module 'react-router-dom' {
    // Had to put string here cause of the difference in the type of the path we have throughout the app
    export function useHistory(): { push: (path: TRoutes | string) => void }; // NOSONAR

    export function useRouteMatch(path: TRoutes): boolean;
}

const Router = () => {
    return (
        <Switch>
            <Route component={TradersHubRoute} path={prefix} />
        </Switch>
    );
};

export default Router;
