import PendingPromise from '../../utils/pending-promise';

const ServerTime = (() => {
    let clock_started = false;
    const pending = new PendingPromise();
    let common_store;

    const init = store => {
        if (!clock_started) {
            common_store = store;
            pending.resolve(common_store.server_time);
            clock_started = true;
        }
    };

    const get = () => (clock_started && common_store.server_time ? common_store.server_time.clone() : undefined);

    return {
        init,
        get,
        timePromise: () => (clock_started ? Promise.resolve(common_store.server_time) : pending.promise),
    };
})();

export default ServerTime;
