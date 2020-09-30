export const getSelectedRoute = ({ routes, pathname }) => {
    const route = routes.find(r => r.path === pathname) || routes.find(r => r.default) || routes[0];
    if (!route) return null;

    return route;
};

export const isRouteVisible = (route, is_logged_in) => !(route && route.is_authenticated && !is_logged_in);
