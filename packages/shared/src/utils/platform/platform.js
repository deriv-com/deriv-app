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

// TODO: Replace platform names with `platform_name` enum after merging "carol/journal error notification"
export const getPlatformInformation = routing_history => {
    const should_be_bot = isBot() || isNavigationFromPlatform(routing_history, routes.bot);
    if (should_be_bot) return { header: 'DBot', icon: 'IcBrandDbot' };

    const should_be_mt5 = isMT5() || isNavigationFromPlatform(routing_history, routes.mt5);
    if (should_be_mt5) return { header: 'DMT5', icon: 'IcBrandDmt5' };

    const should_be_smartTrader = isNavigationFromPlatform(routing_history, routes.smarttrader);
    if (should_be_smartTrader) return { header: 'SmartTrader', icon: 'IcBrandSmarttrader' };

    return { header: 'DTrader', icon: 'IcBrandDtrader' };
};

export const getPlatformRedirect = routing_history => {
    if (isBot() || isNavigationFromPlatform(routing_history, routes.bot)) return { name: 'DBot', route: routes.bot };
    if (isMT5() || isNavigationFromPlatform(routing_history, routes.mt5)) return { name: 'DMT5', route: routes.mt5 };
    if (isNavigationFromPlatform(routing_history, routes.smarttrader))
        return { name: 'SmartTrader', route: routes.smarttrader };
    if (isNavigationFromPlatform(routing_history, routes.cashier_p2p, true))
        return { name: 'P2P', route: routes.cashier_p2p };
    return { name: 'DTrader', route: routes.trade };
};

export const isNavigationFromPlatform = (app_routing_history, platform_route, should_ignore_parent_path = false) => {
    if (app_routing_history.length > 0) {
        const getParentPath = pathname => (/^http/.test(pathname) ? false : pathname.split('/')[1]);

        for (let i = 0; i < app_routing_history.length; i++) {
            const history_item = app_routing_history[i];
            const history_item_parent_path = getParentPath(history_item.pathname);
            const next_history_item = app_routing_history.length > i + 1 && app_routing_history[i + 1];

            if (
                history_item_parent_path === getParentPath(platform_route) ||
                (should_ignore_parent_path && history_item.pathname === platform_route)
            ) {
                return true;
            } else if (!next_history_item) {
                return false;
            } else if (history_item_parent_path === getParentPath(next_history_item.pathname)) {
                // Continue walking until we see passed in platform_route.
                continue; // eslint-disable-line no-continue
            } else {
                // Return false when path matches a platform parent path, but don't return anything
                // when a non-platform path was seen. i.e. navigating between /cashier and /reports
                // should not affect navigating back to platform when clicking cross.
                const platform_parent_paths = [routes.mt5, routes.bot, routes.trade].map(route => getParentPath(route));
                const is_other_platform_path = platform_parent_paths.includes(history_item_parent_path);

                if (is_other_platform_path) {
                    break;
                }
            }
        }
    }

    return false;
};
