export const getFormattedDateString = (date_obj, is_local = false, has_seconds = false) => {
    if (!(date_obj instanceof Date)) {
        throw Error('getFormattedDateString argument needs an instance of Date');
    }

    const date_string = is_local ? date_obj.toString().split(' ') : date_obj.toUTCString().split(' ');
    const [, day, month, year, time] = date_string;
    const times = time.split(':');

    // Return time in the format "HH:mm:ss". e.g.: "01 Jan 1970 21:01:11"
    if (!has_seconds) {
        times.pop();
    }

    const time_without_sec = times.join(':');

    // Return in the format "DD MMM YYYY HH:mm". e.g.: "01 Jan 1970 21:01"
    return `${day} ${month} ${year}, ${time_without_sec}`;
};

export const convertToMillis = epoch => {
    if (typeof epoch !== 'number') {
        throw Error('getLocalEpoch argument needs a number');
    }

    const milliseconds = epoch * 1000;
    return milliseconds;
};

export const getDateAfterHours = (initial_epoch, hours) => {
    if (typeof initial_epoch !== 'number') {
        throw Error('getLocalEpoch argument needs a number');
    }

    const milliseconds = hours * 60 * 60 * 1000;
    const initial_day_milliseconds = convertToMillis(initial_epoch);
    const total_milliseconds = initial_day_milliseconds + milliseconds;

    return getFormattedDateString(new Date(total_milliseconds));
};

// add 0 and slice(-2) to get a 0 in front if it's a single digit so we can maintain double digits
// otherwise it will slice off the 0 and still result in double digits
const toDoubleDigits = number => `0${number}`.slice(-2);

export const secondsToTimer = distance => {
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    return `${toDoubleDigits(hours)}:${toDoubleDigits(minutes)}:${toDoubleDigits(seconds)}`;
};

/**
 * Calculate the difference in hours between the current time and a given time.
 *
 * @param {string} time_set - The time to compare against.
 * @returns {number|undefined} The difference in hours between the current time and the given time. Returns `undefined` if the input is invalid.
 */
export const getHoursDifference = time_set => {
    if (!time_set) return undefined;
    const current_time = new Date();
    const updated_time = new Date(time_set);
    const difference = current_time.getTime() - updated_time.getTime();
    const hours_difference = Math.floor(difference / 1000 / 60 / 60);
    return hours_difference;
};
