export const getFormattedDateString = (date_obj) => {
    if (!(date_obj instanceof Date)) throw Error('getFormattedDateString argument needs an instance of Date');

    const [, day, month, year, time] = date_obj.toUTCString().split(' ');

    // Return in the format "DD MMM YYYY HH:mm:ss". e.g.: "01 Jan 1970 21:01:02"
    return `${day} ${month} ${year} ${time}`;
};

export const convertToMillis = (epoch) => {
    if (typeof epoch !== 'number') throw Error('getLocalEpoch argument needs a number');

    const local_unix = epoch * 1000;

    return local_unix;
};

export const secondsToTimer = (distance) => {
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    return `${hours}:${minutes}:${seconds}`;
};
