export const getFormattedDateString = date_obj => {
    if (!(date_obj instanceof Date)) throw Error('getFormattedDateString argument needs an instance of Date');

    const [, day, month, year, time] = date_obj.toUTCString().split(' ');

    // Return in the format "DD MMM YYYY HH:mm:ss". e.g.: "01 Jan 1970 21:01:02"
    return `${day} ${month} ${year} ${time}`;
};

export const convertToMillis = epoch => {
    if (typeof epoch !== 'number') throw Error('getLocalEpoch argument needs a number');

    const milliseconds = epoch * 1000;

    return milliseconds;
};

// add 0 and slice(-2) to get a 0 in front if it's a single digit so we can mantain double digits
// otherwise it will slice off the 0 and still result in double digits
const toDoubleDigits = number => `0${number}`.slice(-2);

export const secondsToTimer = distance => {
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    return `${toDoubleDigits(hours)}:${toDoubleDigits(minutes)}:${toDoubleDigits(seconds)}`;
};
