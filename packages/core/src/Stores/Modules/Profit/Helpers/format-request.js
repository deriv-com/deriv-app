import {
    epochToMoment,
    toMoment,
} from 'Utils/Date';

const getDateTo = (partial_fetch_time, date_to) => {
    const today = toMoment().startOf('day').unix();
    if (date_to && today > date_to) {
        return date_to;
    } else if (partial_fetch_time) {
        return epochToMoment(today).add(1, 'd').subtract(1, 's').unix();
    }
    return epochToMoment(today).add(1, 'd').subtract(1, 's').unix();
};

const getDateFrom = (should_load_partially, partial_fetch_time, date_from, date_to) => {
    const today = toMoment().startOf('day').unix();
    if (today > date_to) {
        return date_from;
    }
    return should_load_partially && partial_fetch_time ? partial_fetch_time : date_from;
};

const shouldSendDateFrom = (date_from, should_load_partially, partial_fetch_time, date_to) => {
    const today = toMoment().startOf('day').unix();
    if (today > date_to) {
        return (!!date_from || should_load_partially);
    }
    return should_load_partially ? (partial_fetch_time || date_from) : !!date_from || false;
};

const getDateBoundaries = (date_from, date_to, partial_fetch_time, should_load_partially = false) => (
    {
        // eslint-disable-next-line max-len
        ...(shouldSendDateFrom(date_from, should_load_partially, partial_fetch_time, date_to)) && { date_from: getDateFrom(should_load_partially, partial_fetch_time, date_from, date_to) },
        ...(date_to || should_load_partially) && { date_to: getDateTo(partial_fetch_time, date_to) },
    }
);

export default getDateBoundaries;
