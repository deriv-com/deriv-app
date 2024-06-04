import { epochToMoment, toMoment } from '@deriv/shared';

type TDateToOrFrom = number | null;
type TPartialFetchTime = boolean | number;

const getDateTo = (date_to: TDateToOrFrom) => {
    const today = toMoment().startOf('day').unix();
    if (date_to && today > date_to) {
        return date_to;
    }
    return epochToMoment(today).add(1, 'd').subtract(1, 's').unix();
};

const getDateFrom = (
    should_load_partially: boolean,
    partial_fetch_time: TPartialFetchTime,
    date_from: TDateToOrFrom,
    date_to: TDateToOrFrom
) => {
    const today = toMoment().startOf('day').unix();
    if (date_to && today > date_to) {
        return date_from;
    }
    return should_load_partially && partial_fetch_time ? partial_fetch_time : date_from;
};

const shouldSendDateFrom = (
    date_from: TDateToOrFrom,
    should_load_partially: boolean,
    partial_fetch_time: TPartialFetchTime,
    date_to: TDateToOrFrom
) => {
    const today = toMoment().startOf('day').unix();
    if (date_to && today > date_to) {
        return !!date_from || should_load_partially;
    }
    return should_load_partially ? partial_fetch_time || date_from : !!date_from || false;
};

const getDateBoundaries = (
    date_from: TDateToOrFrom,
    date_to: TDateToOrFrom,
    partial_fetch_time: TPartialFetchTime,
    should_load_partially = false
) => ({
    // eslint-disable-next-line max-len
    ...(shouldSendDateFrom(date_from, should_load_partially, partial_fetch_time, date_to) && {
        date_from: getDateFrom(should_load_partially, partial_fetch_time, date_from, date_to),
    }),
    ...((date_to || should_load_partially) && { date_to: getDateTo(date_to) }),
});

export default getDateBoundaries;
