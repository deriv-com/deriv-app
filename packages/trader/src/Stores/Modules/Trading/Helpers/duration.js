import { localize } from 'deriv-translations';
import { toMoment } from 'Utils/Date';

const getDurationMaps = () => ({
    t: { display: localize('Ticks'),   order: 1 },
    s: { display: localize('Seconds'), order: 2, to_second: 1 },
    m: { display: localize('Minutes'), order: 3, to_second: 60 },
    h: { display: localize('Hours'),   order: 4, to_second: 60 * 60 },
    d: { display: localize('Days'),    order: 5, to_second: 60 * 60 * 24 },
});

export const buildDurationConfig = (contract, durations = { min_max: {}, units_display: {} }) => {
    durations.min_max[contract.start_type]       = durations.min_max[contract.start_type] || {};
    durations.units_display[contract.start_type] = durations.units_display[contract.start_type] || [];

    const obj_min = getDurationFromString(contract.min_contract_duration);
    const obj_max = getDurationFromString(contract.max_contract_duration);

    durations.min_max[contract.start_type][contract.expiry_type] = {
        min: convertDurationUnit(obj_min.duration, obj_min.unit, 's'),
        max: convertDurationUnit(obj_max.duration, obj_max.unit, 's'),
    };

    const arr_units = [];
    durations.units_display[contract.start_type].forEach(obj => {
        arr_units.push(obj.value);
    });

    const duration_maps = getDurationMaps();

    if (/^tick|daily$/.test(contract.expiry_type)) {
        if (arr_units.indexOf(obj_min.unit) === -1) {
            arr_units.push(obj_min.unit);
        }
    } else {
        Object.keys(duration_maps).forEach(u => {
            if (
                u !== 'd' && // when the expiray_type is intraday, the supported units are seconds, minutes and hours.
                arr_units.indexOf(u) === -1 &&
                duration_maps[u].order >= duration_maps[obj_min.unit].order &&
                duration_maps[u].order <= duration_maps[obj_max.unit].order) {
                arr_units.push(u);
            }
        });
    }

    durations.units_display[contract.start_type] = arr_units
        .sort((a, b) => (duration_maps[a].order > duration_maps[b].order ? 1 : -1))
        .reduce((o, c) => (
            [...o, { text: duration_maps[c].display, value: c }]
        ), []);

    return durations;
};

export const convertDurationUnit = (value, from_unit, to_unit) => {
    if (!value || !from_unit || !to_unit || isNaN(parseInt(value))) {
        return null;
    }

    const duration_maps = getDurationMaps();

    if (from_unit === to_unit || !('to_second' in duration_maps[from_unit])) {
        return value;
    }

    return (value * duration_maps[from_unit].to_second) / duration_maps[to_unit].to_second;
};

const getDurationFromString = (duration_string) => {
    const duration = duration_string.toString().match(/[a-zA-Z]+|[0-9]+/g);
    return {
        duration: +duration[0], // converts string to numbers
        unit    : duration[1],
    };
};

export const getExpiryType = (store) => {
    const { duration_unit, expiry_date, expiry_type, duration_units_list } = store;
    const server_time = store.root_store.common.server_time;

    const duration_is_day       = expiry_type === 'duration' && duration_unit === 'd';
    const expiry_is_after_today = expiry_type === 'endtime' && (toMoment(expiry_date).isAfter(toMoment(server_time), 'day') ||
        !hasIntradayDurationUnit(duration_units_list));

    let contract_expiry_type = 'daily';
    if (!duration_is_day && !expiry_is_after_today) {
        contract_expiry_type = duration_unit === 't' ? 'tick' : 'intraday';
    }

    return contract_expiry_type;
};

export const convertDurationLimit = (value, unit) => {
    if (!(value >= 0) || !unit || !Number.isInteger(value)) {
        return null;
    }

    if (unit === 'm') {
        const minute = value / 60;
        return minute >= 1 ? Math.floor(minute) : 1;
    } else if (unit === 'h') {
        const hour = value / (60 * 60);
        return hour >= 1 ? Math.floor(hour) : 1;
    } else if (unit === 'd') {
        const day = value / (60 * 60 * 24);
        return day >= 1 ? Math.floor(day) : 1;
    }

    return value;
};

export const hasIntradayDurationUnit = (duration_units_list) => (
    duration_units_list.some(unit => ['m', 'h'].indexOf(unit.value) !== -1)
);

/**
 * On switching symbols, end_time value of volatility indices should be set to today
 *
 * @param {String} symbol
 * @param {String} expiry_type
 * @returns {*}
 */
export const resetEndTimeOnVolatilityIndices = (symbol, expiry_type) => (
    (/^R_/.test(symbol) && expiry_type === 'endtime') ? toMoment(null).format('DD MMM YYYY') : null
);
