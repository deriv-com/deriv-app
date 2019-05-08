const getAllSymbols    = require('../symbols').getAllSymbols;
const MBDefaults       = require('../../mb_trade/mb_defaults');
const getElementById   = require('../../../../_common/common_functions').getElementById;
const getLanguage      = require('../../../../_common/language').get;
const localize         = require('../../../../_common/localize').localize;
const State            = require('../../../../_common/storage').State;
const getPropertyValue = require('../../../../_common/utility').getPropertyValue;
const Config           = require('../../../../config');

const WebtraderChart = (() => {
    let chart,
        WebtraderCharts,
        is_initialized;

    const showChart = () => {
        if (State.get('is_chart_allowed')) {
            setChart();
        } else {
            cleanupChart();
            $('#trade_live_chart').hide();
            $('#chart-error').text(localize('Chart is not available for this underlying.')).show();
        }
    };

    const cleanupChart = () => {
        if (typeof getPropertyValue(chart, ['actions', 'destroy']) === 'function') {
            chart.actions.destroy();
        }
        chart = undefined;
    };

    const setChart = () => {
        const is_mb_trading  = State.get('is_mb_trading');
        const new_underlying = is_mb_trading ? $('#underlying').attr('value') : getElementById('underlying').value;
        if (($('#tab_graph').hasClass('active') || is_mb_trading) &&
            (!chart || chart.data().instrumentCode !== new_underlying ||
                (is_mb_trading &&
                    (getChartSettings().time_frame !== chart.data().timePeriod ||
                    getChartSettings().chart_type !== chart.data().type)))) {
            cleanupChart();
            initChart();
        }
        $('#chart-error').hide();
        $('#trade_live_chart').show();
    };

    const initChart = () => {
        if (!State.get('is_chart_allowed')) return;
        if (!is_initialized) {
            require.ensure(['highstock-release'], () => {
                require.ensure([], (require) => {
                    WebtraderCharts = require('@binary-com/webtrader-charts');
                    WebtraderCharts.init({
                        server: Config.getSocketURL(),
                        appId : Config.getAppId(),
                        lang  : getLanguage().toLowerCase(),
                    });
                    is_initialized = true;
                    addChart();
                }, 'webtrader-charts');
            }, 'highstock');
        } else {
            addChart();
        }
    };

    const addChart = () => {
        const is_mb_trading    = State.get('is_mb_trading');
        const $underlying      = $('#underlying');
        const $underlying_code = is_mb_trading ? $underlying.attr('value') : $underlying.val();
        const $underlying_name = is_mb_trading ? $underlying.find('.current .name').text() : getAllSymbols()[$underlying_code];

        const chart_config = {
            instrumentCode    : $underlying_code,
            instrumentName    : $underlying_name,
            showInstrumentName: true,
            timePeriod        : getChartSettings().time_frame,
            type              : getChartSettings().chart_type,
            lang              : getLanguage().toLowerCase(),
            showShare         : !is_mb_trading,
        };

        chart = WebtraderCharts.chartWindow.addNewChart($('#webtrader_chart'), chart_config);
    };

    const redrawChart = () => {
        if (typeof getPropertyValue(chart, ['actions', 'reflow']) === 'function') {
            chart.actions.reflow();
        }
    };

    const getChartSettings = () => {
        let chart_settings = { time_frame: '1t', chart_type: 'line' };
        if (State.get('is_mb_trading')) {
            const period     = MBDefaults.get('period').split('_')[2].substr(0, 2).toUpperCase();
            const period_map = {
                '5H': { time_frame: '1m',  chart_type: 'line' },
                '0D': { time_frame: '30m', chart_type: 'ohlc' },
                '1W': { time_frame: '1d',  chart_type: 'ohlc' },
                '1M': { time_frame: '1d',  chart_type: 'candlestick' },
                '3M': { time_frame: '1d',  chart_type: 'candlestick' },
                '1Y': { time_frame: '1d',  chart_type: 'candlestick' },
            };
            chart_settings   = period_map[period] || chart_settings;
        }
        return chart_settings;
    };

    return {
        showChart,
        cleanupChart,
        setChart,
        redrawChart,
    };
})();

module.exports = WebtraderChart;
