const getElementById = require('../../../_common/common_functions').getElementById;
const isVisible      = require('../../../_common/common_functions').isVisible;
const State          = require('../../../_common/storage').State;
const Url            = require('../../../_common/url');
const isEmptyObject  = require('../../../_common/utility').isEmptyObject;

/*
 * Handles trading page default values
 *
 * Priorities:
 * 1. Client's input: on each change to form, it will reflect to both query string & session storage
 * 2. Query string parameters: will change session storage values
 * 3. Session storage values: if none of the above, it will be the source
 *
 */

const Defaults = (() => {
    let params       = {};
    const getDefault = (key) => {
        const p_value = params[key] || Url.param(key);
        const s_value = sessionStorage.getItem(key);
        if (p_value && (!s_value || p_value !== s_value)) {
            sessionStorage.setItem(key, p_value);
        }
        if (!p_value && s_value) {
            setDefault(key, s_value);
        }
        return p_value || s_value;
    };

    const setDefault = (key, value = '') => {
        if (!key) return;
        if (isEmptyObject(params)) params = Url.paramsHash();
        if (params[key] !== value) {
            params[key] = value;
            // to increase speed, do not set values when form is still loading
            if (!isVisible(getElementById('trading_init_progress'))) {
                sessionStorage.setItem(key, value);
                updateURL();
            }
        }
    };

    const removeDefault = (...keys) => {
        if (isEmptyObject(params)) params = Url.paramsHash();
        let is_updated = false;
        keys.forEach((key) => {
            if (key in params) {
                sessionStorage.removeItem(key);
                delete params[key];
                is_updated = true;
            }
        });
        if (is_updated) {
            updateURL();
        }
    };

    const updateAll = () => {
        Object.keys(params).forEach((key) => {
            sessionStorage.setItem(key, params[key]);
        });
        updateURL();
    };

    const updateURL = () => {
        if (!State.get('is_trading')) return;
        Url.updateParamsWithoutReload(params, false);
    };

    return {
        get   : getDefault,
        set   : setDefault,
        update: updateAll,
        remove: removeDefault,
        clear : () => { params = {}; },
    };
})();

module.exports = Defaults;
