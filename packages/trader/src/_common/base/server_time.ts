import { TCoreStores } from '@deriv/stores/types';
import { PromiseUtils } from '@deriv-com/utils';

const ServerTime = (() => {
    let clock_started = false;
    const pending = PromiseUtils.createPromise();
    let common_store: TCoreStores['common'];

    const init = (store: TCoreStores['common']) => {
        if (!clock_started) {
            common_store = store;
            pending.resolve?.(common_store.server_time);
            clock_started = true;
        }
    };

    const get = () => (clock_started && common_store.server_time ? common_store.server_time.clone() : undefined);

    return {
        init,
        get,
        timePromise: () =>
            clock_started ? Promise.resolve(common_store.server_time) : (pending.promise as Promise<moment.Moment>),
    };
})();

export default ServerTime;
