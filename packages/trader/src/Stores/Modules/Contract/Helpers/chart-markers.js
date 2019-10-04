import ObjectUtils             from 'deriv-shared/utils/object';
import {
    createMarkerEndTime,
    createMarkerPurchaseTime,
    createMarkerSpotEntry,
    createMarkerSpotExit,
    createMarkerStartTime,
    createMarkerSpotMiddle,
    getSpotCount }             from './chart-marker-helpers';
import {
    getChartType,
    getEndTime }               from './logic';
import { MARKER_TYPES_CONFIG } from '../../SmartChart/Constants/markers';

export const createChartMarkers = (contract_info) => {
    let markers = [];
    if (contract_info) {

        const end_time = getEndTime(contract_info);
        const chart_type = getChartType(contract_info.date_start, end_time);

        if (contract_info.tick_count) {
            const tick_markers = createTickMarkers(contract_info);
            markers.push(...tick_markers);
        } else if (chart_type !== 'candle') {

            const spot_markers = Object.keys(marker_spots).map(
                type => marker_spots[type](contract_info)
            );
            markers.push(...spot_markers);
        }
        const line_markers = Object.keys(marker_lines).map(
            type => marker_lines[type](contract_info)
        );
        markers.push(...line_markers);

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
    [MARKER_TYPES_CONFIG.SPOT_EXIT.type] : createMarkerSpotExit,
};

const marker_lines = {
    [MARKER_TYPES_CONFIG.LINE_START.type]   : createMarkerStartTime,
    [MARKER_TYPES_CONFIG.LINE_END.type]     : createMarkerEndTime,
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

const createTickMarkers = (contract_info) => {
    const tick_stream = ObjectUtils.unique(contract_info.tick_stream, 'epoch').map(addLabelAlignment);
    const result = [];

    tick_stream.forEach((tick, idx) => {
        const is_entry_spot  = idx === 0 && +tick.epoch !== contract_info.exit_tick_time;
        const is_middle_spot = idx > 0 && +tick.epoch !== +contract_info.exit_tick_time;
        const is_exit_spot   = +tick.epoch === +contract_info.exit_tick_time ||
            getSpotCount(contract_info, idx) === contract_info.tick_count;

        let marker_config;
        if (is_entry_spot) {
            marker_config = createMarkerSpotEntry(contract_info);
        } else if (is_middle_spot) {
            marker_config = createMarkerSpotMiddle(contract_info, tick, idx);
        } else if (is_exit_spot) {
            tick.align_label = 'top'; // force exit spot label to be 'top' to avoid overlapping
            marker_config = createMarkerSpotExit(contract_info, tick, idx);
        }

        if (marker_config) {
            result.push(marker_config);
        }
    });
    return result;
};
