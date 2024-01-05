// Checks if pathname matches route. (Works even with query string /?)

// TODO: Add test cases for this
import React from 'react';
import { Redirect } from 'react-router-dom';
import { deepCopy } from '../object';
import { routes } from '../routes';

export type TRoute = {
    component?: React.ElementType | null | ((routes?: TRoute[]) => JSX.Element) | typeof Redirect;
    default?: boolean;
    exact?: boolean;
    getTitle?: () => string;
    icon_component?: string;
    id?: string;
    is_authenticated?: boolean;
    is_invisible?: boolean;
    path?: string;
    to?: string;
    icon?: string;
    is_disabled?: boolean;
    subroutes?: TRoute[];
    routes?: TRoute[];
};

type TGetSelectedRoute = {
    routes: TRoute[];
    pathname: string;
};

// @ts-expect-error as this is a utility function with dynamic types
export const matchRoute = <T,>(route: T, pathname: string) => new RegExp(`^${route?.path}(/.*)?$`).test(pathname);

export const getSelectedRoute = ({ routes, pathname }: TGetSelectedRoute) => {
    const matching_route = routes.find(route => matchRoute(route, pathname));
    if (!matching_route) {
        return routes.find(route => route.default) || routes[0] || null;
    }
    return matching_route;
};

export const isRouteVisible = (route: TRoute, is_logged_in: boolean) =>
    !(route && route.is_authenticated && !is_logged_in);

export const removePasskeysFromRoutes = (routes_array: TRoute[]) => {
    return (deepCopy(routes_array) as TRoute[]).filter(route => {
        if (route?.id === 'security_routes') {
            route.subroutes = route.subroutes?.filter(subroute => subroute.path !== routes.passkeys);
        }
        return route;
    });
};

export const removePasskeysFromRoutesMobile = (routes_array: TRoute[]) => {
    return (deepCopy(routes_array) as TRoute[]).map(route => {
        if (route.path === routes.account && route.routes) {
            route.routes = removePasskeysFromRoutes(route.routes);
        }
        return route;
    });
};
