import { deriv_urls } from './constants';
import { getPlatformFromUrl } from './helpers';
import { getCurrentProductionDomain } from '../config/config';
import { routes } from '../routes';
import { Language } from '@deriv/translations';

type TOption = {
    query_string?: string;
    legacy?: boolean;
    language?: string;
};

const default_domain = 'binary.com';
const host_map = {
    // the exceptions regarding updating the URLs
    'bot.binary.com': 'www.binary.bot',
    'developers.binary.com': 'developers.binary.com', // same, shouldn't change
    'academy.binary.com': 'academy.binary.com',
    'blog.binary.com': 'blog.binary.com',
};

let location_url: Location;

export const legacyUrlForLanguage = (
    target_language: string,
    url: string = window.location.href,
    default_language: string
) => url.replace(new RegExp(`/${default_language}/`, 'i'), `/${(target_language || 'EN').trim().toLowerCase()}/`);

export const urlForLanguage = (lang: string, url: string = window.location.href) => {
    const current_url = new URL(url);

    if (lang === 'EN') {
        current_url.searchParams.delete('lang');
    } else {
        current_url.searchParams.set('lang', lang);
    }

    return `${current_url}`;
};

export const reset = () => {
    location_url = window?.location ?? location_url;
};

export const params = (href?: string | URL) => {
    const arr_params = [];
    const parsed = ((href ? new URL(href) : location_url).search || '').substr(1).split('&');
    let p_l = parsed.length;
    while (p_l--) {
        const param = parsed[p_l].split('=');
        arr_params.push(param);
    }
    return arr_params;
};

/**
 * Normalizes the given path by removing leading and trailing slashes,
 * and any invalid characters.
 *
 * @param {string} path - The path to be normalized.
 * @returns {string} - The normalized path.
 */
export const normalizePath = (path: string) => (path ? path.replace(/(^\/|\/$|[^a-zA-Z0-9-_./()#])/g, '') : '');

export const urlFor = (
    path: string,
    options: TOption = {
        query_string: undefined,
        legacy: false,
        language: undefined,
    },
    default_language: string
) => {
    const { legacy, language, query_string } = options;

    if (legacy && /^bot$/.test(path)) {
        return `https://${host_map['bot.binary.com']}`;
    }

    const lang = language?.toLowerCase?.() ?? default_language;
    let domain = `https://${window.location.hostname}/`;
    if (legacy) {
        if (getPlatformFromUrl().is_staging_deriv_app) {
            domain = domain.replace(/staging-app\.deriv\.com/, `staging.binary.com/${lang || 'en'}`);
        } else if (getPlatformFromUrl().is_deriv_app) {
            domain = domain.replace(/app\.deriv\.com/, `binary.com/${lang || 'en'}`);
        } else {
            domain = `https://binary.com/${lang || 'en'}/`;
        }
    }
    const new_url = `${domain}${normalizePath(path) || 'home'}.html${query_string ? `?${query_string}` : ''}`;

    if (lang && !legacy) {
        return urlForLanguage(lang, new_url);
    } else if (legacy) {
        return legacyUrlForLanguage(lang, new_url, default_language);
    }

    return new_url;
};

export const urlForCurrentDomain = (href: string) => {
    const current_domain = getCurrentProductionDomain();

    if (!current_domain) {
        return href; // don't change when domain is not supported
    }

    const url_object = new URL(href);
    if (Object.keys(host_map).includes(url_object.hostname)) {
        url_object.hostname = host_map[url_object.hostname as keyof typeof host_map];
    } else if (url_object.hostname.match(default_domain)) {
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

export const websiteUrl = () => `${location.protocol}//${location.hostname}/`;

export const getUrlBase = (path = '') => {
    const l = window.location;

    if (!/^\/(br_)/.test(l.pathname)) return path;

    return `/${l.pathname.split('/')[1]}${/^\//.test(path) ? path : `/${path}`}`;
};

export const removeBranchName = (path = '') => {
    return path.replace(/^\/br_.*?\//, '/');
};

export const getHostMap = () => host_map;

type StaticURLOptions = {
    default_language?: Language;
    is_document?: boolean;
    is_eu_url?: boolean;
};

/**
 * Generates the URL for deriv.com related links.
 *
 * @param {string} [path=''] - The path for the URL, if any.
 * @param {StaticURLOptions} options - The options object for URL generation.
 * @returns {string} - The URL for deriv.com related links.
 */
export const getStaticUrl = (path = '', options?: StaticURLOptions) => {
    const { default_language = 'EN', is_document = false, is_eu_url = false } = options || {};
    const host = is_eu_url ? deriv_urls.DERIV_COM_PRODUCTION_EU : deriv_urls.DERIV_COM_PRODUCTION;
    let lang = default_language.toLowerCase();

    if (lang && lang !== 'en') {
        lang = `/${lang}`;
    } else {
        lang = '';
    }

    if (is_document) return `${host}/${normalizePath(path)}`;

    // Deriv.com supports languages separated by '-' not '_'
    if (host === deriv_urls.DERIV_COM_PRODUCTION && lang.includes('_')) {
        lang = lang.replace('_', '-');
    }

    return `${host}${lang}/${normalizePath(path)}`;
};

export const getPath = (route_path: string, parameters = {}) =>
    Object.keys(parameters).reduce(
        (p, name) => p.replace(`:${name}`, parameters[name as keyof typeof parameters]),
        route_path
    );

export const getContractPath = (contract_id?: number) => getPath(routes.contract, { contract_id });

/**
 * Filters query string. Returns filtered query (without '/?')
 * @param {string} search_param window.location.search
 * @param {Array<string>} allowed_keys array of string of allowed query string keys
 */
export const filterUrlQuery = (search_param: string, allowed_keys: string[]) => {
    const search_params = new URLSearchParams(search_param);
    const filtered_queries = [...search_params].filter(kvp => allowed_keys.includes(kvp[0]));
    return new URLSearchParams(filtered_queries || '').toString();
};

export const excludeParamsFromUrlQuery = (search_param: string, excluded_keys: string[]) => {
    const search_params = new URLSearchParams(search_param);
    const filtered_queries = [...search_params].filter(([key]) => !excluded_keys.includes(key));
    return filtered_queries.length ? `?${new URLSearchParams(filtered_queries).toString()}` : '';
};
