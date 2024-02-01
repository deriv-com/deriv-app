import React from 'react';
import { Switch } from 'react-router-dom';
import { routesConfig as routes } from '../constants/routesConfig';
import RouteWithSubRoutes from './RouteWithSubRoutes';

const prefix = '/cashier-v2';

type TRoutes = `${typeof prefix}${
    | ''
    | '/account-transfer'
    | '/deposit'
    | '/on-ramp'
    | '/payment-agent-transfer'
    | '/payment-agent'
    | '/withdrawal'}`;

declare module 'react-router-dom' {
    export function useHistory(): { push: (path: TRoutes) => void };

    export function useRouteMatch(path: TRoutes): boolean;
}

const Router = () => {
    return (
        <Switch>
            {routes.map(route => (
                <RouteWithSubRoutes key={route.path} {...route} />
            ))}
        </Switch>
    );
};

export default Router;
