let all_routes_config = [];

export const addRoutesConfig = (routes_config, should_init) => {
    if (should_init) all_routes_config = [];
    all_routes_config.push(...routes_config);
};

export const getAllRoutesConfig = () => {
    return all_routes_config;
};

export const getSelectedRoute = ({ routes, pathname }) => {
    const route = routes.find(r => r.path === pathname) || routes.find(r => r.default) || routes[0];
    if (!route) return null;

    return route;
};
