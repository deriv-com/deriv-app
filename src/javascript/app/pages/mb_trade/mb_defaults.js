const isEmptyObject = require('../../../_common/utility').isEmptyObject;

/*
 * Handles trading page default values
 *
 * Priorities:
 * 1. Client's input: on each change to form, it will reflect to both query string & session storage
 * 2. Local storage values: if none of the above, it will be the source
 *
 */

const MBDefaults = (() => {
    let params = {};

    const getDefault = (key) => {
        loadParams();
        return params[key];
    };

    const loadParams = () => {
        if (isEmptyObject(params)) params = JSON.parse(localStorage.getItem('mb_trading') || false) || {};
    };

    const saveParams = () => {
        localStorage.setItem('mb_trading', JSON.stringify(params));
    };

    const setDefault = (key, value = '') => {
        if (!key) return;
        loadParams();
        if (params[key] !== value) {
            params[key] = value;
            saveParams();
        }
    };

    const removeDefault = (...keys) => {
        loadParams();
        let is_updated = false;
        keys.forEach((key) => {
            if (key in params) {
                delete params[key];
                is_updated = true;
            }
        });
        if (is_updated) {
            saveParams();
        }
    };

    return {
        get   : getDefault,
        set   : setDefault,
        remove: removeDefault,
        clear : () => { params = {}; },
    };
})();

module.exports = MBDefaults;
