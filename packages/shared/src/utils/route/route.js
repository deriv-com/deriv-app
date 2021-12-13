// Checks if pathname matches route. (Works even with query string /?)
// TODO: Add test cases for this
export const matchRoute = (route, pathname) => new RegExp(`${route.path}(/$)?((?!-).)*$`).test(pathname);

export const getSelectedRoute = ({ routes, pathname }) => {
    const matching_route = routes.find(route => matchRoute(route, pathname));
    if (!matching_route) {
        return routes.find(route => route.default) || routes[0] || null;
    }
    return matching_route;
};

export const isRouteVisible = (route, is_logged_in) => !(route && route.is_authenticated && !is_logged_in);
