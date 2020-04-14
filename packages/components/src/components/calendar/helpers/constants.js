import { toMoment } from '@deriv/shared/utils/date';

// TODO: localize
export const month_headers = {
    Jan: 'Jan',
    Feb: 'Feb',
    Mar: 'Mar',
    Apr: 'Apr',
    May: 'May',
    Jun: 'Jun',
    Jul: 'Jul',
    Aug: 'Aug',
    Sep: 'Sep',
    Oct: 'Oct',
    Nov: 'Nov',
    Dec: 'Dec',
};

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

export const getDecade = moment_date =>
    `${toMoment(moment_date).year()}-${toMoment(moment_date)
        .add(9, 'years')
        .year()}`;

export const getCentury = moment_date =>
    `${toMoment(moment_date).year()}-${toMoment(moment_date)
        .add(99, 'years')
        .year()}`;
