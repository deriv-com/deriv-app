import moment from 'moment';
import { WS } from '@deriv/shared';
import { PromiseUtils } from '@deriv-com/utils';

let clock_started = false;
const pending = PromiseUtils.createPromise();
let server_time: moment.Moment,
    performance_request_time: number,
    get_time_interval: ReturnType<typeof setInterval>,
    update_time_interval: ReturnType<typeof setInterval>,
    onTimeUpdated: VoidFunction;

/** Request server time from the server */
const requestTime = () => {
    performance_request_time = performance.now();
    WS.send({ time: 1 }).then(timeCounter);
};

/**
 * Initialize the clock
 * @param {Function} fncTimeUpdated - The function to call when the time is updated.
 */
export const init = (fncTimeUpdated?: VoidFunction) => {
    if (!clock_started) {
        if (fncTimeUpdated) {
            onTimeUpdated = fncTimeUpdated;
        }
        requestTime();
        clearInterval(get_time_interval);
        get_time_interval = setInterval(requestTime, 30000);
        clock_started = true;
    }
};

/**
 * Update the server time
 * @param {Object} response - The response from the server.
 */
const timeCounter = (response: { error?: Error; time: number }) => {
    if (response.error) return;

    if (!clock_started) {
        init();
        return;
    }

    clearInterval(update_time_interval);

    const start_timestamp = response.time;
    const performance_response_time = performance.now();
    const time_taken = performance_response_time - performance_request_time;
    const server_time_at_response = start_timestamp * 1000 + time_taken;

    const updateTime = () => {
        const time_since_response = performance.now() - performance_response_time;
        server_time = moment(server_time_at_response + time_since_response).utc();

        if (typeof onTimeUpdated === 'function') {
            onTimeUpdated();
        }
    };
    updateTime();
    pending.resolve?.();

    update_time_interval = setInterval(updateTime, 1000);
};

/**
 * Get the server time if it is available.
 * @returns {Object | undefined} The server time.
 */
export const get = (): object | undefined => (server_time ? server_time.clone() : undefined);

/**
 * Get the distance to the server time.
 * @param {Number} compare_time - The time to compare to the server time.
 * @returns {Number} The distance to the server time.
 */
export const getDistanceToServerTime = (compare_time: number): number => {
    const time = moment(compare_time);
    const now_time = get();
    const distance = time.diff(now_time, 'milliseconds');

    return distance;
};
