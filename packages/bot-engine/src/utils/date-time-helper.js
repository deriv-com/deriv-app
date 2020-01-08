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