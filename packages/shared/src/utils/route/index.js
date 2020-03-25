let all_routes_config = [];

const addRoutesConfig = (routes_config, should_init) => {
    if (init) all_routes_config = [];
    all_routes_config.push(...routes_config);
};

const getAllRoutesConfig = () => {
    return all_routes_config;
};

const getSelectedRoute = ({ routes, pathname }) => {
    const route = routes.find(r => r.path === pathname || r.path === r.default) || routes[0];
    if (!route) return null;

    return route;
};

export default { getAllRoutesConfig, getSelectedRoute, addRoutesConfig };
