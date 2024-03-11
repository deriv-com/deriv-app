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
        const todayMoment = moment();
        const daysInMonth = todayMoment.utc().daysInMonth();
        const valueAsNumber = moment.utc(value, 'DD MMM YYYY').valueOf() / (1000 * 60 * 60 * 24);
        return valueAsNumber > daysInMonth
            ? moment.utc(todayMoment.add(value.valueOf(), 'd'), 'DD MMM YYYY')
            : moment.utc(value, 'DD MMM YYYY'); // returns target date
    }
    return moment.utc(value);
};

/**
 * return the number of days since the date specified
 * @param  {String} date   the date to calculate number of days since
 * @return {Number} an integer of the number of days
 */
export const daysSince = (date: string) => {
    const diff = toMoment().startOf('day').diff(toMoment(date).startOf('day'), 'days');
    return !date ? '' : diff;
};

/**
 * The below function is used to format the display the time given in minutes to hours and minutes
 * e.g. 90 minutes will be displayed as 1 hour 30 minutes
 * @param {number} minutes
 * @returns {string} formatted time string e.g. 1 hour 30 minutes
 */
export const formatTime = (minutes: number) => {
    if (!minutes) return '';
    const timeInMinutes = minutes / 60;
    const hours = Math.floor(timeInMinutes / 60);
    const remainingMinutes = timeInMinutes % 60;
    const hoursText = hours === 1 ? 'hour' : 'hours';
    const minutesText = remainingMinutes === 1 ? 'minute' : 'minutes';

    if (hours === 0) {
        return `${remainingMinutes} ${minutesText}`;
    }

    if (remainingMinutes === 0) {
        return `${hours} ${hoursText}`;
    }

    return `${hours} ${hoursText} ${remainingMinutes} ${minutesText}`;
};

/**
 * returns miliseconds into UTC formatted string
 * @param {Number} miliseconds miliseconds
 * @param {String} strFormat formatting using moment e.g - YYYY-MM-DD HH:mm
 */
export const formatMilliseconds = (miliseconds: moment.MomentInput, strFormat: string, isLocalTime = false) => {
    if (isLocalTime) {
        return moment(miliseconds).format(strFormat);
    }
    return moment.utc(miliseconds).format(strFormat);
};
