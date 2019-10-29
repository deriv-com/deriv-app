const PromiseClass = require('../utility').PromiseClass;

const ServerTime = (() => {
    let clock_started = false;
    let pending = new PromiseClass();
    let server_time;

    const init = (timePromise, store_server_time) => {
        if (!clock_started) {
            pending = timePromise;
            server_time = store_server_time;
            clock_started = true;
        }
    };

    const get = () => clock_started && server_time ? server_time.clone() : undefined;

    return {
        init,
        get,
        timePromise: () => pending.promise,
    };
})();

module.exports = ServerTime;
