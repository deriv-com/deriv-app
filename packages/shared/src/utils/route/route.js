export const getSelectedRoute = ({ routes, pathname }) => {
    const route = routes.find(r => r.path === pathname) || routes.find(r => r.default) || routes[0];
    if (!route) return null;

    return route;
};
