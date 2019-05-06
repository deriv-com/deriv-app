const moment           = require('moment');
const getLanguage      = require('../language').get;
const LocalStore       = require('../storage').LocalStore;
const getPropertyValue = require('../utility').getPropertyValue;
const getStaticHash    = require('../utility').getStaticHash;
const isEmptyObject    = require('../utility').isEmptyObject;

/*
 * Caches WS responses to reduce delay time and number of requests
 * Stores data in LocalStore which is the first one available in: localStorage, sessionStorage, InScriptStore
 *
 * 1. It caches only the response of those calls which determined in `config`
 * 2. It doesn't cache responses which returned error
 * 3. The value is requested by BinarySocket,
 *    if this returns a value according to the logic here, socket code take it as response
 *    but also triggers an async `send` request, to keep the cache updated for next time
 * 4. Uses client's time to set and check for expiry, as the expire durations are not so long to need a more precise one
 *    (And doesn't worth to wait for the response of time call)
 * 5. Some responses should be cached by a particular value from request (e.g. contracts_for_frxAUDJPY)
 *    so there can be more than one value for a particular call
 * 6. Clears the whole cache regardless their expire time on the following events:
 *    6.1. Client changes: login / logout / switch loginid
 *    6.2. Detect a new release (static hash changed)
 */
const SocketCache = (() => {
    // keys are msg_type
    // expire: how long to keep the value (in minutes)
    // map_to: to store different responses of the same key, should be array of:
    //     string  : the property value from echo_req
    //     function: return value of the function
    const config = {
        payout_currencies: { expire: 10 },
        active_symbols   : { expire: 10, map_to: ['product_type', 'landing_company', getLanguage] },
        contracts_for    : { expire: 10, map_to: ['contracts_for', 'product_type', 'currency'] },
        exchange_rates   : { expire: 60, map_to: ['base_currency'] },
    };

    const storage_key = 'ws_cache';

    let data_obj = {};

    const set = (response) => {
        const msg_type = response.msg_type;

        if (!config[msg_type]) return;

        // prevent unwanted page behaviour
        // if a cached version already exists but it gives an error after being called for updating the cache
        const cashed_response = get(response.echo_req);
        if ((response.error || !response[msg_type]) && cashed_response && !cashed_response.error) {
            clear();
            window.location.reload();
            return;
        }

        const key      = makeKey(response.echo_req, msg_type);
        const expires  = moment().add(config[msg_type].expire, 'm').valueOf();

        if (!data_obj.static_hash) {
            data_obj.static_hash = getStaticHash();
        }

        data_obj[key] = { value: response, expires };
        LocalStore.setObject(storage_key, data_obj);
    };

    const get = (request, msg_type) => {
        let response;

        if (isEmptyObject(data_obj)) {
            data_obj = LocalStore.getObject(storage_key);
            if (isEmptyObject(data_obj)) return undefined;
        }

        if (data_obj.static_hash !== getStaticHash()) { // new release
            clear();
        }

        const key          = makeKey(request, msg_type);
        const response_obj = getPropertyValue(data_obj, key) || {};

        if (moment().isBefore(response_obj.expires)) {
            response = response_obj.value;
        } else { // remove if expired
            remove(key);
        }

        return response;
    };

    const makeKey = (source_obj = {}, msg_type = '') => {
        let key = msg_type || Object.keys(source_obj).find(type => config[type]);

        if (key && !isEmptyObject(source_obj)) {
            ((config[key] || {}).map_to || []).forEach((map_key) => {
                const value = typeof map_key === 'function' ? map_key() : source_obj[map_key];
                key += map_key ? `_${value || ''}` : '';
            });
        }

        return key;
    };

    const remove = (key, should_match_all) => {
        if (should_match_all) {
            Object.keys(data_obj).forEach((data_key) => {
                if (data_key.indexOf(key) !== -1) {
                    delete data_obj[data_key];
                }
            });
        } else if (key in data_obj) {
            delete data_obj[key];
        }
        LocalStore.setObject(storage_key, data_obj);
    };

    const clear = () => {
        LocalStore.remove(storage_key);
        data_obj = {};
    };

    return {
        set,
        get,
        remove,
        clear,
    };
})();

module.exports = SocketCache;
