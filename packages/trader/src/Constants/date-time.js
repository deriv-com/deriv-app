import { localize } from 'deriv-translations';

export const month_headers = {
    Jan: localize('Jan'),
    Feb: localize('Feb'),
    Mar: localize('Mar'),
    Apr: localize('Apr'),
    May: localize('May'),
    Jun: localize('Jun'),
    Jul: localize('Jul'),
    Aug: localize('Aug'),
    Sep: localize('Sep'),
    Oct: localize('Oct'),
    Nov: localize('Nov'),
    Dec: localize('Dec'),
};

export const week_headers = {
    Monday   : localize('Monday'),
    Tuesday  : localize('Tuesday'),
    Wednesday: localize('Wednesday'),
    Thursday : localize('Thursday'),
    Friday   : localize('Friday'),
    Saturday : localize('Saturday'),
    Sunday   : localize('Sunday'),
};

export const week_headers_abbr = {
    Monday   : localize('M'),
    Tuesday  : localize('T'),
    Wednesday: localize('W'),
    Thursday : localize('T'),
    Friday   : localize('F'),
    Saturday : localize('S'),
    Sunday   : localize('S'),
};

export const getDaysOfTheWeek = (day) => {
    const days_of_the_week = {
        'Mondays'   : 1,
        'Tuesdays'  : 2,
        'Wednesdays': 3,
        'Thursdays' : 4,
        'Fridays'   : 5,
        'Saturdays' : 6,
        'Sundays'   : 0,
    };

    return days_of_the_week[day];
};
