// Checks if pathname matches route. (Works even with query string /?)

// TODO: Add test cases for this
export type TRoute = {
    component?: React.ElementType | null;
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

// @ts-expect-error as this is a utility function with dynamic types
export const matchRoute = <T>(route: T, pathname: string) => new RegExp(`^${route?.path}(/.*)?$`).test(pathname);

export const getSelectedRoute = ({ routes, pathname }: TGetSelectedRoute) => {
    const matching_route = routes.find(route => matchRoute(route, pathname));
    if (!matching_route) {
        return routes.find(route => route.default) || routes[0] || null;
    }
    return matching_route;
};

export const isRouteVisible = (route: TRoute, is_logged_in: boolean) =>
    !(route && route.is_authenticated && !is_logged_in);
