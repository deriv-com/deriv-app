import React from 'react';
import useQuery from '../useQuery';
import moment from 'moment';

const epochToMoment = (epoch: number) => moment.unix(epoch).utc();

const toMoment = (value?: moment.MomentInput): moment.Moment => {
    if (!value) return moment().utc(); // returns 'now' moment object
    if (value instanceof moment && (value as moment.Moment).isValid() && (value as moment.Moment).isUTC())
        return value as moment.Moment; // returns if already a moment object
    if (typeof value === 'number') return epochToMoment(value); // returns epochToMoment() if not a date

    if (/invalid/i.test(moment(value).toString())) {
        const today_moment = moment();
        const days_in_month = today_moment.utc().daysInMonth();
        const value_as_number = moment.utc(value, 'DD MMM YYYY').valueOf() / (1000 * 60 * 60 * 24);
        return value_as_number > days_in_month
            ? moment.utc(today_moment.add(value as string | number, 'd'), 'DD MMM YYYY')
            : moment.utc(value, 'DD MMM YYYY'); // returns target date
    }
    return moment.utc(value);
};

const useServerTime = () => {
    const { data, ...rest } = useQuery('time');

    const modified_data = React.useMemo(() => {
        if (!data) return;

        const server_time_moment = toMoment(data.time);
        return {
            ...data,
            /** Returns the server time in UTC format */
            server_time_utc: server_time_moment.utc().valueOf(),
            /** Returns the server time in an instance of Moment */
            server_time_moment,
        };
    }, [data]);

    return {
        data: modified_data,
        ...rest,
    };
};

export default useServerTime;
