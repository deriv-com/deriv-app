import { routes } from '../routes';

/*
 * These functions exist because we want to refresh the browser page on switch between Bot and the rest of the platforms.
 * */

export const isBot = () =>
    /^\/bot/.test(window.location.pathname) ||
    (/^\/(br_)/.test(window.location.pathname) && window.location.pathname.split('/')[2] === 'bot');

export const isMT5 = () =>
    /^\/mt5/.test(window.location.pathname) ||
    (/^\/(br_)/.test(window.location.pathname) && window.location.pathname.split('/')[2] === 'mt5');

export const isP2P = (routing_history, platform_route) => {
    const routing_history_index = routing_history.length > 1 ? 1 : 0;
    const history_item = routing_history[routing_history_index];
    return history_item?.pathname === platform_route;
};

export const getPlatformHeader = routing_history => {
    if (isBot() || isNavigationFromPlatform(routing_history, routes.bot)) return 'DBot';
    if (isMT5() || isNavigationFromPlatform(routing_history, routes.mt5)) return 'DMT5';
    if (isNavigationFromPlatform(routing_history, routes.smarttrader)) return 'SmartTrader';
    return 'DTrader';
};

export const getPlatformIcon = routing_history => {
    if (isBot() || isNavigationFromPlatform(routing_history, routes.bot)) return 'IcBrandDbot';
    if (isMT5() || isNavigationFromPlatform(routing_history, routes.mt5)) return 'IcBrandDmt5';
    if (isNavigationFromPlatform(routing_history, routes.smarttrader)) return 'IcBrandSmarttrader';
    return 'IcBrandDtrader';
};

export const getPlatformRedirect = routing_history => {
    if (isBot() || isNavigationFromPlatform(routing_history, routes.bot)) return { name: 'DBot', route: routes.bot };
    if (isMT5() || isNavigationFromPlatform(routing_history, routes.mt5)) return { name: 'DMT5', route: routes.mt5 };
    if (isP2P(routing_history, routes.cashier_p2p)) return { name: 'P2P', route: routes.cashier_p2p };
    if (isNavigationFromPlatform(routing_history, routes.smarttrader))
        return { name: 'SmartTrader', route: routes.smarttrader };
    return { name: 'DTrader', route: routes.trade };
};

export const isNavigationFromPlatform = (app_routing_history, platform_route, should_ignore_parent_path = false) => {
    const app_routing_history_length = app_routing_history.length;

    if (app_routing_history_length > 0) {
        // Look for the most recent tab visited
        const getParentPath = pathname => (/^http/.test(pathname) ? false : pathname.split('/')[1]);
        const recent_history_index = app_routing_history_length > 1 ? 1 : 0;
        const history_item = app_routing_history[recent_history_index];
        const history_item_parent_path = getParentPath(history_item.pathname);

        if (
            history_item_parent_path === getParentPath(platform_route) &&
            should_ignore_parent_path &&
            history_item.pathname === platform_route
        ) {
            return true;
        }
    }

    return false;
};
