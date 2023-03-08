import { convertToMillis } from 'Utils/date-time';
import { toMoment } from '@deriv/shared';

let server_time;

const init = server_time_payload => {
    server_time = server_time_payload;
};

const get = () => (server_time ? convertToMillis(toMoment(server_time.get()).unix()) : server_time);

const getDistanceToServerTime = compare_millis_time => {
    const now_millis = get();
    const distance = compare_millis_time - now_millis;

    return distance;
};

export default {
    init,
    get,
    getDistanceToServerTime,
};
