import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import duration from 'dayjs/plugin/duration';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import relativeTime from 'dayjs/plugin/relativeTime';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { getLanguage, localize } from '@deriv/translations';

dayjs.extend(utc);
dayjs.extend(localizedFormat);
dayjs.extend(relativeTime);
dayjs.extend(advancedFormat);
dayjs.extend(customParseFormat);
dayjs.extend(duration);

export const initDayjs = (lang: string) => {
    const ignored_language = ['EN', 'AR', 'BN'];
    if (!lang || ignored_language.includes(lang)) return dayjs;
    import(`dayjs/locale/${lang.toLowerCase().replace('_', '-')}`).then(() =>
        dayjs.locale(lang.toLowerCase().replace('_', '-'))
    );
};

export const epochdayjs = (epoch: number) => dayjs.unix(epoch).utc();

export const toLocalFormat = (time: dayjs.ConfigType) => dayjs.utc(time).local().format('YYYY-MM-DD HH:mm:ss Z');

export const getLongDate = (time: number): string => {
    dayjs.locale(getLanguage().toLowerCase());
    return dayjs.unix(time / 1000).format('MMMM D, YYYY');
};

export const setTime = (dayjs_obj: dayjs.Dayjs, time: string | null) => {
    const [hour, minute, second] = time ? time.split(':') : [0, 0, 0];
    return dayjs_obj
        .hour(+hour)
        .minute(+minute || 0)
        .second(+second || 0);
};

export const convertToUnix = (epoch: number | string, time: string) => setTime(dayjs(epoch), time).unix();

export const toGMTFormat = (time?: dayjs.ConfigType) => dayjs(time).utc().format('YYYY-MM-DD HH:mm:ss [GMT]');

export const formatDate = (date?: dayjs.ConfigType, date_format = 'YYYY-MM-DD', should_format_null = true) =>
    !should_format_null && date === null ? undefined : dayjs(date).format(date_format);

export const formatTime = (epoch: number | string, time_format = 'HH:mm:ss [GMT]') => dayjs(epoch).format(time_format);

export const daysFromTodayTo = (date?: string | dayjs.ConfigType) => {
    const diff = dayjs(date).startOf('day').diff(dayjs().startOf('day'), 'days');
    return !date || diff < 0 ? '' : diff;
};

export const daysSince = (date: string) => {
    const diff = dayjs().startOf('day').diff(dayjs(date).startOf('day'), 'days');
    return !date ? '' : diff;
};

export const diffInMonths = (now: dayjs.ConfigType, then: dayjs.Dayjs) => then.diff(dayjs(now), 'month');

export const getDiffDuration = (start_time: number, end_time: number) =>
    dayjs.duration(dayjs.unix(end_time).diff(dayjs.unix(start_time)));

export const getDateFromNow = (days: string | number, unit?: dayjs.ManipulateType, format?: string) => {
    const daysAsNumber = typeof days === 'string' ? parseInt(days) : days;
    return dayjs().add(daysAsNumber, unit).format(format);
};

export const formatDuration = (duration: duration.Duration, format?: string) => {
    const d = Math.floor(duration.asDays());
    const h = duration.hours();
    const m = duration.minutes();
    const s = duration.seconds();
    return {
        days: d,
        timestamp: dayjs()
            .hour(h)
            .minute(m)
            .second(s)
            .format(format || 'HH:mm:ss'),
    };
};

export const isTimeValid = (time_str: string) =>
    /^([0-9]|[0-1][0-9]|2[0-3]):([0-9]|[0-5][0-9])(:([0-9]|[0-5][0-9]))?$/.test(time_str);

export const isHourValid = (time_str: string) =>
    isTimeValid(time_str) && /^([01][0-9]|2[0-3])$/.test(time_str.split(':')[0]);

export const isMinuteValid = (time_str: string) => isTimeValid(time_str) && /^[0-5][0-9]$/.test(time_str.split(':')[1]);

export const isDateValid = (date: dayjs.ConfigType) => dayjs(date, 'DD MMM YYYY').isValid();

export const addDays = (date: string | dayjs.ConfigType, num_of_days: number) => dayjs(date).add(num_of_days, 'day');

export const addWeeks = (date: string, num_of_weeks: number) => dayjs(date).add(num_of_weeks, 'week');

export const addMonths = (date: dayjs.ConfigType, num_of_months: number) => dayjs(date).add(num_of_months, 'month');

export const addYears = (date: dayjs.ConfigType, num_of_years: number) => dayjs(date).add(num_of_years, 'year');

export const subDays = (date: dayjs.ConfigType, num_of_days: number) => dayjs(date).subtract(num_of_days, 'day');

export const subMonths = (date: dayjs.ConfigType, num_of_months: number) =>
    dayjs(date).subtract(num_of_months, 'month');

export const subYears = (date: dayjs.ConfigType, num_of_years: number) => dayjs(date).subtract(num_of_years, 'year');

export const minDate = (date_1: dayjs.ConfigType, date_2: dayjs.ConfigType) => {
    const dayjs_date_1 = dayjs(date_1);
    const dayjs_date_2 = dayjs(date_2);
    return dayjs_date_1.isBefore(dayjs_date_2) ? dayjs_date_1 : dayjs_date_2;
};

export const getStartOfMonth = (date: dayjs.ConfigType) => dayjs(date).startOf('month').format('YYYY-MM-DD');

export const formatMilliseconds = (miliseconds: dayjs.ConfigType, str_format: string, is_local_time = false) => {
    if (is_local_time) {
        return dayjs(miliseconds).format(str_format);
    }
    return dayjs.utc(miliseconds).format(str_format);
};

export const convertDateFormat = (date: dayjs.ConfigType, from_date_format: string, to_date_format: string) =>
    dayjs(date, from_date_format).format(to_date_format);

export const convertTimeFormat = (time: string) => {
    const time_dayjs_obj = dayjs(time, 'HH:mm');
    const time_hour = time_dayjs_obj.format('HH');
    const time_min = time_dayjs_obj.format('mm');
    const formatted_time = `${Number(time_hour) % 12 || 12}:${time_min}`;
    const time_suffix = `${Number(time_hour) >= 12 ? 'PM' : 'AM'}`;
    return `${formatted_time} ${time_suffix}`;
};

export const getTimeSince = (timestamp: number) => {
    if (!timestamp) return '';
    const seconds_passed = Math.floor((Date.now() - timestamp) / 1000);

    if (seconds_passed < 60) {
        return localize('{{seconds_passed}}s ago', { seconds_passed });
    }
    if (seconds_passed < 3600) {
        return localize('{{minutes_passed}}m ago', { minutes_passed: Math.floor(seconds_passed / 60) });
    }
    if (seconds_passed < 86400) {
        return localize('{{hours_passed}}h ago', { hours_passed: Math.floor(seconds_passed / 3600) });
    }
    return localize('{{days_passed}}d ago', { days_passed: Math.floor(seconds_passed / (3600 * 24)) });
};
