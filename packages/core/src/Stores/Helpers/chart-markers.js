import {
    createMarkerEndTime,
    createMarkerPurchaseTime,
    createMarkerSpotEntry,
    createMarkerSpotExit,
    createMarkerStartTime,
    createMarkerSpotMiddle,
    getSpotCount,
} from './chart-marker-helpers';
import { getEndTime, isAccumulatorContract, unique } from '@deriv/shared';
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
