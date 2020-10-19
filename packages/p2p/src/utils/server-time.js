import { convertToMillis } from 'Utils/date-time';

let server_time;

const init = server_time_payload => {
    server_time = server_time_payload;
};

const get = () => (server_time ? convertToMillis(server_time.get().utc().unix()) : server_time);

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
