const Client         = require('../base/client');
const CookieStorage  = require('../../_common/storage').CookieStorage;
const LocalStore     = require('../../_common/storage').LocalStore;
const Url            = require('../../_common/url');

/*
 * Handles utm parameters/referrer to use on signup
 *
 * Priorities:
 * 1. Cookie having utm data (utm_source, utm_medium, utm_campaign) [Expires in 3 months]
 * 2. Query string utm parameters
 * 3. document.referrer
 *
 */

const TrafficSource = (() => {
    let cookie;

    const initCookie = () => {
        if (!cookie) {
            cookie = new CookieStorage('utm_data');
            cookie.read();
            // expiration date is used when writing cookie
            const now      = new Date();
            cookie.expires = now.setMonth(now.getMonth() + 3);
        }
    };

    const getData = () => {
        initCookie();
        const data = cookie.value;
        Object.keys(data).map((key) => {
            data[key] = (data[key] || '').replace(/[^a-zA-Z0-9\s-._]/gi, '').substring(0, 100);
        });
        return data;
    };

    // get source in order of precedence
    const getSource = (utm_data = getData()) => utm_data.utm_source || utm_data.referrer || 'direct';

    const setData = () => {
        if (Client.isLoggedIn()) {
            clearData();
            return;
        }

        const current_values = getData();
        const params         = Url.paramsHash();
        const param_keys     = ['utm_source', 'utm_medium', 'utm_campaign'];

        if (params.utm_source) { // url params can be stored only if utm_source is available
            param_keys.map((key) => {
                if (params[key] && !current_values[key]) {
                    cookie.set(key, params[key]);
                }
            });
        }

        // Store gclid
        if (params.gclid && !Client.isLoggedIn()) {
            LocalStore.set('gclid', params.gclid);
        }

        const doc_ref = document.referrer;
        let referrer  = localStorage.getItem('index_referrer') || doc_ref;
        localStorage.removeItem('index_referrer');
        if (doc_ref && !(new RegExp(window.location.hostname, 'i')).test(doc_ref)) {
            referrer = doc_ref;
        }
        if (referrer && !current_values.referrer && !params.utm_source && !current_values.utm_source) {
            cookie.set('referrer', (Url.getLocation(referrer)).hostname);
        }
    };

    const clearData = () => {
        initCookie();
        cookie.remove();
    };

    return {
        getData,
        setData,
        clearData,
        getSource,
    };
})();

module.exports = TrafficSource;
