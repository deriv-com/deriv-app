const urlForLanguage         = require('./language').urlFor;
const urlLang                = require('./language').urlLang;
const createElement          = require('./utility').createElement;
const isEmptyObject          = require('./utility').isEmptyObject;
const getCurrentBinaryDomain = require('../config').getCurrentBinaryDomain;
require('url-polyfill');

const Url = (() => {
    let location_url,
        static_host;

    const init = (url) => {
        location_url = url ? getLocation(url) : window.location;
    };

    const getLocation = url => createElement('a', { href: decodeURIComponent(url) });

    const reset = () => {
        location_url = window ? window.location : location_url;
    };

    const params = (href) => {
        const arr_params = [];
        const parsed     = ((href ? new URL(href) : location_url).search || '').substr(1).split('&');
        let p_l          = parsed.length;
        while (p_l--) {
            const param = parsed[p_l].split('=');
            arr_params.push(param);
        }
        return arr_params;
    };

    const paramsHash = (href) => {
        const param_hash = {};
        const arr_params = params(href);
        let param        = arr_params.length;
        while (param--) {
            if (arr_params[param][0]) {
                param_hash[arr_params[param][0]] = arr_params[param][1] || '';
            }
        }
        return param_hash;
    };

    const paramsHashToString = pars => (isEmptyObject(pars) ? '' : Object.keys(pars).map(key => `${key}=${pars[key] || ''}`).join('&'));

    const normalizePath = path => (path ? path.replace(/(^\/|\/$|[^a-zA-Z0-9-_/])/g, '') : '');

    const urlFor = (path, pars, language, should_change_to_legacy = false) => {
        const lang = (language || urlLang()).toLowerCase();
        // url language might differ from passed language, so we will always replace using the url language
        const url_lang = (language ? urlLang().toLowerCase() : lang);
        const url = window.location.href;
        let domain = url.substring(0, url.indexOf(`/${url_lang}/`) + url_lang.length + 2);
        if (should_change_to_legacy) {
            domain = domain.replace(/\/app/,'');
        }
        const new_url = `${domain}${(normalizePath(path) || 'home')}.html${(pars ? `?${pars}` : '')}`;
        // replace old lang with new lang
        return urlForLanguage(lang, new_url);
    };

    const default_domain = 'binary.com';
    const host_map = { // the exceptions regarding updating the URLs
        'bot.binary.com'       : 'www.binary.bot',
        'developers.binary.com': 'developers.binary.com', // same, shouldn't change
        'academy.binary.com'   : 'academy.binary.com',
        'tech.binary.com'      : 'tech.binary.com',
        'blog.binary.com'      : 'blog.binary.com',
    };

    const urlForCurrentDomain = (href) => {
        const current_domain = getCurrentBinaryDomain();

        if (!current_domain) {
            return href; // don't change when domain is not supported
        }

        const url_object = new URL(href);
        if (Object.keys(host_map).includes(url_object.hostname)) {
            url_object.hostname = host_map[url_object.hostname];
        } else if (url_object.hostname.indexOf(default_domain) !== -1) {
            // to keep all non-Binary links unchanged, we use default domain for all Binary links in the codebase (javascript and templates)
            url_object.hostname = url_object.hostname.replace(new RegExp(`\\.${default_domain}`, 'i'), `.${current_domain}`);
        } else {
            return href;
        }

        return url_object.href;
    };

    const urlForStatic = (path = '') => {
        if (!static_host || static_host.length === 0) {
            static_host = document.querySelector('script[src*="vendor.min.js"]');
            if (static_host) {
                static_host = static_host.getAttribute('src');
            }

            if (static_host && static_host.length > 0) {
                static_host = static_host.substr(0, static_host.indexOf('/js/') + 1);
            } else {
                static_host = Url.websiteUrl();
            }
        }

        return static_host + path.replace(/(^\/)/g, '');
    };

    /**
     * @param {Object} new_params - Object with param-value pairs. To delete param, set value to null.
     * @param {boolean} should_preserve_old - Should existing query parameters be preserved.
     */
    const updateParamsWithoutReload = (new_params, should_preserve_old) => {
        const updated_params = should_preserve_old
            ? Object.assign(paramsHash(), new_params)
            : new_params;
        Object.keys(new_params).forEach(key => {
            if (new_params[key] === null) {
                delete updated_params[key];
            }
        });
        const url = new URL(window.location);
        url.search = paramsHashToString(updated_params);
        window.history.replaceState({ url: url.href }, '', url.href);
    };

    const getSection = (url = window.location.href) => (url.match(new RegExp(`/${urlLang()}/(.*)/`, 'i')) || [])[1];

    const getHashValue = (name) => {
        const hash  = (location_url || window.location).hash;
        const value = hash.split('=');
        return new RegExp(name).test(hash) && value.length > 1 ? value[1] : '';
    };

    return {
        init,
        reset,
        paramsHash,
        getLocation,
        paramsHashToString,
        urlFor,
        urlForCurrentDomain,
        urlForStatic,
        getSection,
        getHashValue,
        updateParamsWithoutReload,

        param           : name => paramsHash()[name],
        websiteUrl      : () => `${location.protocol}//${location.hostname}/`,
        getDefaultDomain: () => default_domain,
        getHostMap      : () => host_map,
        resetStaticHost : () => { static_host = undefined; },
    };
})();

module.exports = Url;
