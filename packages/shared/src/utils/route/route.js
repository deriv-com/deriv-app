export const getSelectedRoute = ({ routes, pathname }) => {
    const matching_route = routes.find(route => new RegExp(`${route.path}(/$)?((?!-).)*$`).test(pathname));
    if (!matching_route) {
        return routes.find(r => r.default) || routes[0] || null;
    }
    return matching_route;
};

export const isRouteVisible = (route, is_logged_in) => !(route && route.is_authenticated && !is_logged_in);
