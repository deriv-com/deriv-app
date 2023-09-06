type TStateChangeOption = {
    indicator_type_name?: string;
    indicators_category_name?: string;
    isClosed?: boolean;
    is_favorite?: boolean;
    is_info_open?: boolean;
    is_open?: boolean;
    chart_type_name?: string;
    search_string?: string;
    symbol?: string;
    symbol_category?: string;
    time_interval_name?: string;
};

export const ACTION = {
    ADD_ACTIVE: 'add_active',
    ADD_TO_FAVORITES: 'add_to_favorites',
    CHOOSE_CHART_TYPE: 'choose_chart_type',
    CHOOSE_MARKET_TYPE: 'choose_market_type',
    CHOOSE_TIME_INTERVAL: 'choose_time_interval',
    CLEAN_ALL_ACTIVE: 'clean_all_active',
    CLOSE: 'close',
    DELETE_ACTIVE: 'delete_active',
    DELETE_FROM_FAVORITES: 'delete_from_favorites',
    EDIT_ACTIVE: 'edit_active',
    INFO_OPEN: 'info_open',
    INFO_CLOSE: 'info_close',
    INFO_REDIRECT: 'info_redirect',
    OPEN: 'open',
    SEARCH: 'search',
} as const;

export const STATE_TYPES = {
    CHART_INTERVAL_CHANGE: 'CHART_INTERVAL_CHANGE',
    CHART_MODE_TOGGLE: 'CHART_MODE_TOGGLE',
    CHART_TYPE_CHANGE: 'CHART_TYPE_CHANGE',
    FAVORITE_MARKETS_TOGGLE: 'FAVORITE_MARKETS_TOGGLE',
    INDICATOR_ADDED: 'INDICATOR_ADDED',
    INDICATOR_DELETED: 'INDICATOR_DELETED',
    INDICATOR_INFO_TOGGLE: 'INDICATOR_INFO_TOGGLE',
    INDICATOR_SEARCH: 'INDICATOR_SEARCH',
    INDICATOR_SETTINGS_OPEN: 'INDICATOR_SETTINGS_OPEN',
    INDICATORS_CLEAR_ALL: 'INDICATORS_CLEAR_ALL',
    INDICATORS_MODAL_TOGGLE: 'INDICATORS_MODAL_TOGGLE',
    INITIAL: 'INITIAL',
    MARKET_INFO_REDIRECT: 'MARKET_INFO_REDIRECT',
    MARKET_SEARCH: 'MARKET_SEARCH',
    MARKET_STATE_CHANGE: 'MARKET_STATE_CHANGE',
    MARKETS_LIST_TOGGLE: 'MARKETS_LIST_TOGGLE',
    READY: 'READY',
    SCROLL_TO_LEFT: 'SCROLL_TO_LEFT',
    SYMBOL_CHANGE: 'SYMBOL_CHANGE',
} as const;

export const SUBFORM_NAME = {
    INDICATORS_INFO: 'indicators_info',
    INDICATORS_TYPE: 'indicators_type',
} as const;

const getChartTypeFormAnalyticsData = (state: keyof typeof STATE_TYPES, option: TStateChangeOption) => {
    const { chart_type_name = '', is_open, time_interval_name } = option;
    const chart_event_type = 'ce_chart_types_form';
    const payload = {
        data: {
            action: '',
            chart_type_name,
            time_interval_name,
        },
        event_type: chart_event_type,
    };
    const open_close_action = is_open ? ACTION.OPEN : ACTION.CLOSE;
    if (!chart_type_name) return {};
    if (state === STATE_TYPES.CHART_MODE_TOGGLE) {
        payload.data.action = open_close_action;
        return payload;
    } else if (state === STATE_TYPES.CHART_TYPE_CHANGE) {
        payload.data.action = ACTION.CHOOSE_CHART_TYPE;
        return payload;
    } else if (state === STATE_TYPES.CHART_INTERVAL_CHANGE) {
        payload.data.action = ACTION.CHOOSE_TIME_INTERVAL;
        return payload;
    }
    return {};
};

const getIndicatorTypeFormAnalyticsData = (state: keyof typeof STATE_TYPES, option: TStateChangeOption) => {
    const { indicator_type_name = '', indicators_category_name = '', is_info_open, is_open, search_string } = option;
    const indicators_event_type = 'ce_indicators_types_form';
    const indicators_subform = is_info_open ? SUBFORM_NAME.INDICATORS_INFO : SUBFORM_NAME.INDICATORS_TYPE;
    const info_open_close_action = is_info_open ? ACTION.INFO_OPEN : ACTION.INFO_CLOSE;
    const open_close_action = is_open ? ACTION.OPEN : ACTION.CLOSE;
    if (indicator_type_name) {
        const payload = {
            data: {
                action: '',
                indicator_type_name,
                indicators_category_name,
            },
            event_type: indicators_event_type,
        };
        if (state === STATE_TYPES.INDICATOR_DELETED) {
            payload.data.action = ACTION.DELETE_ACTIVE;
            return payload;
        } else if (state === STATE_TYPES.INDICATOR_SETTINGS_OPEN) {
            payload.data.action = ACTION.EDIT_ACTIVE;
            return payload;
        } else if (state === STATE_TYPES.INDICATOR_INFO_TOGGLE) {
            payload.data.action = info_open_close_action;
            return payload;
        }
    }
    if (state === STATE_TYPES.INDICATOR_ADDED) {
        return {
            data: {
                action: ACTION.ADD_ACTIVE,
                indicator_type_name,
                indicators_category_name,
                subform_name: indicators_subform,
            },
            event_type: indicators_event_type,
        };
    }
    if (state === STATE_TYPES.INDICATORS_MODAL_TOGGLE) {
        return {
            data: { action: open_close_action },
            event_type: indicators_event_type,
        };
    }
    if (state === STATE_TYPES.INDICATORS_CLEAR_ALL) {
        return {
            data: { action: ACTION.CLEAN_ALL_ACTIVE },
            event_type: indicators_event_type,
        };
    }
    if (option.search_string && state === STATE_TYPES.INDICATOR_SEARCH) {
        return {
            data: {
                action: ACTION.SEARCH,
                search_string,
            },
            event_type: indicators_event_type,
        };
    }
    return {};
};

const getMarketTypeFormAnalyticsData = (state: keyof typeof STATE_TYPES, option: TStateChangeOption) => {
    const {
        is_favorite,
        is_open,
        symbol_category: tab_market_name = '',
        search_string,
        symbol: market_type_name = '',
    } = option;
    const market_event_type = 'ce_market_types_form';
    const favorites_action = is_favorite ? ACTION.ADD_TO_FAVORITES : ACTION.DELETE_FROM_FAVORITES;
    const open_close_action = is_open ? ACTION.OPEN : ACTION.CLOSE;
    if (option.search_string && state === STATE_TYPES.MARKET_SEARCH) {
        return {
            data: {
                action: ACTION.SEARCH,
                search_string,
            },
            event_type: market_event_type,
        };
    }
    if (state === STATE_TYPES.MARKETS_LIST_TOGGLE) {
        return {
            data: {
                action: open_close_action,
                market_type_name,
            },
            event_type: market_event_type,
        };
    }
    if (state === STATE_TYPES.FAVORITE_MARKETS_TOGGLE && market_type_name) {
        return {
            data: {
                action: favorites_action,
                market_type_name,
            },
            event_type: market_event_type,
        };
    }
    if (state === STATE_TYPES.SYMBOL_CHANGE) {
        return {
            data: {
                action: ACTION.CHOOSE_MARKET_TYPE,
                market_type_name,
                tab_market_name,
            },
            event_type: market_event_type,
        };
    }
    if (state === STATE_TYPES.MARKET_INFO_REDIRECT) {
        return {
            data: {
                action: ACTION.INFO_REDIRECT,
                tab_market_name,
            },
            event_type: market_event_type,
        };
    }
    return {};
};

export const getChartAnalyticsData = (state: keyof typeof STATE_TYPES, option: TStateChangeOption) => {
    const chart_type_form_events: string[] = [
        STATE_TYPES.CHART_INTERVAL_CHANGE,
        STATE_TYPES.CHART_MODE_TOGGLE,
        STATE_TYPES.CHART_TYPE_CHANGE,
    ];
    const indicator_type_form_events: string[] = [
        STATE_TYPES.INDICATOR_ADDED,
        STATE_TYPES.INDICATOR_DELETED,
        STATE_TYPES.INDICATOR_INFO_TOGGLE,
        STATE_TYPES.INDICATOR_SEARCH,
        STATE_TYPES.INDICATOR_SETTINGS_OPEN,
        STATE_TYPES.INDICATORS_CLEAR_ALL,
        STATE_TYPES.INDICATORS_MODAL_TOGGLE,
    ];
    const market_type_form_events: string[] = [
        STATE_TYPES.FAVORITE_MARKETS_TOGGLE,
        STATE_TYPES.MARKET_INFO_REDIRECT,
        STATE_TYPES.MARKETS_LIST_TOGGLE,
        STATE_TYPES.MARKET_SEARCH,
        STATE_TYPES.SYMBOL_CHANGE,
    ];
    if (chart_type_form_events.includes(state)) return getChartTypeFormAnalyticsData(state, option);
    if (indicator_type_form_events.includes(state)) return getIndicatorTypeFormAnalyticsData(state, option);
    if (market_type_form_events.includes(state)) return getMarketTypeFormAnalyticsData(state, option);
    return {};
};
