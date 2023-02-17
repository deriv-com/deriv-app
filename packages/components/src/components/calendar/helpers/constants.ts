import { toMoment } from '@deriv/shared';
import moment from 'moment';

export const week_headers: Record<
    string,
    'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday'
> = {
    Monday: 'Monday',
    Tuesday: 'Tuesday',
    Wednesday: 'Wednesday',
    Thursday: 'Thursday',
    Friday: 'Friday',
    Saturday: 'Saturday',
    Sunday: 'Sunday',
};

export const week_headers_abbr: Record<string, 'M' | 'T' | 'W' | 'T' | 'F' | 'S'> = {
    Monday: 'M',
    Tuesday: 'T',
    Wednesday: 'W',
    Thursday: 'T',
    Friday: 'F',
    Saturday: 'S',
    Sunday: 'S',
};

export const getDaysOfTheWeek = (day: string) => {
    const days_of_the_week: Record<string, 0 | 1 | 2 | 3 | 4 | 5 | 6> = {
        Mondays: 1,
        Tuesdays: 2,
        Wednesdays: 3,
        Thursdays: 4,
        Fridays: 5,
        Saturdays: 6,
        Sundays: 0,
    };

    return days_of_the_week[day];
};

export const getDecade = (moment_date: moment.MomentInput) => {
    const year = toMoment(moment_date).year();
    const decade_start_year = year - (year % 10) + 1;
    return `${decade_start_year}-${decade_start_year + 9}`;
};

export const getCentury = (moment_date: moment.MomentInput) => {
    const year = toMoment(moment_date).year();
    const decade_start_year = year - (year % 10) + 1;
    return `${decade_start_year}-${decade_start_year + 99}`;
};

export const getDate = (
    date: moment.Moment,
    type: moment.unitOfTime.StartOf,
    date_format: string,
    selected_date_part: number
) => {
    switch (type) {
        case 'year':
        case 'y':
        case 'years':
            return date.year(selected_date_part).format(date_format);
        case 'month':
        case 'months':
        case 'M':
            return date.month(selected_date_part).format(date_format);
        case 'week':
        case 'w':
            return date.week(selected_date_part).format(date_format);
        case 'weeks':
            return date.weeks(selected_date_part).format(date_format);
        case 'day':
        case 'd':
            return date.day(selected_date_part).format(date_format);
        case 'days':
            return date.days(selected_date_part).format(date_format);
        case 'hour':
        case 'h':
            return date.hour(selected_date_part).format(date_format);
        case 'hours':
            return date.hours(selected_date_part).format(date_format);
        case 'minute':
        case 'm':
            return date.minute(selected_date_part).format(date_format);
        case 'minutes':
            return date.minutes(selected_date_part).format(date_format);
        case 'second':
        case 's':
            return date.second(selected_date_part).format(date_format);
        case 'seconds':
            return date.seconds(selected_date_part).format(date_format);
        case 'millisecond':
        case 'ms':
            return date.millisecond(selected_date_part).format(date_format);
        case 'milliseconds':
            return date.milliseconds(selected_date_part).format(date_format);
        case 'quarter':
        case 'Q':
            return date.quarter(selected_date_part).format(date_format);
        case 'quarters':
            return date.quarters(selected_date_part).format(date_format);
        case 'isoWeek':
        case 'W':
            return date.isoWeek(selected_date_part).format(date_format);
        case 'isoWeeks':
            return date.isoWeeks(selected_date_part).format(date_format);
        case 'date':
        case 'dates':
        case 'D':
            return date.date(selected_date_part).format(date_format);
        default:
            return date.day(selected_date_part).format(date_format);
    }
};
