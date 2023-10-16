type TRoutingHistory = {
    action: string;
    hash: string;
    key: string;
    pathname: string;
    search: string;
    state: {
        [key: string]: string;
    };
};

/**
 * Function to check if the page was navigated to from the page_route provided.
 * @param {TRoutingHistory[]} app_routing_history
 * @param {string} page_route
 * @returns {boolean} true if the page was navigated to from the page_route provided, false otherwise.
 */
export const checkRoutingHistory = (app_routing_history: TRoutingHistory[], page_route: string) => {
    const routing_history_index = app_routing_history.length > 1 ? 1 : 0;
    const history_item = app_routing_history[routing_history_index];
    return history_item?.pathname.startsWith(page_route);
};

/**
 * Function that returns the state from the history item of the given index.
 * @param {TRoutingHistory[]} app_routing_history
 * @returns {object}
 */
export const getHistoryState = (app_routing_history: TRoutingHistory[], index: number) => {
    if (index < 0 || index >= app_routing_history.length) return {};
    const history_item = app_routing_history[index];
    return history_item?.state;
};
