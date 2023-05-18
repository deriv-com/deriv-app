// Checks if pathname matches route. (Works even with query string /?)
import React from 'react';
// TODO: Add test cases for this
type TRoute = {
    component?: React.ComponentType;
    default?: boolean;
    exact?: boolean;
    getTitle?: () => string;
    icon_component?: string;
    id?: string;
    is_authenticated?: boolean;
    is_invisible?: boolean;
    path?: string;
    to?: string;
};

type TGetSelectedRoute = {
    routes: TRoute[];
    pathname: string;
};

export const matchRoute = (route: TRoute, pathname: string) =>
    new RegExp(`${route.path}(/$)?([-_]|(?![-_]).)*$`).test(pathname);

export const getSelectedRoute = ({ routes, pathname }: TGetSelectedRoute) => {
    const matching_route = routes.find(route => matchRoute(route, pathname));
    if (!matching_route) {
        return routes.find(route => route.default) || routes[0] || null;
    }
    return matching_route;
};

export const isRouteVisible = (route: TRoute, is_logged_in: boolean) =>
    !(route && route.is_authenticated && !is_logged_in);
