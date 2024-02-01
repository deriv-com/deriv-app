import React from 'react';
import { Switch } from 'react-router-dom';
import { cashierPathRoutes, routesConfig as routes } from '../constants/routesConfig';
import RouteWithSubRoutes from './RouteWithSubRoutes';

type TRoutes = typeof cashierPathRoutes[keyof typeof cashierPathRoutes];

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
