const HighchartUI      = require('./highchart.ui');
const getHighstock     = require('../common').requireHighstock;
const MBContract       = require('../../mb_trade/mb_contract');
const MBDefaults       = require('../../mb_trade/mb_defaults');
const Callputspread    = require('../../trade/callputspread');
const Defaults         = require('../../trade/defaults');
const GetTicks         = require('../../trade/get_ticks');
const Lookback         = require('../../trade/lookback');
const Reset            = require('../../trade/reset');
const ViewPopupUI      = require('../../user/view_popup/view_popup.ui');
const BinarySocket     = require('../../../base/socket');
const addComma         = require('../../../common/currency').addComma;
const localize         = require('../../../../_common/localize').localize;
const State            = require('../../../../_common/storage').State;
const getPropertyValue = require('../../../../_common/utility').getPropertyValue;
const isEmptyObject    = require('../../../../_common/utility').isEmptyObject;

const Highchart = (() => {
    let chart,
        chart_options,
        chart_promise,
        options,
        response_id,
        contract,
        request,
        min_point,
        max_point,
        lines_drawn,
        start_time,
        purchase_time,
        now_time,
        end_time,
        entry_tick_time,
        sell_time,
        is_sold_before_expiry,
        exit_tick_time,
        exit_time,
        margin,
        is_initialized,
        is_chart_delayed,
        is_chart_subscribed,
        stop_streaming,
        is_contracts_for_send,
        is_history_send,
        is_entry_tick_barrier_selected,
        is_response_id_set,
        is_tick_type,
        prev_barriers; // For checking if barrier was updated

    const initOnce = () => {
        chart = options = response_id = request = min_point = max_point = '';
        lines_drawn = new Set();

        is_initialized = is_chart_delayed = is_chart_subscribed = stop_streaming = is_response_id_set =
            is_contracts_for_send = is_history_send = is_entry_tick_barrier_selected = is_tick_type = false;
    };

    const initializeValues = () => {
        start_time            = parseInt(contract.date_start);
        purchase_time         = parseInt(contract.purchase_time);
        now_time              = parseInt(contract.current_spot_time);
        end_time              = parseInt(contract.date_expiry);
        entry_tick_time       = parseInt(contract.entry_tick_time);
        exit_tick_time        = parseInt(contract.exit_tick_time);
        sell_time             = +contract.is_path_dependent && contract.status !== 'sold' ? exit_tick_time : parseInt(contract.sell_time);
        is_sold_before_expiry = sell_time < end_time;
        exit_time             = is_sold_before_expiry ? sell_time : (exit_tick_time || end_time);
        prev_barriers         = [];
    };

    // initialize the chart only once with ticks or candles data
    const initChart = (init_options) => {
        let data = [];
        let type = '';
        let i;

        const pushTicks = (time, price) => {
            // we need to add the marker as we are pushing the data points
            // since for large arrays, data doesn't get pushed to series[0].data
            // and we can't update markers if data is empty
            const int_time       = parseInt(time);
            const is_match_entry = int_time === entry_tick_time;
            const is_match_exit  = contract.status !== 'sold' && int_time === exit_tick_time;
            const tick_type      = is_match_entry ? 'entry' : 'exit';
            data.push({
                x     : int_time * 1000,
                y     : price * 1,
                marker: (is_match_entry || is_match_exit) ? HighchartUI.getMarkerObject(tick_type) : '',
            });
        };

        let history = '';
        let candles = '';
        if (init_options.history) { // indicates line chart
            type         = 'line';
            history      = init_options.history;
            const times  = history.times;
            const prices = history.prices;
            if (is_chart_delayed) {
                for (i = 0; i < times.length; ++i) {
                    pushTicks(times[i], prices[i]);
                }
            } else if (min_point && max_point) {
                let current_time;
                for (i = 0; i < times.length; ++i) {
                    current_time = parseInt(times[i]);
                    // only display the first tick before entry spot and one tick after exit spot
                    // as well as the set of ticks between them
                    if (current_time >= min_point && current_time <= max_point) {
                        pushTicks(current_time, prices[i]);
                    }
                }
            }
        } else if (init_options.candles) { // indicates candle chart
            candles = init_options.candles;
            type    = 'candlestick';
            data    = candles.map(c => [c.epoch * 1000, c.open * 1, c.high * 1, c.low * 1, c.close * 1]);
        }

        // element where chart is to be displayed
        const el = document.getElementById('analysis_live_chart');
        if (!el) {
            chart = null;
            return null;
        }

        HighchartUI.updateLabels(chart, getHighchartLabelParams());

        const display_decimals = (history ? history.prices[0] : candles[0].open).split('.')[1].length || 3;

        chart_options = {
            data,
            display_decimals,
            type,
            entry_time: (entry_tick_time || start_time) * 1000,
            exit_time : exit_time ? exit_time * 1000 : null,
            has_zone  : true,
            height    : Math.max(el.parentElement.offsetHeight, 450),
            radius    : 2,
            title     : init_options.title,
            tooltip   : {
                valueDecimals: display_decimals,
                xDateFormat  : '%A, %b %e, %H:%M:%S GMT',
            },
            user_sold: contract.status === 'sold',
            x_axis   : { label: { format: '{value:%H:%M:%S}', overflow: 'justify' } },
        };
        if (Callputspread.isCallputspread(contract.contract_type)) {
            $.extend(chart_options, Callputspread.getChartOptions(contract));
        }
        HighchartUI.setChartOptions(chart_options);

        return getHighstock((Highcharts) => {
            Highcharts.setOptions(HighchartUI.getHighchartOptions());
            if (!el) chart = null;
            else {
                chart          = Highcharts.StockChart(el, HighchartUI.getChartOptions());
                is_initialized = true;

                $(window).on('resize', updateHighchartOptions);
                if (Callputspread.isCallputspread(contract.contract_type)) {
                    Callputspread.init(chart, contract);
                }
            }
        });
    };

    const getHighchartLabelParams = (is_reset_barrier) => ({
        is_chart_delayed,
        is_reset_barrier,
        is_tick_type,
        contract_type       : contract.contract_type,
        is_forward_starting : purchase_time !== start_time,
        is_sold_before_start: sell_time < start_time,
        is_user_sold        : contract.status === 'sold',
        has_barrier         : !!(contract.barrier || contract.high_barrier),
        is_tick_trade       : false,
        show_end_time       : contract.contract_type !== 'highlowticks',
    });

    // type 'x' is used to draw lines such as start and end times
    // type 'y' is used to draw lines such as barrier
    const addPlotLine = (params, type) => {
        chart[(`${type}Axis`)][0].addPlotLine(HighchartUI.getPlotlineOptions(params, type));
    };

    // Remove plotLines by id
    const removePlotLine = (id, type = 'y') => {
        chart[(`${type}Axis`)][0].removePlotLine(id);
    };

    const updateHighchartOptions = () => {
        if (chart && chart_options) {
            HighchartUI.setChartOptions(chart_options);
            chart.update(HighchartUI.getChartOptions());
        }
    };

    const onClose = (fnc) => {
        if (typeof fuc === 'function') {
            fnc();
        }
        $(window).off('resize', updateHighchartOptions);
    };

    const handleResponse = (response) => {
        const type  = response.msg_type;
        const error = response.error;

        if (/history|candles|tick|ohlc/.test(type) && !error) {
            options       = { title: contract.display_name };
            options[type] = response[type];
            const history = response.history;
            const candles = response.candles;
            const tick    = response.tick;
            const ohlc    = response.ohlc;
            response_id   = response[type].id;
            is_tick_type  = !isEmptyObject(history) || !isEmptyObject(tick);
            // send view popup the response ID so view popup can forget the calls if it's closed before contract ends
            if (response_id && !is_response_id_set) {
                if (State.get('is_trading') || State.get('is_mb_trading')) {
                    const page_underlying = State.get('is_mb_trading') ? MBDefaults.get('underlying') : Defaults.get('underlying');
                    if (page_underlying !== (tick || ohlc).symbol) {
                        ViewPopupUI.storeSubscriptionID(response_id, true);
                        ViewPopupUI.setOnCloseFunction(onClose);
                    } else {
                        ViewPopupUI.setOnCloseFunction(() => onClose(GetTicks.request));
                    }
                } else {
                    ViewPopupUI.storeSubscriptionID(response_id, true);
                    ViewPopupUI.setOnCloseFunction(onClose);
                }
                is_response_id_set = true;
            } else {
                ViewPopupUI.setOnCloseFunction(onClose);
            }
            if (history || candles) {
                const length = (history ? history.times : candles).length;
                if (length === 0) {
                    HighchartUI.showError('missing');
                    return;
                }
                if (history) {
                    const history_times = history.times;
                    getMinHistory(history_times);
                    getMaxHistory(history_times);
                } else if (candles) {
                    getMinCandle(candles);
                    getMaxCandle(candles);
                }
                // only initialize chart if it hasn't already been initialized
                if (!chart && !is_initialized) {
                    chart_promise = initChart(options);
                    if (!chart_promise || typeof chart_promise.then !== 'function') return;
                    chart_promise.then(() => {
                        if (!chart) return;

                        if (purchase_time !== start_time) {
                            drawLineX({
                                value: purchase_time,
                                label: localize('Purchase Time'),
                                color: '#7cb5ec',
                            });
                        }

                        // don't draw start time for contracts that are sold before contract starts
                        if (sell_time < start_time) {
                            HighchartUI.updateLabels(chart, getHighchartLabelParams());
                        } else {
                            drawLineX({ value: start_time });
                        }

                        if (Reset.isReset(contract.contract_type)) {
                            drawResetTimeLine();
                        }
                    });
                }
            } else if ((tick || ohlc) && !stop_streaming) {
                if (chart && chart.series) {
                    updateChart(options);
                }
            }
            if (chart_promise && typeof chart_promise.then === 'function') {
                if (entry_tick_time && !is_entry_tick_barrier_selected) {
                    chart_promise.then(selectEntryTickBarrier);
                }
                if (contract.is_sold || contract.is_settleable) {
                    chart_promise.then(() => {
                        updateZone('exit');
                        endContract();
                    });
                }
            }
        } else if (type === 'ticks_history' && error) {
            HighchartUI.showError('', error.message);
        }
    };

    const showChart = (proposal_contract, update) => {
        contract = proposal_contract;
        initializeValues();
        if (!update) {
            initOnce();
        }
        if (!chart && !is_history_send) {
            requestData(update || '');
        } else if (chart && entry_tick_time && !is_entry_tick_barrier_selected) {
            selectEntryTickBarrier();
        }
        if (chart && (contract.is_sold || contract.is_settleable)) {
            updateZone('exit');
            endContract();
        }
    };

    const requestData = (update) => {
        const calculate_granularity = calculateGranularity();
        const granularity           = calculate_granularity[0];
        const duration              = calculate_granularity[1];

        margin = granularity === 0 ? Math.max(300, (30 * duration) / (60 * 60) || 0) : 3 * granularity;

        request = {
            ticks_history    : contract.underlying,
            start            : ((purchase_time || start_time) - margin).toFixed(0), /* load more ticks first */
            end              : end_time ? (end_time + margin).toFixed(0) : 'latest',
            style            : granularity === 0 ? 'ticks' : 'candles',
            count            : 4999, /* maximum number of ticks possible */
            adjust_start_time: 1,
        };

        if (is_sold_before_expiry) {
            request.end = exit_tick_time ? (exit_tick_time + margin).toFixed(0) : 'latest';
        }

        // switch start and end if start is after end
        if (!isNaN(request.end) && request.start > request.end) {
            request.end = [request.start, request.start = request.end][0];
        }

        if (granularity !== 0) {
            request.granularity = granularity;
        }

        const now_unix = +(window.time.valueOf() / 1000).toFixed(0);
        if (!contract.is_settleable && !exit_tick_time && now_unix < end_time && !is_chart_subscribed) {
            request.subscribe = 1;
        }

        const contracts_response = State.get('is_mb_trading') ? MBContract.getContractsResponse() : State.get(['response', 'contracts_for']);
        const stored_delay       = sessionStorage.getItem(`license.${contract.underlying}`);

        if (contracts_response && contracts_response.echo_req.contracts_for === contract.underlying) {
            delayedChart(contracts_response);
        } else if (stored_delay) {
            handleDelay(stored_delay);
            sendTickRequest();
        } else if (!is_contracts_for_send && update === '') {
            BinarySocket.send({ contracts_for: contract.underlying }).then((response) => {
                const error = response.error;
                if ((!error || (error.code && error.code === 'InvalidSymbol'))) {
                    delayedChart(response);
                }
            });
            is_contracts_for_send = true;
        }
    };

    const delayedChart = (contracts_response) => {
        if (contracts_response.contracts_for && contracts_response.contracts_for.feed_license) {
            const license = contracts_response.contracts_for.feed_license;
            handleDelay(license);
            saveFeedLicense(contracts_response.echo_req.contracts_for, license);
        }
        sendTickRequest();
    };

    const sendTickRequest = () => {
        if (!entry_tick_time && !is_chart_delayed && start_time && window.time.unix() >= parseInt(start_time)) {
            HighchartUI.showError('', localize('Waiting for entry tick.'));
        } else if (!is_history_send) {
            is_history_send = true;
            if (request.subscribe) is_chart_subscribed = true;
            // BinarySocket.send(request, { callback: handleResponse });
            GetTicks.request('', request, handleResponse);
        }
    };

    const handleDelay = (feed_license) => {
        if (feed_license !== 'realtime') {
            if (!contract.is_settleable) {
                request.end = 'latest';
            }
            delete request.subscribe;
            is_chart_delayed = true;
        }
    };

    // update the color zones with the correct entry_tick_time and draw barrier
    const selectEntryTickBarrier = () => {
        if (chart && entry_tick_time && !is_entry_tick_barrier_selected && (!sell_time || sell_time > start_time)) {
            is_entry_tick_barrier_selected = true;
            drawBarrier();
            updateZone('entry');
            selectTick(entry_tick_time, 'entry');
        }
    };

    const updateZone = (type) => {
        if (chart && type && contract.status !== 'sold') {
            const value = type === 'entry' ? entry_tick_time : exit_time;
            chart.series[0].zones[(type === 'entry' ? 0 : 1)].value = value * 1000;
        }
    };

    const drawResetTimeLine = () => {
        const { reset_time } = contract; // use epoch to draw non-ticks reset_time
        if (!reset_time) return;
        drawLineX({
            value: parseInt(reset_time),
            color: '#000',
        });
    };

    const drawBarrier = () => {
        if (chart.yAxis[0].plotLinesAndBands.length === 0) {
            const { barrier, contract_type, entry_spot, high_barrier, low_barrier } = contract;
            if (barrier) {
                prev_barriers[0] = barrier; // Batman like the kids who "Cache".
                if (Lookback.isLookback(contract_type)) {
                    const localized_label = Lookback.getBarrierLabel(contract_type);
                    addPlotLine({ id: 'barrier',           value: +barrier,    label: `${localized_label} (${addComma(barrier)})`,           dashStyle: 'Dot'   }, 'y');
                } else if (Reset.isReset(contract_type)) {
                    if (Reset.isNewBarrier(entry_spot, barrier)) {
                        addPlotLine({ id: 'barrier',       value: +entry_spot, label: `${localize('Barrier')} (${addComma(entry_spot)})`,    dashStyle: 'Dot',   textBottom: contract_type !== 'RESETCALL', x: -60, align: 'right' }, 'y');
                        addPlotLine({ id: 'reset_barrier', value: +barrier,    label: `${localize('Reset Barrier')} (${addComma(barrier)})`, dashStyle: 'Solid', textBottom: contract_type === 'RESETCALL', x: -60, align: 'right' }, 'y');
                        HighchartUI.updateLabels(chart, getHighchartLabelParams(true));
                    } else {
                        addPlotLine({ id: 'barrier',       value: +entry_spot, label: `${localize('Barrier')} (${addComma(entry_spot)})`,    dashStyle: 'Dot', x: -60, align: 'right' }, 'y');

                    }
                } else {
                    addPlotLine({ id: 'barrier',           value: +barrier,    label: `${localize('Barrier')} (${addComma(barrier)})`,       dashStyle: 'Dot' },   'y');
                }
            } else if (high_barrier && low_barrier) {
                prev_barriers[1] = high_barrier;
                prev_barriers[0] = low_barrier;
                if (Lookback.isLookback(contract_type)) {
                    const [localized_high_label, localized_low_label] = Lookback.getBarrierLabel(contract_type);
                    addPlotLine({ id: 'high_barrier', value: +high_barrier, label: `${localized_high_label} (${addComma(high_barrier)})`,      dashStyle: 'Dot' }, 'y');
                    addPlotLine({ id: 'low_barrier',  value: +low_barrier,  label: `${localized_low_label} (${addComma(low_barrier)})`,        dashStyle: 'Dot', textBottom: true }, 'y');
                } else {
                    addPlotLine({ id: 'high_barrier', value: +high_barrier, label: `${localize('High Barrier')} (${addComma(high_barrier)})`,  dashStyle: 'Dot' }, 'y');
                    addPlotLine({ id: 'low_barrier',  value: +low_barrier,  label: `${localize('Low Barrier')} (${addComma(low_barrier)})`,    dashStyle: 'Dot', textBottom: true }, 'y');
                }
            }
        }
    };

    // Update barriers if needed.
    const updateBarrier = () => {
        const { barrier, high_barrier, low_barrier } = contract;
        // Update barrier only if it doesn't equal previous value
        if (barrier && barrier !== prev_barriers[0]) { // Batman: Good boy!
            prev_barriers[0] = barrier;
            removePlotLine('barrier', 'y');
            drawBarrier();
        } else if (high_barrier && low_barrier
            && (high_barrier !== prev_barriers[1] || low_barrier !== prev_barriers[0])) {
            prev_barriers[1] = high_barrier;
            prev_barriers[0] = low_barrier;
            removePlotLine('high_barrier', 'y');
            removePlotLine('low_barrier', 'y');
            drawBarrier();
        }
    };

    // set an orange circle on the entry/exit tick
    const selectTick = (value, tick_type) => {
        if (chart && value && tick_type && (options.tick || options.history) &&
            chart.series[0].data.length !== 0) {
            const data = chart.series[0].data;
            if (!data || data.length === 0) return;
            let current_data;
            for (let i = data.length - 1; i >= 0; i--) {
                current_data = data[i];
                if (current_data && current_data.x && value * 1000 === current_data.x) {
                    current_data.update({ marker: HighchartUI.getMarkerObject(tick_type) });
                }
            }
        }
    };

    // calculate where to display the minimum value of the x-axis of the chart for line chart
    const getMinHistory = (history_times) => {
        const history_times_length = history_times.length;
        let history_times_int;
        for (let i = 0; i < history_times_length; i++) {
            history_times_int = parseInt(history_times[i]);
            if (
                (
                    entry_tick_time && history_times_int === entry_tick_time
                ) ||
                (
                    purchase_time &&
                    start_time > purchase_time &&
                    history_times_int === purchase_time
                ) ||
                (
                    history_times_int < purchase_time &&
                    parseInt(history_times[(i === history_times_length - 1 ? i : i + 1)]) > purchase_time
                )
            ) {
                // set the chart to display from the tick before entry_tick_time or purchase_time
                min_point = parseInt(history_times[(i === 0 ? i : i - 1)]);
                break;
            }
        }
        if (!min_point) min_point = parseInt(history_times[0]);
    };

    // calculate where to display the maximum value of the x-axis of the chart for line chart
    const getMaxHistory = (history_times) => {
        const history_times_length = history_times.length;
        if (contract.is_settleable || contract.is_sold) {
            const i = history_times.findIndex(time => +time > exit_time);
            max_point = i > 0 ? +history_times[i] : end_time;
        }
        setMaxForDelayedChart(history_times, history_times_length);
    };

    // calculate where to display the minimum value of the x-axis of the chart for candle
    const getMinCandle = (candles) => {
        const candle_before_time = value => (
            value && current_candle &&
            parseInt(current_candle.epoch) <= value &&
            candles[(i === candles_length - 1 ? i : i + 1)].epoch > value
        );
        let i,
            current_candle;
        const candles_length     = candles.length;
        for (i = 1; i < candles_length; i++) {
            current_candle = candles[i];
            if (candle_before_time(entry_tick_time) || candle_before_time(purchase_time)) {
                // set the chart to display from the candle before entry_tick_time or purchase_time
                min_point = parseInt(candles[i - 1].epoch);
                break;
            }
        }
    };

    // calculate where to display the maximum value of the x-axis of the chart for candle
    const getMaxCandle = (candles) => {
        const end           = exit_tick_time && is_sold_before_expiry ? exit_tick_time : end_time;
        const candle_length = candles.length;
        let current_candle,
            next_candle;
        if (contract.is_settleable || contract.is_sold) {
            for (let i = candle_length - 2; i >= 0; i--) {
                current_candle = candles[i];
                next_candle    = candles[i + 1];
                if (!current_candle) return;
                if (parseInt(next_candle.epoch) < end) {
                    max_point = end_time;
                    break;
                }
                if (parseInt(current_candle.epoch) <= end && parseInt(next_candle.epoch) > end) {
                    max_point = parseInt(next_candle.epoch);
                    break;
                }
            }
        }
        setMaxForDelayedChart(candles, candle_length);
    };

    const setMaxForDelayedChart = (array, array_length) => {
        if (is_chart_delayed) {
            const last_epoch = parseInt(array[array_length - 1].epoch);
            if (last_epoch > start_time) {
                max_point = last_epoch;
            } else {
                max_point = start_time;
            }
        }
        if (!max_point) max_point = end_time;
    };

    const drawLineX = (properties) => {
        if (chart && properties.value && !lines_drawn.has(properties.value)) {
            addPlotLine({
                value    : properties.value * 1000,
                label    : properties.label || '',
                textLeft : properties.text_left === 'textLeft',
                dashStyle: properties.dash_style || '',
                color    : properties.color || '',
            }, 'x');
            lines_drawn.add(properties.value);
        }
    };

    // draw the last line, mark the exit tick, and forget the streams
    const endContract = () => {
        if (chart && !stop_streaming) {
            drawLineX({
                value     : (is_sold_before_expiry ? sell_time : end_time),
                text_left : 'textLeft',
                dash_style: 'Dash',
            });
            if (is_sold_before_expiry && contract.status === 'sold') {
                HighchartUI.updateLabels(chart, getHighchartLabelParams());
            } else if (exit_tick_time) {
                selectTick(exit_tick_time, 'exit');
            }
            if (!contract.exit_tick) {
                if ($('#waiting_exit_tick').length === 0) {
                    $('#trade_details_message').append($('<div/>', { id: 'waiting_exit_tick', text: localize('Waiting for exit tick.') }));
                }
            } else {
                $('#waiting_exit_tick').remove();
            }
            setStopStreaming();
        }
    };

    const setStopStreaming = () => {
        if (chart && (contract.is_sold || contract.is_settleable) && (is_sold_before_expiry ? sell_time : end_time)) {
            const data = getPropertyValue(getPropertyValue(chart, ['series'])[0], ['options', 'data']);
            if (data && data.length > 0) {
                let last_data = data[data.length - 1];
                let i         = 2;
                while (last_data.y === null) {
                    last_data = data[data.length - i];
                    i++;
                }
                const last = parseInt(last_data.x || last_data[0]);
                if (last > (end_time * 1000) || last > (sell_time * 1000)) {
                    stop_streaming = true;
                }
            }
        }
    };

    const calculateGranularity = () => {
        const duration = Math.min(exit_time, now_time) - (purchase_time || start_time);
        let granularity;
        // days * hours * minutes * seconds
        if      (duration <=           60 * 60) granularity = 0;     // less than 1 hour
        else if (duration <=       2 * 60 * 60) granularity = 120;   // 2 hours
        else if (duration <=       6 * 60 * 60) granularity = 600;   // 6 hours
        else if (duration <=      24 * 60 * 60) granularity = 900;   // 1 day
        else if (duration <=  5 * 24 * 60 * 60) granularity = 3600;  // 5 days
        else if (duration <= 30 * 24 * 60 * 60) granularity = 14400; // 30 days
        else                                    granularity = 86400; // more than 30 days

        return [granularity, duration];
    };

    // add new data points to the chart
    const updateChart = (update_options) => {
        const granularity = calculateGranularity()[0];
        const series      = chart.series[0];
        if (granularity === 0) {
            const data = update_options.tick;
            chart.series[0].addPoint({ x: data.epoch * 1000, y: data.quote * 1 });
            updateBarrier();
        } else {
            const c    = update_options.ohlc;
            const last = series.data[series.data.length - 1];
            if (!c || !last) return;
            const ohlc = [c.open_time * 1000, c.open * 1, c.high * 1, c.low * 1, c.close * 1];

            if (last.x !== ohlc[0]) {
                series.addPoint(ohlc, true, true);
            } else {
                last.update(ohlc, true);
            }
        }
        if (Reset.isReset(contract.contract_type)) {
            drawResetTimeLine();
        }
    };

    const saveFeedLicense = (save_contract, license) => {
        const regex     = new RegExp(`license.${contract}`);
        let match_found = false;

        for (let i = 0; i < sessionStorage.length; i++) {
            if (regex.test(sessionStorage.key(i))) {
                match_found = true;
                break;
            }
        }

        if (!match_found) {
            sessionStorage.setItem(`license.${save_contract}`, license);
        }
    };

    return {
        showChart,
    };
})();

module.exports = Highchart;
