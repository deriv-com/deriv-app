import { RouteComponentProps, Redirect, matchPath, RouteProps } from 'react-router';
import { routes } from '@deriv/shared';

type TRoute = {
    component?: React.ComponentType<RouteComponentProps> | React.ComponentType<Record<string, never>> | typeof Redirect;
    default?: boolean;
    exact?: boolean;
    getTitle?: () => string;
    path?: string;
    to?: string;
};

type TRouteConfig = TRoute & {
    is_authenticated?: boolean;
    routes?: TRoute[];
};

export const normalizePath = (path = '') => (/^\//.test(path) ? path : `/${path || ''}`); // Default to '/'

export const findRouteByPath = (path: string, routes_config?: TRouteConfig[]): RouteProps | undefined => {
    let result: RouteProps | undefined;

    routes_config?.some(route_info => {
        let match_path;
        try {
            match_path = matchPath(path, route_info);
        } catch (e) {
            if (/undefined/.test((e as Error).message)) {
                return undefined;
            }
        }

        if (match_path) {
            result = route_info;
            return true;
        } else if (route_info.routes) {
            result = findRouteByPath(path, route_info.routes);
            return result;
        }
        return false;
    });

    return result;
};

export const isRouteVisible = (route?: TRouteConfig, is_logged_in?: boolean) =>
    !(route && route.is_authenticated && !is_logged_in);

export const getPath = (route_path: string, params: { [key: string]: string } = {}) =>
    Object.keys(params).reduce((p, name) => p.replace(`:${name}`, params[name]), route_path);

export const getContractPath = (contract_id = '') => getPath(routes.contract, { contract_id });
