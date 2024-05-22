import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { localize } from '@deriv/translations';
import { formatMilliseconds, getDiffDuration } from '../date';
import { TContractInfo } from '../contract';

dayjs.extend(duration);

type TUnitMap = {
    name_plural?: string;
    name_singular?: string;
    name?: string;
};

export const getDurationUnitValue = (obj_duration: duration.Duration) => {
    const duration_ms = obj_duration.as('millisecond') / 1000;

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
        t: { name_plural: localize('ticks'), name_singular: localize('tick') },
    } as { [key: string]: TUnitMap };
};

const TIME = {
    SECOND: 1000,
    MINUTE: 60000,
    HOUR: 3600000,
    DAY: 86400000,
} as const;

export const getDurationUnitText = (obj_duration: duration.Duration, should_ignore_end_time?: boolean) => {
    const unit_map = getUnitMap();
    const duration_ms = obj_duration.as('millisecond') / TIME.SECOND;

    if (duration_ms >= TIME.DAY) {
        const days_value = duration_ms / TIME.DAY;
        return days_value <= 2 ? unit_map.d.name_singular : unit_map.d.name_plural;
    }
    if (duration_ms >= TIME.HOUR && duration_ms < TIME.DAY) {
        if (!should_ignore_end_time && isEndTime(duration_ms / TIME.HOUR)) return '';
        return duration_ms === TIME.HOUR ? unit_map.h.name_singular : unit_map.h.name_plural;
    }
    if (duration_ms >= TIME.MINUTE && duration_ms < TIME.HOUR) {
        if (!should_ignore_end_time && isEndTime(duration_ms / TIME.MINUTE)) return '';
        return duration_ms === TIME.MINUTE ? unit_map.m.name_singular : unit_map.m.name_plural;
    }
    if (duration_ms >= TIME.SECOND && duration_ms < TIME.MINUTE) {
        return unit_map.s.name;
    }
    return unit_map.s.name;
};

export const formatResetDuration = (contract_info: TContractInfo) => {
    const time_duration = getUnitMap();
    const duration_ms = getDurationPeriod(contract_info).as('millisecond') / TIME.SECOND / 2;
    const reset_hours =
        duration_ms === TIME.HOUR ? `h [${time_duration.h.name_singular}] ` : `h [${time_duration.h.name_plural}] `;
    const reset_minutes =
        duration_ms === TIME.MINUTE ? `m [${time_duration.m.name_singular}] ` : `m [${time_duration.m.name_plural}] `;
    const reset_seconds = duration_ms % TIME.MINUTE === 0 ? '' : `s [${time_duration.s.name}]`;

    return dayjs
        .utc(dayjs.duration(duration_ms, 'milliseconds').asMilliseconds())
        .format(
            `${duration_ms >= TIME.HOUR ? reset_hours : ''}${
                duration_ms >= TIME.MINUTE && duration_ms % TIME.HOUR !== 0 ? reset_minutes : ''
            }${reset_seconds}`.trim()
        );
};

export const getDurationPeriod = (contract_info: TContractInfo) =>
    getDiffDuration(
        +dayjs.unix(contract_info.date_start || contract_info.purchase_time || 0),
        +dayjs.unix(contract_info.date_expiry || 0)
    );

export const getDurationTime = (contract_info: TContractInfo) =>
    contract_info.tick_count ? contract_info.tick_count : getDurationUnitValue(getDurationPeriod(contract_info));
