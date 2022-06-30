import moment from 'moment';
import { WS } from '@deriv/shared';
import { PromiseClass } from './utility';

let clock_started = false;
const pending = new PromiseClass();
let server_time, performance_request_time, get_time_interval, update_time_interval, onTimeUpdated;

const requestTime = () => {
    performance_request_time = performance.now();
    WS.send({ time: 1 }).then(timeCounter);
};

export const init = fncTimeUpdated => {
    if (!clock_started) {
        onTimeUpdated = fncTimeUpdated;
        requestTime();
        clearInterval(get_time_interval);
        get_time_interval = setInterval(requestTime, 30000);
        clock_started = true;
    }
};

export const timeCounter = response => {
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
    pending.resolve();
    update_time_interval = setInterval(updateTime, 1000);
};

export const timePromise = pending.promise;

export const get = () => (server_time ? server_time.clone() : undefined);
