const moment               = require('moment');
const HighchartUI          = require('./charts/highchart.ui');
const requireHighstock     = require('./common').requireHighstock;
const Reset                = require('./reset');
const Tick                 = require('./tick');
const updatePurchaseStatus = require('./update_values').updatePurchaseStatus;
const ViewPopupUI          = require('../user/view_popup/view_popup.ui');
const BinarySocket         = require('../../base/socket');
const ChartSettings        = require('../../common/chart_settings');
const addComma             = require('../../../_common/base/currency_base').addComma;
const CommonFunctions      = require('../../../_common/common_functions');
const localize             = require('../../../_common/localize').localize;
const getPropertyValue     = require('../../../_common/utility').getPropertyValue;

const TickDisplay = (() => {
    let number_of_ticks,
        display_symbol,
        contract_start_ms,
        contract_category,
        should_set_barrier,
        barrier,
        display_decimals,
        show_contract_result,
        price,
        payout,
        ticks_needed,
        x_indicators,
        chart,
        Highcharts,
        applicable_ticks,
        contract_start_moment,
        counter,
        spots_list,
        tick_init,
        reset_spot_plotted,
        response_id,
        contract,
        selected_tick;

    let id_render = 'tick_chart';

    const winning_color = 'rgba(46, 136, 54, 0.2)';
    const losing_color  = 'rgba(204, 0, 0, 0.1)';

    const color  = 'orange';
    const marker = {
        fillColor: color,
        lineColor: color,
        lineWidth: 3,
        radius   : 4,
        states   : { hover: { fillColor: color, lineColor: color, lineWidth: 3, radius: 4 } },
    };

    const initialize = (data, options) => {
        // setting up globals
        applicable_ticks     = [];
        number_of_ticks      = parseInt(data.number_of_ticks);
        display_symbol       = data.display_symbol;
        contract_start_ms    = parseInt(data.contract_start) * 1000;
        contract_category    = data.contract_category;
        should_set_barrier   = !contract_category.match('digits|runs');
        display_decimals     = data.display_decimals || 2;
        show_contract_result = data.show_contract_result;
        reset_spot_plotted   = false;
        barrier              = data.barrier || undefined;

        if (data.id_render) {
            id_render = data.id_render;
        }

        if (data.show_contract_result) {
            price  = parseFloat(data.price);
            payout = parseFloat(data.payout);
        }

        selected_tick = '';
        if (/^(tickhigh|ticklow)_/i.test(data.shortcode)) {
            const arr_shortcode = data.shortcode.split('_');
            selected_tick = arr_shortcode[arr_shortcode.length - 1];
        }

        setXIndicators();
        requireHighstock((Highstock) => {
            Highcharts = Highstock;
            const is_small_width     = window.innerWidth < 480;
            const overlay_margin_top = is_small_width ? 70 : 40;
            const overlay_height     = is_small_width ? 200 : 170;
            initializeChart({
                display_decimals,
                data         : [],
                el           : id_render,
                events       : { load: () => { plot(); } },
                margin_top   : show_contract_result ? overlay_margin_top : null,
                has_animation: show_contract_result,
                height       : show_contract_result ? overlay_height : null,
                radius       : 4,
                title        : show_contract_result ? '' : display_symbol,
                tooltip      : {
                    formatter() {
                        const new_y = addComma(this.y.toFixed(display_decimals));
                        const mom   = moment.utc(applicable_ticks[this.x].epoch * 1000).format('dddd, MMM D, HH:mm:ss');
                        return `<div class='tooltip-body'>${mom}<br/>${display_symbol} ${new_y}</div>`;
                    },
                },
                type  : 'line',
                width : data.width ? data.width : (show_contract_result ? 394 : null),
                x_axis: { labels: { enabled: false }, ...(show_contract_result ? { max: number_of_ticks + 1, min: 0, type: 'linear' } : {}) },
            }, options);
        });
    };

    const setXIndicators = () => {
        const exit_tick_index = number_of_ticks - 1;
        if (contract_category.match('asian')) {
            ticks_needed = number_of_ticks;
            x_indicators = {
                _0: { label: localize('Entry Spot'), id: 'start_tick' },
            };
            x_indicators[`_${exit_tick_index}`] = {
                label    : localize('Exit Spot'),
                id       : 'exit_tick',
                dashStyle: 'Dash',
            };
        } else if (contract_category.match(/callput|reset/i)) {
            ticks_needed = number_of_ticks + 1;
            x_indicators = {
                _0: { label: localize('Entry Spot'), id: 'entry_tick' },
            };
            x_indicators[`_${number_of_ticks}`] = {
                label    : localize('Exit Spot'),
                id       : 'exit_tick',
                dashStyle: 'Dash',
            };
            if (contract_category.match('reset')) {
                const reset_time_index = Math.floor(number_of_ticks / 2); // use index to draw ticks reset_time
                x_indicators[`_${reset_time_index}`] = {
                    index: reset_time_index,
                    label: localize('Reset Time'),
                    id   : 'reset_tick',
                    color: '#000',
                };
            }
        } else if (contract_category.match('touchnotouch')) {
            ticks_needed = number_of_ticks + 1;
            x_indicators = {
                _0: { label: localize('Entry Spot'), id: 'entry_tick' },
            };
        } else if (contract_category.match('highlowticks')) {
            ticks_needed = number_of_ticks;
            x_indicators = {
                _0: { label: localize('Entry Spot'), id: 'start_tick' },
            };
        } else if (contract_category.match('runs')) {
            ticks_needed = number_of_ticks + 1;
            x_indicators = {
                _0: { label: localize('Entry Spot'), id: 'entry_tick' },
            };
        } else {
            x_indicators = {};
        }
    };

    const initializeChart = (config, data) => {
        const has_reset_barrier = contract.entry_spot && contract.barrier &&
            Reset.isReset(contract_category) && Reset.isNewBarrier(contract.entry_spot, contract.barrier);
        Highcharts.setOptions({
            lang: { thousandsSep: ',' },
        });
        ChartSettings.setChartOptions(config);
        chart = new Highcharts.Chart(ChartSettings.getChartOptions());
        HighchartUI.updateLabels(chart, {
            contract_type   : contract_category,
            has_barrier     : should_set_barrier && contract_category !== 'highlowticks',
            is_reset_barrier: has_reset_barrier,
            is_tick_trade   : true,
            shortcode       : contract.shortcode,
            show_end_time   : true,
        });
        if (data) {
            dispatch(data);
        }
        let resize_timeout;
        const el_chart_container = CommonFunctions.getElementById(id_render);
        window.addEventListener('resize', (e) => {
            e.stopPropagation();
            if (!CommonFunctions.isVisible(el_chart_container)) return;
            clearTimeout(resize_timeout);
            resize_timeout = setTimeout(() => {
                const { offsetWidth, offsetHeight } = el_chart_container;
                chart.setSize(offsetWidth, offsetHeight);
            }, 250);
        });
    };

    const isRelativeBarrier = (barrier_str) => (/\+|-/.test(barrier_str));

    const addBarrier = () => {
        if (!should_set_barrier) {
            return;
        }

        const barrier_type = /^(asian|highlowticks)$/.test(contract_category) ? contract_category : 'static';

        let calculated_barrier = '';

        if (barrier_type === 'static') {
            const first_quote = applicable_ticks[0].quote;
            let barrier_quote = first_quote;
            if (barrier) {
                let final_barrier = Number(barrier).toFixed(parseInt(display_decimals));
                if (isRelativeBarrier(barrier)) {
                    // sometimes due to rounding issues, result is 1.009999 while it should be 1.01
                    final_barrier = Number(`${Math.round(`${barrier_quote + parseFloat(barrier)}e${display_decimals}`)}e-${display_decimals}`);
                }
                barrier_quote = final_barrier;
            } else if (contract && contract.barrier) {
                barrier_quote = parseFloat(contract.barrier);
            }

            chart.yAxis[0].addPlotLine({
                id   : 'tick-barrier',
                value: barrier_quote,
                label: {
                    text : `${localize('Barrier')} (${addComma(barrier_quote)})`,
                    align: Reset.isReset(contract_category) ? 'right' : 'center',
                    x    : Reset.isReset(contract_category) ? -60 : 0,
                },
                color : 'green',
                width : 2,
                zIndex: 2,
            });
            calculated_barrier = addComma(barrier_quote, parseInt(display_decimals));
            should_set_barrier = false;
        }

        if (barrier_type === 'asian') {
            const decimal_places = parseInt(display_decimals) + 1;
            let total = 0;
            for (let i = 0; i < applicable_ticks.length; i++) {
                total += parseFloat(applicable_ticks[i].quote);
            }
            // round calculated barrier
            const calc_barrier = (total / applicable_ticks.length).toFixed(decimal_places);

            chart.yAxis[0].removePlotLine('tick-barrier');
            chart.yAxis[0].addPlotLine({
                id   : 'tick-barrier',
                value: calc_barrier,
                color: 'green',
                label: {
                    text : `${localize('Average')} (${addComma(calc_barrier)})`,
                    align: 'center',
                },
                width : 2,
                zIndex: 2,
            });
            calculated_barrier = addComma(calc_barrier, decimal_places);
        }

        if (calculated_barrier) {
            CommonFunctions.elementInnerHtml(CommonFunctions.getElementById('contract_purchase_barrier'), `${localize('Barrier')}: ${calculated_barrier}`);
        }
    };

    const add = (indicator) => {
        chart.xAxis[0].addPlotLine({
            value    : indicator.index,
            id       : indicator.id,
            label    : { text: indicator.label, x: /start_tick|entry_tick/.test(indicator.id) ? -15 : 5 },
            color    : indicator.color || '#e98024',
            width    : 2,
            zIndex   : 2,
            dashStyle: indicator.dashStyle || '',
        });
    };

    const evaluateContractOutcome = () => {
        if (contract.status && contract.status !== 'open') {
            if (contract.status === 'won') {
                if (show_contract_result) {
                    $(`#${id_render}`).css('background-color', winning_color);
                }
                updatePurchaseStatus(payout, price, contract.profit, localize('This contract won'));
            } else if (contract.status === 'lost') {
                if (show_contract_result) {
                    $(`#${id_render}`).css('background-color', losing_color);
                }
                updatePurchaseStatus(0, -price, contract.profit, localize('This contract lost'));
            }

            addExitSpot();
        }

        if (Reset.isReset(contract_category) && Reset.isNewBarrier(contract.entry_spot, contract.barrier)) {
            plotResetSpot(+contract.barrier);
        }
    };

    const plot = () => {
        contract_start_moment = moment(contract_start_ms).utc();
        counter               = 0;
        applicable_ticks      = [];
    };

    const getDecimalPlaces = (number) => (
        number.toString().split('.')[1].length || 2
    );

    const dispatch = (data) => {
        const tick_chart = CommonFunctions.getElementById(id_render);

        if (!CommonFunctions.isVisible(tick_chart) || !data || (!data.tick && !data.history)) {
            return;
        }

        if (getPropertyValue(data, ['tick', 'id']) && document.getElementById('sell_content_wrapper')) {
            response_id = data.tick.id;
            ViewPopupUI.storeSubscriptionID(response_id);
        }

        let epoches,
            spots2,
            chart_display_decimals;

        if (document.getElementById('sell_content_wrapper')) {
            if (data.tick) {
                Tick.details(data);
                if (!chart_display_decimals) {
                    chart_display_decimals = getDecimalPlaces(data.tick.quote);
                }
            } else if (data.history) {
                if (!chart_display_decimals) {
                    chart_display_decimals = getDecimalPlaces(data.history.prices[0]);
                }
            }
            if (!tick_init && contract) {
                let category = 'callput';
                if (/asian/i.test(contract.shortcode)) {
                    category = 'asian';
                } else if (/touch/i.test(contract.shortcode)) {
                    category = 'touchnotouch';
                } else if (/reset/i.test(contract.shortcode)) {
                    category = 'reset';
                } else if (/^(tickhigh|ticklow)_/i.test(contract.shortcode)) {
                    category = 'highlowticks';
                } else if (/^(runhigh|runlow)/i.test(contract.shortcode)) {
                    category = 'runs';
                }

                initialize({
                    barrier,
                    symbol              : contract.underlying,
                    number_of_ticks     : contract.tick_count,
                    contract_category   : category,
                    longcode            : contract.longcode,
                    display_symbol      : contract.display_name,
                    contract_start      : contract.date_start,
                    display_decimals    : chart_display_decimals,
                    shortcode           : contract.shortcode,
                    show_contract_result: 0,
                }, data);
                spots_list = {};
                tick_init  = 'initialized';
                return;
            }
        }

        if (data.tick) {
            spots2  = Tick.spots();
            epoches = Object.keys(spots2).sort((a, b) => a - b);
        } else if (data.history) {
            epoches = data.history.times;
        }

        let has_finished = applicable_ticks && ticks_needed && applicable_ticks.length >= ticks_needed;
        if (contract_category.match('runs')) {
            has_finished = (applicable_ticks.length && contract.exit_tick_time) || false;
        }
        const has_sold = contract && contract.exit_tick_time && applicable_ticks
            && applicable_ticks.find(({ epoch }) => +epoch === +contract.exit_tick_time) !== undefined;

        if (!has_finished && !has_sold && (!data.tick || !contract.status || contract.status === 'open')) {
            for (let d = 0; d < epoches.length; d++) {
                let tick;
                if (data.tick) {
                    tick = {
                        epoch: parseInt(epoches[d]),
                        quote: parseFloat(spots2[epoches[d]]),
                    };
                } else if (data.history) {
                    tick = {
                        epoch: parseInt(data.history.times[d]),
                        quote: parseFloat(data.history.prices[d]),
                    };
                }

                const current_tick_count = applicable_ticks.length + 1;

                if (contract_start_moment && tick.epoch > contract_start_moment.unix() && !spots_list[tick.epoch]) {
                    if (!chart || !chart.series) return;
                    chart.series[0].addPoint([counter, tick.quote], true, false);

                    if (+selected_tick === current_tick_count) {
                        const points = chart.series[0].points;
                        points[points.length - 1].update({ marker });
                    }

                    applicable_ticks.push(tick);
                    spots_list[tick.epoch] = tick.quote;
                    const indicator_key    = `_${counter}`;

                    if (!x_indicators[indicator_key] && tick.epoch === +contract.exit_tick_time) {
                        x_indicators[indicator_key] = {
                            index    : counter,
                            label    : localize('Exit Spot'),
                            dashStyle: 'Dash',
                        };
                    } else if (current_tick_count === ticks_needed) {
                        HighchartUI.updateLabels(chart, {
                            contract_type   : contract_category,
                            has_barrier     : false,
                            is_reset_barrier: false,
                            is_tick_trade   : true,
                            shortcode       : contract.shortcode,
                            show_end_time   : true,
                        });
                    }

                    if (typeof x_indicators[indicator_key] !== 'undefined') {
                        x_indicators[indicator_key].index = counter;
                        add(x_indicators[indicator_key]);
                    }

                    addBarrier();
                    counter++;
                }
            }
            if (Reset.isReset(contract_category) && data.history) {
                plotResetSpot();
            }
        }
    };

    const removePlotLine = (id, type = 'y') => {
        if (!chart) return;
        chart[(`${type}Axis`)][0].removePlotLine(id);
    };

    const plotResetSpot = (r_barrier) => {
        if (reset_spot_plotted || !chart || !Reset.isReset(contract.contract_type)) return;

        const is_resetcall  = contract.contract_type === 'RESETCALL';
        const entry_barrier = contract.entry_spot;
        const reset_barrier = r_barrier || contract.barrier;

        if (!+entry_barrier || !+reset_barrier) return;

        if (+entry_barrier !== +reset_barrier) {
            removePlotLine('tick-barrier', 'y');

            chart.yAxis[0].addPlotLine({
                id    : 'tick-reset-barrier',
                value : +reset_barrier,
                label : { text: `${localize('Reset Barrier')} (${addComma(reset_barrier)})`, align: 'right', x: -60, y: is_resetcall ? 15 : -5 },
                color : 'green',
                width : 2,
                zIndex: 3,
            });
            chart.yAxis[0].addPlotLine({
                id       : 'tick-barrier',
                value    : +entry_barrier,
                label    : { text: `${localize('Barrier')} (${addComma(entry_barrier)})`,    align: 'right', x: -60, y: is_resetcall ? -5 : 15 },
                color    : 'green',
                width    : 2,
                zIndex   : 3,
                dashStyle: 'dot',
            });

            CommonFunctions.elementInnerHtml(CommonFunctions.getElementById('contract_purchase_barrier'), `${localize('Reset Barrier')}: ${addComma(reset_barrier, parseInt(display_decimals))}`);
            reset_spot_plotted = true;
            HighchartUI.updateLabels(chart, {
                contract_type   : contract_category,
                has_barrier     : true,
                is_reset_barrier: true,
                is_tick_trade   : true,
                shortcode       : contract.shortcode,
                show_end_time   : true,
            });
        }

        evaluateContractOutcome();
    };

    const addExitSpot = () => {
        if (!applicable_ticks || !contract) return;

        const index = applicable_ticks.findIndex(({ epoch }) => epoch === +contract.exit_tick_time);

        if (index === -1) return;

        const indicator_key = `_${index}`;

        if (x_indicators[indicator_key]) return;

        x_indicators[indicator_key] = {
            index,
            label    : localize('Exit Spot'),
            dashStyle: 'Dash',
        };

        add(x_indicators[indicator_key]);
    };

    const updateContract = (proposal_open_contract) => {
        contract = proposal_open_contract;
    };

    const updateChart = (data, proposal_open_contract) => {
        if (proposal_open_contract) {
            updateContract(proposal_open_contract);
        }

        if (data.is_sold) {
            addExitSpot();
        } else if (proposal_open_contract) {
            if (data.id_render) {
                id_render = data.id_render;
            }

            const request = {
                end          : contract.exit_tick_time || 'latest',
                start        : contract.date_start,
                ticks_history: contract.underlying,
                ...(!contract.exit_tick_time && { subscribe: 1 }),
            };

            if (data.request_ticks) { // we shouldn't send this multiple times on every update
                tick_init = '';
                BinarySocket.send(request, { callback: dispatch });
            }
        } else {
            dispatch(data);
        }
    };

    return {
        plotResetSpot,
        updateChart,
        init      : initialize,
        resetSpots: () => { spots_list = {}; updateContract({}); $(`#${id_render}`).css('background-color', '#F2F2F2'); },
        setStatus : (proposal_open_contract) => {
            updateContract(proposal_open_contract);
            evaluateContractOutcome();
        },
    };
})();

module.exports = TickDisplay;
