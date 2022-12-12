import { epochToMoment, formatMilliseconds, getDiffDuration } from '../date';
import { localize } from '@deriv/translations';
import moment from 'moment';

type TGetDurationPeriod = {
    date_start: number;
    purchase_time: number;
    date_expiry: number;
    tick_count?: number;
};

export const getDurationUnitValue = (obj_duration: moment.Duration) => {
    const duration_ms = obj_duration.asMilliseconds() / 1000;
    // Check with isEndTime to find out if value of duration has decimals
    // for days we do not require precision for End Time value since users cannot select with timepicker if not in same day
    // Seconds is the smallest End Time duration displayed thus we can keep the same formatting as normal Duration

    if (duration_ms >= 86400000) {
        const duration = duration_ms / (1000 * 60 * 60 * 24);
        return Math.floor(duration);
    } else if (duration_ms >= 3600000 && duration_ms < 86400000) {
        const duration = duration_ms / (1000 * 60 * 60);
        const is_end_time = isEndTime(duration);
        const has_seconds = isEndTime(duration_ms / (1000 * 60));
        const string_format = has_seconds ? 'HH[h] mm[m] ss[s]' : 'HH[h] mm[m]';

        return is_end_time
            ? formatMilliseconds(duration_ms, string_format)
            : Math.floor(duration_ms / (1000 * 60 * 60));
    } else if (duration_ms >= 60000 && duration_ms < 3600000) {
        const duration = duration_ms / (1000 * 60);
        const is_end_time = isEndTime(duration);
        return is_end_time ? formatMilliseconds(duration_ms, 'mm[m] ss[s]') : Math.floor(duration_ms / (1000 * 60));
    } else if (duration_ms >= 1000 && duration_ms < 60000) {
        return Math.floor(duration_ms / 1000);
    }
    return Math.floor(duration_ms / 1000);
};

export const isEndTime = (duration: number) => duration % 1 !== 0;

export const getUnitMap = () => {
    return {
        d: { name_plural: localize('days'), name_singular: localize('day') },
        h: { name_plural: localize('hours'), name_singular: localize('hour') },
        m: { name_plural: localize('minutes'), name_singular: localize('minute') },
        s: { name: localize('seconds') },
    };
};

export const getDurationUnitText = (obj_duration: moment.Duration) => {
    const unit_map = getUnitMap();
    const duration_ms = obj_duration.asMilliseconds() / 1000;
    // return empty suffix string if duration is End Time set except for days and seconds, refer to L18 and L19

    if (duration_ms) {
        if (duration_ms >= 86400000) {
            const days_value = duration_ms / 86400000;
            return days_value <= 2 ? unit_map.d.name_singular : unit_map.d.name_plural;
        } else if (duration_ms >= 3600000 && duration_ms < 86400000) {
            if (isEndTime(duration_ms / (1000 * 60 * 60))) return '';
            return duration_ms === 3600000 ? unit_map.h.name_singular : unit_map.h.name_plural;
        } else if (duration_ms >= 60000 && duration_ms < 3600000) {
            if (isEndTime(duration_ms / (1000 * 60))) return '';
            return duration_ms === 60000 ? unit_map.m.name_singular : unit_map.m.name_plural;
        } else if (duration_ms >= 1000 && duration_ms < 60000) {
            return unit_map.s.name;
        }
    }
    return unit_map.s.name;
};

export const getDurationPeriod = (contract_info: TGetDurationPeriod) =>
    getDiffDuration(
        +epochToMoment(contract_info.date_start || contract_info.purchase_time),
        +epochToMoment(contract_info.date_expiry)
    );

export const getDurationTime = (contract_info: TGetDurationPeriod) =>
    contract_info.tick_count ? contract_info.tick_count : getDurationUnitValue(getDurationPeriod(contract_info));
