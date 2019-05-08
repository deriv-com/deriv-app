const addComma        = require('./currency').addComma;
const isCallputspread = require('../pages/trade/callputspread').isCallputspread;
const isReset         = require('../pages/trade/reset').isReset;
const localize        = require('../../_common/localize').localize;

const ChartSettings = (() => {
    let chart_options,
        labels,
        txt_subtitle;

    const common_horizontal_line_style = 'margin-bottom: 3px; margin-left: 10px; margin-right: 5px; height: 0; width: 20px; border: 0; border-bottom: 2px; display: inline-block;';
    const common_vertical_line_style   = 'margin-bottom: -3px; margin-left: 10px; margin-right: 5px; height: 15px; width: 5px; border: 0; border-left: 2px; display: inline-block;';
    const common_spot_style            = 'margin-left: 10px; margin-right: 5px; display: inline-block; border-radius: 6px;';

    // display a guide for clients to know what each line/spot in chart means
    const setLabels = (params) => {
        labels = labels || { // needs to be inside setLabels function so localize works
            barrier_line : `<div class='nowrap gr-padding-10 gr-parent'><span style="${common_horizontal_line_style} border-color: green; border-style: solid;"></span>${localize('Barrier')}&nbsp;</div>`,
            barrier_spot : `<div class='nowrap gr-padding-10 gr-parent'><span style="${common_horizontal_line_style} border-color: green; border-style: dotted;"></span>${localize('Barrier')}&nbsp;</div>`,
            entry_spot   : `<div class='nowrap gr-padding-10 gr-parent'><span style="${common_spot_style} border: 3px solid orange; width: 4px; height: 4px;"></span>${localize('Entry Spot')}&nbsp;</div>`,
            exit_spot    : `<div class='nowrap gr-padding-10 gr-parent'><span style="${common_spot_style} background-color: orange; width:10px; height: 10px;"></span>${localize('Exit Spot')}&nbsp;</div>`,
            delay        : `<div class='nowrap gr-padding-10 gr-parent delay'><span class="chart-delay">${localize('Charting for this underlying is delayed')}&nbsp;</span></div>`,
            payout_range : `<div class='nowrap gr-padding-10 gr-parent'><span class="chart-payout-range"></span>${localize('Payout Range')}&nbsp;</div>`,
            purchase_time: `<div class='nowrap gr-padding-10 gr-parent'><span style="${common_vertical_line_style} border-color: #7cb5ec; border-style: solid;"></span>${localize('Purchase Time')}&nbsp;</div>`,
            reset_barrier: `<div class='nowrap gr-padding-10 gr-parent'><span style="${common_horizontal_line_style} border-color: green; border-style: solid;"></span>${localize('Reset Barrier')}&nbsp;</div>`,
            reset_time   : `<div class='nowrap gr-padding-10 gr-parent'><span style="${common_vertical_line_style} border-color: #e98024; border-color: #000; border-style: solid;"></span>${localize('Reset Time')}&nbsp;</div>`,
            selected_tick: `<div class='nowrap gr-padding-10 gr-parent'><span style="margin-left: 10px; margin-right: 5px; display: inline-block; border-radius: 6px; background-color: orange; width:10px; height: 10px;"></span>${localize('Selected Tick')}&nbsp;</div>`,

            // need to pass is_tick_trade params explicitly to return correct label when switching between ticks and non-ticks charts
            getEndTime  : (is_tick_trade) => `<div class='nowrap gr-padding-10 gr-parent'><span style="${common_vertical_line_style} border-color: #e98024; border-style: dashed;"></span>${is_tick_trade ? localize('Exit Spot') : localize('End Time')}&nbsp;</div>`,
            getStartTime: (is_tick_trade) => `<div class='nowrap gr-padding-10 gr-parent'><span style="${common_vertical_line_style} border-color: #e98024; border-style: solid;"></span>${is_tick_trade ? localize('Entry Spot') : localize('Start Time')}&nbsp;</div>`,
        };

        const is_high_low_ticks = params.contract_type === 'highlowticks';
        const barrier_style     = params.is_tick_trade ? labels.barrier_line : labels.barrier_spot;
        const barrier           = params.is_reset_barrier ? labels.reset_barrier : barrier_style;
        const start_time        = labels.getStartTime(params.is_tick_trade);
        txt_subtitle = (params.is_chart_delayed ? labels.delay : '') +
            (params.is_forward_starting ? labels.purchase_time : '') +
            (params.is_sold_before_start ? '' : start_time) +
            (params.is_tick_type ? ((params.is_sold_before_start || params.is_tick_trade) ? '' : labels.entry_spot) : '') +
            ((params.has_barrier && !params.is_sold_before_start) ? barrier : '') +
            (params.is_tick_type ? ((params.is_user_sold || params.is_tick_trade) ? '' : labels.exit_spot) : '') +
            (isReset(params.contract_type) ? labels.reset_time : '') +
            (is_high_low_ticks ? labels.selected_tick : '') +
            (params.show_end_time ? labels.getEndTime(params.is_tick_trade) : '') +
            (isCallputspread(params.contract_type) ? labels.payout_range : '');
    };

    const setChartOptions = (params) => {
        chart_options = {
            chart: {
                animation      : params.has_animation || false,
                backgroundColor: null, /* make background transparent */
                borderWidth    : 0,
                events         : { ...(params.events || {}) },
                height         : params.height,
                marginLeft     : 70,
                marginRight    : params.margin_right || 30,
                marginTop      : params.margin_top || (window.innerWidth <= 480 ? 120 : 70),
                renderTo       : params.el,
                ...(params.width && { type: params.width }),
            },
            credits    : { enabled: false },
            exporting  : { enabled: false },
            legend     : { enabled: false },
            plotOptions: {
                candlestick: {
                    color      : 'red',
                    lineColor  : 'black',
                    shadow     : true,
                    upColor    : 'green',
                    upLineColor: 'black',
                },
                line: {
                    marker: {
                        enabled: true,
                        radius : params.radius,
                    },
                },
            },
            rangeSelector: { enabled: false },
            series       : [{
                connectNulls  : true,
                cropThreshold : Infinity,
                data          : params.data,
                name          : params.title,
                softThreshold : false,
                turboThreshold: Infinity,
                type          : params.type,
                ...(params.has_zone && {
                    zoneAxis: 'x',
                    // zones are used to display color of the line
                    zones   : [{
                        // make the line grey until it reaches entry time or start time if entry spot time is not yet known
                        value: params.entry_time,
                        color: '#ccc',
                    }, {
                        // make the line default color until exit time is reached
                        value: params.exit_time,
                        color: '',
                    }, {
                        // make the line grey again after trade ended
                        color: '#ccc',
                    }],
                }),
            }],
            subtitle: {
                ...(params.user_sold && { style: { left: '180px' } }),
                text   : ChartSettings.getSubtitle(),
                useHTML: true,
            },
            title: {
                style: { fontSize: '16px' },
                text : params.title,
            },
            tooltip: {
                ...(params.tooltip || {}),
                useHTML: true,
            },
            xAxis: {
                ...(params.x_axis || {}),
            },
            yAxis: {
                labels: {
                    align: 'left',
                    formatter() {
                        return addComma(this.value.toFixed(params.display_decimals));
                    },
                    x: -60,
                },
                maxPadding: 0.05,
                minPadding: 0.05,
                opposite  : false,
                title     : '',
            },
        };
        if (params.has_zone && params.user_sold) {
            chart_options.series[0].zones.pop();
        }
    };

    return {
        getChartOptions: () => chart_options,
        getSubtitle    : () => txt_subtitle,
        setChartOptions,
        setLabels,
    };
})();

module.exports = ChartSettings;
