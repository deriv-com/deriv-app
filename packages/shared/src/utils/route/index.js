let all_routes_config = [];

const addRoutesConfig = (routes_config, should_init) => {
    if (should_init) all_routes_config = [];
    all_routes_config.push(...routes_config);
};

const getAllRoutesConfig = () => {
    return all_routes_config;
};

const getSelectedRoute = ({ routes, pathname }) => {
    const route = routes.find(r => r.path === pathname) || routes.find(r => r.default) || routes[0];
    if (!route) return null;

    return route;
};

const getUrlBase = (path = '') => {
    const l = window.location;

    if (!/^\/(br_)/.test(l.pathname)) return path;

    return `/${l.pathname.split('/')[1]}${/^\//.test(path) ? path : `/${path}`}`;
};

export default { getAllRoutesConfig, getSelectedRoute, addRoutesConfig, getUrlBase };
