import dayjs from 'dayjs';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import quarterOfYear from 'dayjs/plugin/quarterOfYear';

dayjs.extend(weekOfYear);
dayjs.extend(quarterOfYear);

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

export const getDecade = (date: dayjs.ConfigType) => {
    const year = dayjs(date).year();
    const decade_start_year = year - (year % 10) + 1;
    return `${decade_start_year}-${decade_start_year + 9}`;
};

export const getCentury = (date: dayjs.ConfigType) => {
    const year = dayjs(date).year();
    const decade_start_year = year - (year % 10) + 1;
    return `${decade_start_year}-${decade_start_year + 99}`;
};

export const getDate = (date: dayjs.Dayjs, type: dayjs.OpUnitType, date_format: string, selected_date_part: number) => {
    switch (type) {
        case 'year':
            return date.year(selected_date_part).format(date_format);
        case 'month':
            return date.month(selected_date_part).format(date_format);
        case 'week':
            return date.week(selected_date_part).format(date_format);
        case 'day':
            return date.day(selected_date_part).format(date_format);
        case 'hour':
            return date.hour(selected_date_part).format(date_format);
        case 'minute':
            return date.minute(selected_date_part).format(date_format);
        case 'second':
            return date.second(selected_date_part).format(date_format);
        case 'millisecond':
            return date.millisecond(selected_date_part).format(date_format);
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        // https://github.com/iamkun/dayjs/issues/2557
        case 'quarter':
            return date.quarter(selected_date_part).format(date_format);
        case 'date':
            return date.date(selected_date_part).format(date_format);
        default:
            return date.day(selected_date_part).format(date_format);
    }
};
