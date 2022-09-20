// Checks if pathname matches route. (Works even with query string /?)
// TODO: Add test cases for this
type TRoute = {
    default?: boolean;
    exact?: boolean;
    id?: string;
    icon_component?: string;
    is_invisible?: boolean;
    path?: string;
    to?: string;
    getTitle?: () => string;
    is_authenticated?: boolean;
};

type TGetSelectedRoute = {
    routes: TRoute[];
    pathname: string;
};

export const matchRoute = (route: TRoute, pathname: string) =>
    new RegExp(`${route.path}(/$)?((?!-).)*$`).test(pathname);

export const getSelectedRoute = ({ routes, pathname }: TGetSelectedRoute) => {
    const matching_route = routes.find(route => matchRoute(route, pathname));
    if (!matching_route) {
        return routes.find(route => route.default) || routes[0] || null;
    }
    return matching_route;
};

export const isRouteVisible = (route: TRoute, is_logged_in: boolean) =>
    !(route && route.is_authenticated && !is_logged_in);
