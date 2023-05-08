import { routes } from '@deriv/shared';

export const isRouteVisible = (route, is_logged_in) => !(route && route.is_authenticated && !is_logged_in);

export const getPath = (route_path, params = {}) =>
    Object.keys(params).reduce((p, name) => p.replace(`:${name}`, params[name]), route_path);

export const getContractPath = contract_id => getPath(routes.contract, { contract_id });
