const moment           = require('moment');
const ObjectUtils      = require('deriv-shared/utils/object');
const { getLanguage }  = require('deriv-translations');
const getStaticHash    = require('_common/utility.js').getStaticHash;
const LocalStore       = require('../storage').LocalStore;

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
    const config = {
        payout_currencies     : { expire: 120 },
        proposal_open_contract: { expire: 10 },
        active_symbols        : { expire: 10 },
        contracts_for         : { expire: 10 },
        exchange_rates        : { expire: 60 },
        ticks_history         : { expire: 10 },
        trading_times         : { expire: 120 },
        // TODO: Enable statement and profit table caching once we have UI design for handling
        // transitions between cached table and newly added data to table
        // statement             : { expire: 10 },
        // profit_table          : { expire: 10 },
    };

    const storage_key = 'ws_cache';

    let data_obj = {};

    const msg_type_mapping = {
        history: 'ticks_history',
        candles: 'ticks_history',
    };

    const isMarketClosed = (active_symbols = [], symbol) => {
        if (!active_symbols.length) return false;
        return (active_symbols.filter(x => x.symbol === symbol)[0]) ?
            !active_symbols.filter(symbol_info => symbol_info.symbol === symbol)[0].exchange_is_open
            :
            false;
    };

    const set = (key, response) => {
        const msg_type = msg_type_mapping[response.msg_type] || response.msg_type;

        // Excluding closed markets from caching once we have ws_cache and active_symbols cache set up
        const ws_cache = JSON.parse(localStorage.getItem('ws_cache'));
        // TODO: Update method of getting language from cookies once we have it in ui_store localStorage
        const curr_lang = getLanguage();
        const active_symbols_obj = curr_lang ? `active_symbols___${curr_lang}` : null;

        if (!ObjectUtils.isEmptyObject(ws_cache)) {
            if (msg_type === 'ticks_history' && !ObjectUtils.isEmptyObject(ws_cache[active_symbols_obj])) {
                const active_symbols = ws_cache[active_symbols_obj].value.active_symbols;
                const curr_symbol    = response.echo_req.ticks_history;
                if (isMarketClosed(active_symbols, curr_symbol)) {
                    return;
                }
            }
        }

        // check if response has subscription, since we only want to cache non-streaming responses
        if (response.subscription || (response.echo_req.end === 'latest')) return;

        if (!config[msg_type]) return;
        // prevent unwanted page behaviour
        // if a cached version already exists but it gives an error after being called for updating the cache
        const cached_response = get(response.echo_req) || {};
        const cached_message  = cached_response[msg_type];
        const new_message     = response[msg_type];

        const has_error_or_missing = response.error; // || !(msg_type in response);
        const has_new_value        = cached_message && isEmptyValue(cached_message) && !isEmptyValue(new_message);
        const has_old_cache        = cached_message && isEmptyValue(new_message) && !isEmptyValue(cached_message);
        const has_valid_cache      = !isEmptyValue(cached_response) && !cached_response.error;

        if ((has_error_or_missing || has_new_value || has_old_cache) && has_valid_cache) {
            clear();
            // window.location.reload();
            return;
        }

        const expires  = moment().add(config[msg_type].expire, 'm').valueOf();

        if (!data_obj.static_hash) {
            data_obj.static_hash = getStaticHash();
        }

        data_obj[key] = { value: response, expires, msg_type  };
        LocalStore.setObject(storage_key, data_obj);
    };

    const isEmptyValue = (data) => {
        let is_empty_data = false;
        if (Array.isArray(data)) {
            if (!data.length) {
                is_empty_data = true;
            }
        } else if (typeof response_data === 'object') {
            if (!Object.keys(data).length) {
                is_empty_data = true;
            }
        }
        return is_empty_data;
    };

    const reloadDataObj = () => {
        if (ObjectUtils.isEmptyObject(data_obj)) {
            data_obj = LocalStore.getObject(storage_key);
            if (ObjectUtils.isEmptyObject(data_obj)) return;
        }

        if (data_obj.static_hash !== getStaticHash()) { // new release
            clear();
        }
    };

    const getData = key => (ObjectUtils.getPropertyValue(data_obj, key) || {});

    const get = (key) => {
        reloadDataObj();

        const response_obj = getData(key);

        let response;
        if (moment().isBefore(response_obj.expires)) {
            response = response_obj.value;
        } else { // remove if expired
            remove(key);
        }

        return response;
    };

    const getByMsgType = (msg_type) => {
        reloadDataObj();

        const key = Object.keys(data_obj).find(k => getData(k).msg_type === msg_type);

        if (!key) return undefined;

        const response_obj = getData(key);

        let response;
        if (moment().isBefore(response_obj.expires)) {
            response = response_obj.value;
        } else { // remove if expired
            remove(key);
        }

        return response;
    };

    const has = (key) => {
        return !!get(key);
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
        getByMsgType,
        has,
        remove,
        clear,
    };
})();

module.exports = SocketCache;
