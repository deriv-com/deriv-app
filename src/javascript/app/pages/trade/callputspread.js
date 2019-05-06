const formatMoney = require('../../common/currency').formatMoney;

const constants = {
    slider: {
        height: 14,
        fill  : '#e98024',
        label : {
            color   : '#fff',
            fontSize: '9px',
            offsetY : 4,
            offsetX : 6,
        },
    },
    interval: {
        cap_width  : 10,
        stroke     : '#2a3052',
        strokeWidth: 2,
        label      : {
            color   : '#000',
            fontSize: '12px',
            offsetX : 2,
        },
        top_label: {
            offsetY: -4,
        },
        bottom_label: {
            offsetY: 13,
        },
    },
    barrier_series_name: 'barrier_points',
};

const Callputspread = (() => {
    const state = {
        el_slider               : null,
        el_slider_label         : null,
        el_interval             : null,
        el_interval_top_label   : null,
        el_interval_bottom_laber: null,
        chart                   : null,
        contract                : null,
    };

    /*
        METHODS THAT DRAW ON CHART:
    */

    const redrawInterval = () => {
        if (!state.chart || !state.contract) return;
        if (state.el_interval) {
            state.el_interval.destroy();
        }
        const { x, y0, y1, top_label, bottom_label } = calcIntervalState(state.chart, state.contract);
        const { cap_width, stroke, strokeWidth } = constants.interval;
        state.el_interval = state.chart.renderer
            .path(getIntervalPath(x, y0, y1, cap_width))
            .attr({
                stroke,
                'stroke-width': strokeWidth,
            })
            .add();
        if (state.el_interval_top_label) {
            state.el_interval_top_label.destroy();
        }
        if (state.el_interval_bottom_laber) {
            state.el_interval_bottom_laber.destroy();
        }
        const { color, fontSize, offsetX } = constants.interval.label;
        const label_styles = {
            color,
            fontSize,
            'z-index': -1,
        };
        state.el_interval_top_label = state.chart.renderer
            .text(top_label, x + offsetX, y0 + constants.interval.top_label.offsetY, true)
            .css(label_styles)
            .add();
        state.el_interval_bottom_laber = state.chart.renderer
            .text(bottom_label, x + offsetX, y1 + constants.interval.bottom_label.offsetY, true)
            .css(label_styles)
            .add();
    };

    const redrawSlider = () => {
        if (!state.chart || !state.contract) return;
        if (state.el_slider) {
            state.el_slider.destroy();
        }
        const { x, y, width } = calcSliderState(state.chart, state.contract);
        const { height, fill } = constants.slider;
        state.el_slider = state.chart.renderer
            .path(getSliderPath(x, y, width, height))
            .attr({
                fill,
                'stroke-width': 0,
            })
            .add();
        if (state.el_slider_label) {
            state.el_slider_label.destroy();
        }
        const { color, fontSize, offsetX, offsetY } = constants.slider.label;
        state.el_slider_label = state.chart.renderer
            .text(
                formatMoney(state.contract.currency, state.contract.bid_price),
                x + width / 2 + offsetX,
                y + offsetY,
                true
            )
            .attr({ align: 'center' })
            .css({ color, fontSize })
            .add();
    };

    /*
        Calc Functions (no side effects!):
    */

    const calcMarginRight = (contract) => {
        const formatted_max_payout = formatMoney(contract.currency, contract.payout, true);
        // margin size is based on max payout char length
        return 15 + 7.5 * formatted_max_payout.length;
    };

    const calcSliderState = (chart, contract) => {
        const plot_end_x = chart.plotWidth + chart.plotLeft;
        const x_offset = (constants.interval.cap_width + constants.interval.strokeWidth) / 2;
        const [high_barrier_y, low_barrier_y] = chart.series
            .find(series => series.name === constants.barrier_series_name)
            .data
            .map(point => point.plotY + chart.plotTop);
        const { contract_type, payout, bid_price } = contract;
        const k = contract_type === 'CALLSPREAD'
            ? 1 - (bid_price / payout)
            :      bid_price / payout;
        return {
            x    : plot_end_x + x_offset,
            y    : high_barrier_y + (low_barrier_y - high_barrier_y) * k,
            width: calcMarginRight(contract) - 17,
        };
    };

    const calcIntervalState = (chart, contract) => {
        const plot_end_x = chart.plotWidth + chart.plotLeft;
        const [high_barrier_y, low_barrier_y] = chart.series
            .find(series => series.name === constants.barrier_series_name)
            .data
            .map(point => point.plotY + chart.plotTop);
        const [display_maximum_payout, display_minimum_payout] = [contract.payout, 0]
            .map(payout => formatMoney(contract.currency, payout));
        const [top_label, bottom_label] = contract.contract_type === 'CALLSPREAD'
            ? [display_maximum_payout, display_minimum_payout]
            : [display_minimum_payout, display_maximum_payout];
        return {
            x : plot_end_x,
            y0: high_barrier_y,
            y1: low_barrier_y,
            top_label,
            bottom_label,
        };
    };

    /*
        PUBLIC API:
    */

    const init = (chart, contract) => {
        // Adds invisible points with barrier coordinates,
        // so barriers are always visible on the chart
        const x0 = contract.date_start * 1000;
        const { high_barrier, low_barrier } = contract;
        chart.addSeries({
            name  : constants.barrier_series_name,
            type  : 'scatter',
            marker: { enabled: false },
            data  : [
                {
                    y: +high_barrier,
                    x: x0,
                },
                {
                    y: +low_barrier,
                    x: x0,
                },
            ],
        });
        update(chart, contract);
    };

    const isCallputspread = (contract_type) => (
        /^(CALLSPREAD|PUTSPREAD)$/i.test(contract_type)
    );

    const getChartOptions = (contract) => ({
        events      : { redraw: () => update() },
        margin_right: calcMarginRight(contract),
    });

    const update = (chart, contract) => {
        state.chart = chart || state.chart;
        state.contract = contract || state.contract;
        redrawInterval();
        redrawSlider();
    };

    return {
        init,
        isCallputspread,
        getChartOptions,
        update,
    };
})();

/*
    HELPER FUNCTIONS THAT RETURN SVG PATH:
*/

const getSliderPath = (x, y, width, height) => {
    const half = height / 2;
    return [
        'M', x, y,
        'l', half, -half,
        'h', width,
        'v', height,
        'h', -width,
        'z',
    ];
};

const getIntervalPath = (x, y0, y1, cap_width) => {
    const half_cap = cap_width / 2;
    return [
        'M', x, y0,
        'h', cap_width,
        'm', -half_cap, 0,
        'v', (y1 - y0),
        'm', -half_cap, 0,
        'h', cap_width,
    ];
};

module.exports = Callputspread;
