import { getCurrentProductionDomain } from '../config/config';

const default_domain = 'binary.com';
const host_map = {
    // the exceptions regarding updating the URLs
    'bot.binary.com': 'www.binary.bot',
    'developers.binary.com': 'developers.binary.com', // same, shouldn't change
    'academy.binary.com': 'academy.binary.com',
    'tech.binary.com': 'tech.binary.com',
    'blog.binary.com': 'blog.binary.com',
};
let location_url = undefined;
let static_host = undefined;
let default_language = undefined;

export const urlForLanguage = (target_language, url = window.location.href) =>
    url.replace(new RegExp(`/${default_language}/`, 'i'), `/${(target_language || 'EN').trim().toLowerCase()}/`);

export const reset = () => {
    location_url = window?.location ?? location_url;
};

export const params = href => {
    const arr_params = [];
    const parsed = ((href ? new URL(href) : location_url).search || '').substr(1).split('&');
    let p_l = parsed.length;
    while (p_l--) {
        const param = parsed[p_l].split('=');
        arr_params.push(param);
    }
    return arr_params;
};

export const paramsHash = href => {
    const param_hash = {};
    const arr_params = params(href);
    let param = arr_params.length;
    while (param--) {
        if (arr_params[param][0]) {
            param_hash[arr_params[param][0]] = arr_params[param][1] || '';
        }
    }
    return param_hash;
};

export const normalizePath = path => (path ? path.replace(/(^\/|\/$|[^a-zA-Z0-9-_/])/g, '') : '');

export const urlFor = (
    path,
    options = {
        query_string: undefined,
        legacy: false,
        language: undefined,
    }
) => {
    const { legacy, language, query_string } = options;

    if (legacy && /^bot$/.test(path)) {
        return `https://${host_map['bot.binary.com']}`;
    }

    const lang = language?.toLowerCase?.() ?? default_language;
    let domain = `https://${window.location.hostname}/`;
    if (legacy) {
        if (/localhost|binary\.sx/.test(domain)) {
            domain = `https://binary.com/${lang || 'en'}/`;
        } else {
            domain = domain.replace(/deriv\.app/, `binary.com/${lang || 'en'}`);
        }
    }
    const new_url = `${domain}${normalizePath(path) || 'home'}.html${query_string ? `?${query_string}` : ''}`;

    // replace old lang with new lang
    return urlForLanguage(lang, new_url);
};

export const urlForCurrentDomain = href => {
    const current_domain = getCurrentProductionDomain();

    if (!current_domain) {
        return href; // don't change when domain is not supported
    }

    const url_object = new URL(href);
    if (Object.keys(host_map).includes(url_object.hostname)) {
        url_object.hostname = host_map[url_object.hostname];
    } else if (url_object.hostname.indexOf(default_domain) !== -1) {
        // to keep all non-Binary links unchanged, we use default domain for all Binary links in the codebase (javascript and templates)
        url_object.hostname = url_object.hostname.replace(
            new RegExp(`\\.${default_domain}`, 'i'),
            `.${current_domain}`
        );
    } else {
        return href;
    }

    return url_object.href;
};

export const urlForStatic = (path = '') => {
    if (!static_host || static_host.length === 0) {
        static_host = document.querySelector('script[src*="vendor.min.js"]');
        if (static_host) {
            static_host = static_host.getAttribute('src');
        }

        if (static_host?.length > 0) {
            static_host = static_host.substr(0, static_host.indexOf('/js/') + 1);
        } else {
            static_host = websiteUrl();
        }
    }

    return static_host + path.replace(/(^\/)/g, '');
};

export const websiteUrl = () => `${location.protocol}//${location.hostname}/`;

export const getUrlBase = (path = '') => {
    const l = window.location;

    if (!/^\/(br_)/.test(l.pathname)) return path;

    return `/${l.pathname.split('/')[1]}${/^\//.test(path) ? path : `/${path}`}`;
};

export const removeBranchName = (path = '') => {
    return path.replace(/^\/br_.*?\//, '/');
};

export const param = name => paramsHash()[name];

export const getHostMap = () => host_map;

export const resetStaticHost = () => {
    static_host = undefined;
};

export const setUrlLanguage = lang => {
    default_language = lang;
};
