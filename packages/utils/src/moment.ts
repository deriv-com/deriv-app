import moment from 'moment';

/**
 * Function that converts a numerical epoch value into a Moment instance
 */
export const epochToMoment = (epoch: number) => moment.unix(epoch).utc();

/**
 * Function that takes a primitive type and converts it into a Moment instance
 */
export const toMoment = (value?: moment.MomentInput): moment.Moment => {
    if (!value) return moment().utc(); // returns 'now' moment object
    if (moment.isMoment(value) && value.isValid() && value.isUTC()) return value; // returns if already a moment object
    if (typeof value === 'number') return epochToMoment(value); // returns epochToMoment() if not a date

    if (/invalid/i.test(moment(value).toString())) {
        const today_moment = moment();
        const days_in_month = today_moment.utc().daysInMonth();
        const value_as_number = moment.utc(value, 'DD MMM YYYY').valueOf() / (1000 * 60 * 60 * 24);
        return value_as_number > days_in_month
            ? moment.utc(today_moment.add(value.valueOf(), 'd'), 'DD MMM YYYY')
            : moment.utc(value, 'DD MMM YYYY'); // returns target date
    }
    return moment.utc(value);
};
