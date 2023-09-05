type TStateChangeOption = {
    indicator_type_name?: string;
    indicators_category_name?: string;
    isClosed?: boolean;
    is_favorite?: boolean;
    is_info_open?: boolean;
    is_open?: boolean;
    chart_type_name?: string;
    market_type_name?: string;
    search_string?: string;
    symbol?: string;
    tab_market_name?: string;
    time_interval_name?: string;
};

export const STATE_TYPES = {
    CHART_INTERVAL_CHANGE: 'CHART_INTERVAL_CHANGE',
    CHART_MODE_TOGGLE: 'CHART_MODE_TOGGLE',
    CHART_TYPE_CHANGE: 'CHART_TYPE_CHANGE',
    FAVORITE_MARKETS_TOGGLE: 'FAVORITE_MARKETS_TOGGLE',
    INDICATOR_ADDED: 'INDICATOR_ADDED',
    INDICATOR_DELETED: 'INDICATOR_DELETED',
    INDICATOR_INFO_CLOSED: 'INDICATOR_INFO_CLOSED',
    INDICATOR_INFO_OPEN: 'INDICATOR_INFO_OPEN',
    INDICATOR_SEARCH: 'INDICATOR_SEARCH',
    INDICATOR_SETTINGS_OPEN: 'INDICATOR_SETTINGS_OPEN',
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

export const getChartAnalyticsData = (state: keyof typeof STATE_TYPES, option: TStateChangeOption) => {
    const {
        indicator_type_name,
        indicators_category_name,
        is_favorite,
        is_info_open,
        is_open,
        chart_type_name,
        market_type_name,
        search_string,
        tab_market_name,
        time_interval_name,
    } = option;
    const open_close_action = is_open ? 'open' : 'close';
    const chart_event_type = 'ce_chart_types_form';
    const market_event_type = 'ce_market_types_form';
    const indicators_event_type = 'ce_indicators_types_form';

    if (chart_type_name && time_interval_name) {
        const payload = {
            data: {
                action: '',
                chart_type_name,
                time_interval_name,
            },
            event_type: chart_event_type,
        };
        if (state === STATE_TYPES.CHART_MODE_TOGGLE) {
            payload.data.action = open_close_action;
            return payload;
        } else if (state === STATE_TYPES.CHART_TYPE_CHANGE) {
            payload.data.action = 'choose_chart_type';
            return payload;
        } else if (state === STATE_TYPES.CHART_INTERVAL_CHANGE) {
            payload.data.action = 'choose_time_interval';
            return payload;
        }
    }
    if (indicator_type_name && indicators_category_name) {
        const payload = {
            data: {
                action: '',
                indicator_type_name,
                indicators_category_name,
            },
            event_type: indicators_event_type,
        };
        if (state === STATE_TYPES.INDICATOR_DELETED) {
            payload.data.action = 'delete_active';
            return payload;
        } else if (state === STATE_TYPES.INDICATOR_SETTINGS_OPEN) {
            payload.data.action = 'edit_active';
            return payload;
        } else if (state === STATE_TYPES.INDICATOR_INFO_OPEN) {
            payload.data.action = 'info_open';
            return payload;
        } else if (state === STATE_TYPES.INDICATOR_INFO_CLOSED) {
            payload.data.action = 'info_close';
            return payload;
        }
    }
    if (state === STATE_TYPES.INDICATORS_MODAL_TOGGLE && 'is_open' in option) {
        return {
            data: { action: open_close_action },
            event_type: indicators_event_type,
        };
    }
    if (state === STATE_TYPES.INDICATOR_ADDED && indicator_type_name) {
        return {
            data: {
                action: 'add_active',
                indicator_type_name,
                indicators_category_name,
                subform_name: is_info_open ? 'indicators_info' : 'indicators_type',
            },
            event_type: indicators_event_type,
        };
    }
    if (option.search_string && (state === STATE_TYPES.MARKET_SEARCH || state === STATE_TYPES.INDICATOR_SEARCH)) {
        return {
            data: {
                action: 'search',
                search_string,
            },
            event_type: state === STATE_TYPES.MARKET_SEARCH ? market_event_type : indicators_event_type,
        };
    }
    if (state === STATE_TYPES.MARKETS_LIST_TOGGLE && 'is_open' in option) {
        return {
            data: {
                action: open_close_action,
                market_type_name,
            },
            event_type: market_event_type,
        };
    }
    if (state === STATE_TYPES.SYMBOL_CHANGE && market_type_name) {
        return {
            data: {
                action: 'choose_market_type',
                market_type_name,
                tab_market_name,
            },
            event_type: market_event_type,
        };
    }
    if (state === STATE_TYPES.MARKET_INFO_REDIRECT && tab_market_name) {
        return {
            data: {
                action: 'info_redirect',
                tab_market_name,
            },
            event_type: market_event_type,
        };
    }
    if (state === STATE_TYPES.FAVORITE_MARKETS_TOGGLE && 'is_favorite' in option) {
        return {
            data: {
                action: is_favorite ? 'add_to_favorites' : 'delete_from_favorites',
                market_type_name,
            },
            event_type: market_event_type,
        };
    }
    return {};
};
