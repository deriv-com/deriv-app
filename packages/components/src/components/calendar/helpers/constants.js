import { toMoment } from '@deriv/shared';

export const week_headers = {
    Monday: 'Monday',
    Tuesday: 'Tuesday',
    Wednesday: 'Wednesday',
    Thursday: 'Thursday',
    Friday: 'Friday',
    Saturday: 'Saturday',
    Sunday: 'Sunday',
};

export const week_headers_abbr = {
    Monday: 'M',
    Tuesday: 'T',
    Wednesday: 'W',
    Thursday: 'T',
    Friday: 'F',
    Saturday: 'S',
    Sunday: 'S',
};

export const getDaysOfTheWeek = day => {
    const days_of_the_week = {
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

export const getDecade = moment_date => {
    const year = toMoment(moment_date).year();
    const decade_start_year = year - (year % 10) + 1;
    return `${decade_start_year}-${decade_start_year + 9}`;
};

export const getCentury = moment_date => {
    const year = toMoment(moment_date).year();
    const decade_start_year = year - (year % 10) + 1;
    return `${decade_start_year}-${decade_start_year + 99}`;
};
