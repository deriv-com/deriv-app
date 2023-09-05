import { STATE_TYPES, getChartAnalyticsData } from '../chart';

describe('getChartAnalyticsData', () => {
    const mocked_data = {
        indicator_type_name: 'Donchian Channel',
        indicators_category_name: 'Volatility',
        is_favorite: true,
        is_info_open: true,
        is_open: true,
        chart_type_name: 'area',
        market_type_name: 'Volatility 75 (1s) Index',
        search_string: 'test',
        tab_market_name: 'derived-synthetics-continuous_indices',
        time_interval_name: '1 minute',
    };
    const chart_event_type = 'ce_chart_types_form';
    const market_event_type = 'ce_market_types_form';
    const indicators_event_type = 'ce_indicators_types_form';
    it('should return empty object if args are empty', () => {
        expect(getChartAnalyticsData('' as keyof typeof STATE_TYPES, {})).toEqual({});
    });
    it('should return correct object with data and event_type for STATE_TYPES.CHART_MODE_TOGGLE', () => {
        expect(
            getChartAnalyticsData(STATE_TYPES.CHART_MODE_TOGGLE, {
                is_open: mocked_data.is_open,
                chart_type_name: mocked_data.chart_type_name,
                time_interval_name: mocked_data.time_interval_name,
            })
        ).toEqual({
            data: {
                action: 'open',
                chart_type_name: mocked_data.chart_type_name,
                time_interval_name: mocked_data.time_interval_name,
            },
            event_type: chart_event_type,
        });
        expect(
            getChartAnalyticsData(STATE_TYPES.CHART_MODE_TOGGLE, {
                is_open: false,
                chart_type_name: mocked_data.chart_type_name,
                time_interval_name: mocked_data.time_interval_name,
            })
        ).toEqual({
            data: {
                action: 'close',
                chart_type_name: mocked_data.chart_type_name,
                time_interval_name: mocked_data.time_interval_name,
            },
            event_type: chart_event_type,
        });
        expect(getChartAnalyticsData(STATE_TYPES.CHART_MODE_TOGGLE, {})).toEqual({});
    });
    it('should return correct object with data and event_type for STATE_TYPES.CHART_TYPE_CHANGE', () => {
        expect(
            getChartAnalyticsData(STATE_TYPES.CHART_TYPE_CHANGE, {
                chart_type_name: mocked_data.chart_type_name,
                time_interval_name: mocked_data.time_interval_name,
            })
        ).toEqual({
            data: {
                action: 'choose_chart_type',
                chart_type_name: mocked_data.chart_type_name,
                time_interval_name: mocked_data.time_interval_name,
            },
            event_type: chart_event_type,
        });
        expect(getChartAnalyticsData(STATE_TYPES.CHART_TYPE_CHANGE, {})).toEqual({});
    });
    it('should return correct object with data and event_type for STATE_TYPES.CHART_INTERVAL_CHANGE', () => {
        expect(
            getChartAnalyticsData(STATE_TYPES.CHART_INTERVAL_CHANGE, {
                chart_type_name: mocked_data.chart_type_name,
                time_interval_name: mocked_data.time_interval_name,
            })
        ).toEqual({
            data: {
                action: 'choose_time_interval',
                chart_type_name: mocked_data.chart_type_name,
                time_interval_name: mocked_data.time_interval_name,
            },
            event_type: chart_event_type,
        });
        expect(getChartAnalyticsData(STATE_TYPES.CHART_INTERVAL_CHANGE, {})).toEqual({});
    });
    it('should return correct object with data and event_type for STATE_TYPES.INDICATOR_DELETED', () => {
        expect(
            getChartAnalyticsData(STATE_TYPES.INDICATOR_DELETED, {
                indicator_type_name: mocked_data.indicator_type_name,
                indicators_category_name: mocked_data.indicators_category_name,
            })
        ).toEqual({
            data: {
                action: 'delete_active',
                indicator_type_name: mocked_data.indicator_type_name,
                indicators_category_name: mocked_data.indicators_category_name,
            },
            event_type: indicators_event_type,
        });
        expect(getChartAnalyticsData(STATE_TYPES.INDICATOR_DELETED, {})).toEqual({});
    });
    it('should return correct object with data and event_type for STATE_TYPES.INDICATOR_SETTINGS_OPEN', () => {
        expect(
            getChartAnalyticsData(STATE_TYPES.INDICATOR_SETTINGS_OPEN, {
                indicator_type_name: mocked_data.indicator_type_name,
                indicators_category_name: mocked_data.indicators_category_name,
            })
        ).toEqual({
            data: {
                action: 'edit_active',
                indicator_type_name: mocked_data.indicator_type_name,
                indicators_category_name: mocked_data.indicators_category_name,
            },
            event_type: indicators_event_type,
        });
        expect(getChartAnalyticsData(STATE_TYPES.INDICATOR_SETTINGS_OPEN, {})).toEqual({});
    });
    it('should return correct object with data and event_type for STATE_TYPES.INDICATOR_INFO_TOGGLE', () => {
        expect(
            getChartAnalyticsData(STATE_TYPES.INDICATOR_INFO_TOGGLE, {
                is_info_open: mocked_data.is_info_open,
                indicator_type_name: mocked_data.indicator_type_name,
                indicators_category_name: mocked_data.indicators_category_name,
            })
        ).toEqual({
            data: {
                action: 'info_open',
                indicator_type_name: mocked_data.indicator_type_name,
                indicators_category_name: mocked_data.indicators_category_name,
            },
            event_type: indicators_event_type,
        });
        expect(
            getChartAnalyticsData(STATE_TYPES.INDICATOR_INFO_TOGGLE, {
                indicator_type_name: mocked_data.indicator_type_name,
                indicators_category_name: mocked_data.indicators_category_name,
            })
        ).toEqual({
            data: {
                action: 'info_close',
                indicator_type_name: mocked_data.indicator_type_name,
                indicators_category_name: mocked_data.indicators_category_name,
            },
            event_type: indicators_event_type,
        });
        expect(getChartAnalyticsData(STATE_TYPES.INDICATOR_INFO_TOGGLE, {})).toEqual({});
    });
    it('should return correct object with data and event_type for STATE_TYPES.INDICATORS_MODAL_TOGGLE', () => {
        expect(
            getChartAnalyticsData(STATE_TYPES.INDICATORS_MODAL_TOGGLE, {
                is_open: mocked_data.is_open,
            })
        ).toEqual({
            data: { action: 'open' },
            event_type: indicators_event_type,
        });
        expect(
            getChartAnalyticsData(STATE_TYPES.INDICATORS_MODAL_TOGGLE, {
                is_open: false,
            })
        ).toEqual({
            data: { action: 'close' },
            event_type: indicators_event_type,
        });
        expect(getChartAnalyticsData(STATE_TYPES.INDICATORS_MODAL_TOGGLE, {})).toEqual({});
    });
    it('should return correct object with data and event_type for STATE_TYPES.INDICATOR_ADDED', () => {
        expect(
            getChartAnalyticsData(STATE_TYPES.INDICATOR_ADDED, {
                is_info_open: mocked_data.is_info_open,
                indicator_type_name: mocked_data.indicator_type_name,
                indicators_category_name: mocked_data.indicators_category_name,
            })
        ).toEqual({
            data: {
                action: 'add_active',
                indicator_type_name: mocked_data.indicator_type_name,
                indicators_category_name: mocked_data.indicators_category_name,
                subform_name: 'indicators_info',
            },
            event_type: indicators_event_type,
        });
        expect(
            getChartAnalyticsData(STATE_TYPES.INDICATOR_ADDED, {
                is_info_open: false,
                indicator_type_name: mocked_data.indicator_type_name,
                indicators_category_name: mocked_data.indicators_category_name,
            })
        ).toEqual({
            data: {
                action: 'add_active',
                indicator_type_name: mocked_data.indicator_type_name,
                indicators_category_name: mocked_data.indicators_category_name,
                subform_name: 'indicators_type',
            },
            event_type: indicators_event_type,
        });
        expect(getChartAnalyticsData(STATE_TYPES.INDICATOR_ADDED, {})).toEqual({});
    });
    it('should return correct object with data and event_type for STATE_TYPES.INDICATOR_SEARCH', () => {
        expect(
            getChartAnalyticsData(STATE_TYPES.INDICATOR_SEARCH, {
                search_string: mocked_data.search_string,
            })
        ).toEqual({
            data: {
                action: 'search',
                search_string: mocked_data.search_string,
            },
            event_type: indicators_event_type,
        });
        expect(getChartAnalyticsData(STATE_TYPES.INDICATOR_SEARCH, {})).toEqual({});
    });
    it('should return correct object with data and event_type for STATE_TYPES.MARKET_SEARCH', () => {
        expect(
            getChartAnalyticsData(STATE_TYPES.MARKET_SEARCH, {
                search_string: mocked_data.search_string,
            })
        ).toEqual({
            data: {
                action: 'search',
                search_string: mocked_data.search_string,
            },
            event_type: market_event_type,
        });
        expect(getChartAnalyticsData(STATE_TYPES.MARKET_SEARCH, {})).toEqual({});
    });
    it('should return correct object with data and event_type for STATE_TYPES.MARKETS_LIST_TOGGLE', () => {
        expect(
            getChartAnalyticsData(STATE_TYPES.MARKETS_LIST_TOGGLE, {
                is_open: mocked_data.is_open,
                market_type_name: mocked_data.market_type_name,
            })
        ).toEqual({
            data: {
                action: 'open',
                market_type_name: mocked_data.market_type_name,
            },
            event_type: market_event_type,
        });
        expect(
            getChartAnalyticsData(STATE_TYPES.MARKETS_LIST_TOGGLE, {
                is_open: false,
                market_type_name: mocked_data.market_type_name,
            })
        ).toEqual({
            data: {
                action: 'close',
                market_type_name: mocked_data.market_type_name,
            },
            event_type: market_event_type,
        });
        expect(getChartAnalyticsData(STATE_TYPES.MARKETS_LIST_TOGGLE, {})).toEqual({});
    });
    it('should return correct object with data and event_type for STATE_TYPES.SYMBOL_CHANGE', () => {
        expect(
            getChartAnalyticsData(STATE_TYPES.SYMBOL_CHANGE, {
                tab_market_name: mocked_data.tab_market_name,
                market_type_name: mocked_data.market_type_name,
            })
        ).toEqual({
            data: {
                action: 'choose_market_type',
                tab_market_name: mocked_data.tab_market_name,
                market_type_name: mocked_data.market_type_name,
            },
            event_type: market_event_type,
        });
        expect(getChartAnalyticsData(STATE_TYPES.SYMBOL_CHANGE, {})).toEqual({});
    });
    it('should return correct object with data and event_type for STATE_TYPES.MARKET_INFO_REDIRECT', () => {
        expect(
            getChartAnalyticsData(STATE_TYPES.MARKET_INFO_REDIRECT, {
                tab_market_name: mocked_data.tab_market_name,
            })
        ).toEqual({
            data: {
                action: 'info_redirect',
                tab_market_name: mocked_data.tab_market_name,
            },
            event_type: market_event_type,
        });
        expect(getChartAnalyticsData(STATE_TYPES.MARKET_INFO_REDIRECT, {})).toEqual({});
    });
    it('should return correct object with data and event_type for STATE_TYPES.FAVORITE_MARKETS_TOGGLE', () => {
        expect(
            getChartAnalyticsData(STATE_TYPES.FAVORITE_MARKETS_TOGGLE, {
                is_favorite: mocked_data.is_favorite,
                market_type_name: mocked_data.market_type_name,
            })
        ).toEqual({
            data: {
                action: 'add_to_favorites',
                market_type_name: mocked_data.market_type_name,
            },
            event_type: market_event_type,
        });
        expect(
            getChartAnalyticsData(STATE_TYPES.FAVORITE_MARKETS_TOGGLE, {
                is_favorite: false,
                market_type_name: mocked_data.market_type_name,
            })
        ).toEqual({
            data: {
                action: 'delete_from_favorites',
                market_type_name: mocked_data.market_type_name,
            },
            event_type: market_event_type,
        });
        expect(getChartAnalyticsData(STATE_TYPES.FAVORITE_MARKETS_TOGGLE, {})).toEqual({});
    });
});
