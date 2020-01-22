export const getUTCTime = date => {
    const dateObject = new Date(date);
    return `${`0${dateObject.getUTCHours()}`.slice(-2)}:${`0${dateObject.getUTCMinutes()}`.slice(
        -2
    )}:${`0${dateObject.getUTCSeconds()}`.slice(-2)}`;
};

export const durationToSecond = duration => {
    const parsedDuration = duration.match(/^([0-9]+)([stmhd])$/);
    if (!parsedDuration) {
        return 0;
    }
    const durationValue = parseFloat(parsedDuration[1]);
    const durationType = parsedDuration[2];
    if (durationType === 's') {
        return durationValue;
    }
    if (durationType === 't') {
        return durationValue * 2;
    }
    if (durationType === 'm') {
        return durationValue * 60;
    }
    if (durationType === 'h') {
        return durationValue * 60 * 60;
    }
    if (durationType === 'd') {
        return durationValue * 60 * 60 * 24;
    }
    return 0;
};

export const timeSince = timestamp => {
    const now = new Date();
    const second_past = (now.getTime() - timestamp) / 1000;

    if (second_past < 60) {
        return `${parseInt(second_past)}s ago`;
    }
    if (second_past < 3600) {
        return `${parseInt(second_past / 60)}m ago`;
    }
    if (second_past <= 86400) {
        return `${parseInt(second_past / 3600)}h ago`;
    }

    const timestamp_date = new Date(timestamp);
    const day = timestamp_date.getDate();
    const month = timestamp_date.toDateString().match(/ [a-zA-Z]*/)[0].replace(' ', '');
    const year = `${timestamp_date.getFullYear() === now.getFullYear() ? '' : ' '}${timestamp_date.getFullYear()}`;
    return `${day} ${month}${year}`;
};
