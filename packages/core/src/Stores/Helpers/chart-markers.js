import {
    createMarkerEndTime,
    createMarkerPurchaseTime,
    createMarkerSpotEntry,
    createMarkerSpotExit,
    createMarkerStartTime,
    createMarkerSpotMiddle,
    getSpotCount,
} from './chart-marker-helpers';
import {
    getDecimalPlaces,
    getEndTime,
    isAccumulatorContract,
    isDigitContract,
    isHighLow,
    isTouchContract,
    isMultiplierContract,
    isVanillaContract,
    unique,
} from '@deriv/shared';
import { localize } from '@deriv/translations';
import { MARKER_TYPES_CONFIG } from '../Constants/markers';
import { getChartType } from './logic';

export const createChartMarkers = contract_info => {
    const { contract_type, status, tick_stream } = contract_info;
    const should_show_10_last_ticks =
        isAccumulatorContract(contract_type) && status === 'open' && tick_stream.length === 10;

    let markers = [];
    if (contract_info) {
        const end_time = getEndTime(contract_info);
        const chart_type = getChartType(contract_info.date_start, end_time);

        if (contract_info.tick_count) {
            const tick_markers = createTickMarkers(contract_info);
            markers.push(...tick_markers);
        } else if (chart_type !== 'candle') {
            const spot_markers = Object.keys(marker_spots).map(type => marker_spots[type](contract_info));
            markers.push(...spot_markers);
        }
        if (!should_show_10_last_ticks) {
            // don't draw start/end lines if only 10 last ticks are displayed
            const line_markers = Object.keys(marker_lines).map(type => marker_lines[type](contract_info));
            markers.push(...line_markers);
        }
        markers = markers.filter(m => !!m);
    }
    markers.forEach(marker => {
        const contract_id = contract_info.contract_id;
        marker.react_key = `${contract_id}-${marker.type}`;
    });

    return markers;
};

const marker_spots = {
    [MARKER_TYPES_CONFIG.SPOT_ENTRY.type]: createMarkerSpotEntry,
    [MARKER_TYPES_CONFIG.SPOT_EXIT.type]: createMarkerSpotExit,
};

const marker_lines = {
    [MARKER_TYPES_CONFIG.LINE_START.type]: createMarkerStartTime,
    [MARKER_TYPES_CONFIG.LINE_END.type]: createMarkerEndTime,
    [MARKER_TYPES_CONFIG.LINE_PURCHASE.type]: createMarkerPurchaseTime,
};

const addLabelAlignment = (tick, idx, arr) => {
    if (idx > 0 && arr.length) {
        const prev_tick = arr[idx - 1];

        if (+tick > +prev_tick.tick) tick.align_label = 'top';
        if (+tick.tick < +prev_tick.tick) tick.align_label = 'bottom';
        if (+tick.tick === +prev_tick.tick) tick.align_label = prev_tick.align_label;
    }

    return tick;
};

const createTickMarkers = contract_info => {
    const is_accumulator = isAccumulatorContract(contract_info.contract_type);
    const is_contract_closed = contract_info.status && contract_info.exit_tick_time;
    const available_ticks = (is_accumulator && contract_info.audit_details?.all_ticks) || contract_info.tick_stream;
    const tick_stream = unique(available_ticks, 'epoch').map(addLabelAlignment);
    const result = [];

    if (is_contract_closed && is_accumulator) {
        tick_stream.length = tick_stream.findIndex(tick => tick.epoch === contract_info.exit_tick_time) + 1;
    }

    tick_stream.forEach((tick, idx) => {
        const isEntrySpot = _tick => +_tick.epoch === contract_info.entry_tick_time;
        const is_entry_spot =
            +tick.epoch !== contract_info.exit_tick_time && (is_accumulator ? isEntrySpot(tick) : idx === 0);
        // accumulators entry spot will be missing from tick_stream when contract is lasting for longer than 10 ticks
        const entry_spot_index = is_accumulator ? tick_stream.findIndex(isEntrySpot) : 0;
        const is_middle_spot = idx > entry_spot_index && +tick.epoch !== +contract_info.exit_tick_time;
        const isExitSpot = (_tick, _idx) =>
            +_tick.epoch === +contract_info.exit_tick_time ||
            getSpotCount(contract_info, _idx) === contract_info.tick_count;
        const is_exit_spot = isExitSpot(tick, idx);
        const exit_spot_index = tick_stream.findIndex(isExitSpot);
        const is_current_last_spot = idx === tick_stream.length - 1;
        const is_preexit_spot = idx === exit_spot_index - 1 || idx === tick_stream.length - 2;
        const has_accumulator_bold_marker = is_accumulator && (is_preexit_spot || is_current_last_spot || is_exit_spot);

        let marker_config;
        if (is_entry_spot) {
            marker_config = createMarkerSpotEntry(contract_info);
        } else if (is_middle_spot) {
            marker_config = createMarkerSpotMiddle(contract_info, tick, idx);
        } else if (is_exit_spot) {
            tick.align_label = 'top'; // force exit spot label to be 'top' to avoid overlapping
            marker_config = createMarkerSpotExit(contract_info, tick, idx);
        }
        if (has_accumulator_bold_marker || (is_accumulator && is_middle_spot)) {
            const spot_className = marker_config.content_config.spot_className;
            marker_config.content_config.spot_className = `${spot_className} ${spot_className}--accumulator${
                has_accumulator_bold_marker ? '-bold' : '-small'
            }`;
        }

        if (marker_config) {
            result.push(marker_config);
        }
    });
    return result;
};

const dark_theme = {
    open: '#377cfc',
    won: '#00a79e',
    lost: '#cc2e3d',
    sold: '#ffad3a',
    fg: '#ffffff',
    bg: '#0e0e0e',
    dashed_border: '#6E6E6E',
};

const light_theme = {
    open: '#377cfc',
    won: '#4bb4b3',
    lost: '#ec3f3f',
    sold: '#ffad3a',
    fg: '#333333',
    bg: '#ffffff',
    dashed_border: '#999999',
};

function getColor({ status, profit, is_dark_theme, is_vanilla }) {
    const colors = is_dark_theme ? dark_theme : light_theme;
    let color = colors[status || 'open'];
    if (is_vanilla) {
        if (status === 'open') return colors.open;
        return colors[profit > 0 ? 'won' : 'lost'];
    }
    if (status === 'open' && profit) {
        color = colors[profit > 0 ? 'won' : 'lost'];
    }
    return color;
}

const currency_symbols = {
    AUD: '\u0041\u0024',
    EUR: '\u20AC',
    GBP: '\u00A3',
    JPY: '\u00A5',
    USD: '\u0024',
    BTC: '\u20bf',
    BCH: '\ue901',
    ETH: '\u0045',
    ETC: '\ue900',
    LTC: '\u0141',
    UST: '\u20ae',
};

const getMarkerContractType = contract_info => {
    const { tick_count, contract_type } = contract_info;

    if (isAccumulatorContract(contract_type)) {
        return 'AccumulatorContract';
    } else if (isDigitContract(contract_type)) {
        return 'DigitContract';
    }

    return tick_count > 0 ? 'TickContract' : 'NonTickContract';
};

const getStartText = contract_info => {
    const { barrier, contract_type, currency, is_sold, profit, tick_count, tick_stream } = contract_info;
    const is_non_tick_contract = !tick_count;

    if (is_sold || isAccumulatorContract(contract_type)) return undefined;

    // NonTickContract
    if (is_non_tick_contract) {
        if (!(profit && barrier)) return undefined;

        const symbol = currency_symbols[currency] || '';
        const decimal_places = getDecimalPlaces(currency);
        const sign = profit < 0 ? '-' : profit > 0 ? '+' : ' ';
        return `${sign}${symbol}${Math.abs(profit).toFixed(decimal_places)}`;
    }

    return `${Math.max(tick_stream.length - 1, 0)}/${tick_count}`;
};

const getTickStreamMarkers = (contract_info, barrier_price) => {
    function getTicks() {
        if (is_accumulator_contract) {
            return tick_stream.slice(-2);
        } else if (is_digit_contract) {
            return tick_stream.slice(-1);
        }
        return tick_stream;
    }

    const { contract_type, tick_stream } = contract_info;
    const is_digit_contract = isDigitContract(contract_type);
    const is_accumulator_contract = isAccumulatorContract(contract_type);

    const last_tick = tick_stream[tick_stream.length - 1];
    const ticks = getTicks();

    const markers = ticks.map(t => ({
        epoch: t.epoch,
        quote: t.tick,
        type: 'tick',
    }));

    if (!is_digit_contract && last_tick) {
        markers.push({
            epoch: last_tick.epoch,
            quote: barrier_price,
            type: 'latestTick',
        });
    }

    return markers;
};

export function calculateMarker(contract_info, is_dark_theme, is_last_contract) {
    if (!contract_info || isMultiplierContract(contract_info.contract_type)) {
        return null;
    }
    const {
        transaction_ids,
        tick_stream,
        date_start,
        date_expiry,
        entry_tick,
        exit_tick,
        entry_tick_time,
        exit_tick_time,
        contract_type,
        tick_count,
        barrier_count,
        barrier,
        high_barrier,
        low_barrier,
        shortcode,
        status,
        profit,
        is_sold,
    } = contract_info;
    const is_accumulator_contract = isAccumulatorContract(contract_type);
    const is_digit_contract = isDigitContract(contract_type);
    const is_tick_contract = tick_count > 0;
    const is_non_tick_contract = !is_tick_contract;
    const is_high_low_contract = isHighLow({ shortcode });
    const is_touch_contract = isTouchContract(contract_type);

    const end_time = is_tick_contract ? exit_tick_time : getEndTime(contract_info) || date_expiry;

    let barrier_price;
    if (is_digit_contract || is_accumulator_contract) {
        barrier_price = +entry_tick;
    } else if (+barrier_count === 1 && barrier) {
        barrier_price = +barrier;
    } else if (+barrier_count === 2 && high_barrier && low_barrier) {
        barrier_price = +high_barrier;
    }

    if (!date_start) {
        return null;
    }
    // if we have not yet received the first POC response
    if (!transaction_ids) {
        return {
            type: getMarkerContractType(contract_info),
            markers: [],
        };
    }

    const markers = [];

    const price = barrier_price || 0;

    if (is_last_contract && !is_sold) {
        markers.push({
            epoch: date_start,
            quote: is_digit_contract ? undefined : price,
            type: 'activeStart',
            text: localize('Start\nTime'),
        });
    }

    if (date_start && entry_tick) {
        const color = is_non_tick_contract ? getColor({ status: 'open', profit }) : undefined;
        markers.push({
            epoch: date_start,
            quote: is_digit_contract ? undefined : price,
            type: 'start',
            text: getStartText(contract_info),
            color,
        });
    }

    if (entry_tick) {
        markers.push({
            epoch: entry_tick_time,
            quote: price,
            type: 'entry',
        });

        if (is_high_low_contract || is_touch_contract) {
            markers.push({
                epoch: entry_tick_time,
                quote: entry_tick,
                type: 'entryTick',
            });
        }
    }

    if (end_time) {
        markers.push({
            epoch: end_time,
            quote: price,
            type: 'end',
        });
    }

    if (exit_tick) {
        markers.push({
            epoch: exit_tick_time,
            quote: +exit_tick,
            type: 'exit',
        });
    } else if (tick_stream?.length > 0) {
        markers.push(...getTickStreamMarkers(contract_info, barrier_price));
    }

    return {
        type: getMarkerContractType(contract_info),
        markers,
        color: getColor({
            status,
            profit: is_non_tick_contract || is_sold ? profit : undefined,
            is_dark_theme,
            is_vanilla: isVanillaContract(contract_type),
        }),
    };
}

export function getAccumulatorMarkers({
    epoch,
    high_barrier,
    low_barrier,
    is_accumulators_trade_without_contract = false,
    is_dark_mode_on,
    in_contract_details = false,
}) {
    const markers = [
        {
            epoch,
            quote: +high_barrier,
            type: 'highBarrier',
            color: is_accumulators_trade_without_contract ? 'rgba(55, 124, 252, 0.08)' : 'rgba(0, 167, 158, 0.08)',
        },
        {
            epoch,
            quote: +low_barrier,
            type: 'lowBarrier',
        },
    ];

    return {
        type: in_contract_details ? 'AccumulatorContractInContractDetails' : 'AccumulatorContract',
        markers,
        color: getColor({ status: 'dashed_border', is_dark_mode_on }),
    };
}
