import React from 'react';
import useQuery from '../useQuery';
import { toMoment } from '@deriv/utils';

/**
 * Hook that returns the current server time fetched using `time` endpoint
 */
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
