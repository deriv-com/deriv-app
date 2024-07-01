import moment from 'moment';
import 'moment/min/locales';

// Localize moment instance with specific object
export const initMoment = (lang) => moment.locale(lang);

/**
 * Convert epoch to moment object
 * @param  {Number} epoch
 * @return {moment} the moment object of provided epoch
 */
export const epochToMoment = (epoch) => moment.unix(epoch).utc();

/**
 * Convert date string or epoch to moment object
 * @param  {Number} value   the date in epoch format
 * @param  {String} value   the date in string format
 * @return {moment} the moment object of 'now' or the provided date epoch or string
 */
export const toMoment = (value) => {
    if (!value) return moment().utc(); // returns 'now' moment object
    if (value instanceof moment && (value).isValid() && (value).isUTC())
        return value; // returns if already a moment object
    if (typeof value === 'number') return epochToMoment(value); // returns epochToMoment() if not a date

    if (/invalid/i.test(moment(value).toString())) {
        const today_moment = moment();
        const days_in_month = today_moment.utc().daysInMonth();
        const value_as_number = moment.utc(value, 'DD MMM YYYY').valueOf() / (1000 * 60 * 60 * 24);
        return value_as_number > days_in_month
            ? moment.utc(today_moment.add(value, 'd'), 'DD MMM YYYY')
            : moment.utc(value, 'DD MMM YYYY'); // returns target date
    }
    return moment.utc(value);
};

export const formatDate = (date, date_format = 'YYYY-MM-DD', should_format_null = true) =>
    !should_format_null && date === null ? undefined : toMoment(date).format(date_format);

export const formatTime = (epoch, time_format = 'HH:mm:ss [GMT]') =>
    toMoment(epoch).format(time_format);
