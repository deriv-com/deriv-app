import { APP_ID_MAP, MAX_MOBILE_WIDTH } from '@constants';

export const parseQueryString = () => {
    if (typeof window === 'undefined') {
        return {};
    }
    const str = window.location.search;
    const objURL = {};
    str.replace(/([^?=&]+)(=([^&]*))?/g, (a0, a1, a2, a3) => {
        objURL[a1] = a3;
    });
    return objURL;
};

export const isProduction = () => document.location.hostname.replace(/^www./, '') in APP_ID_MAP.production;

export const getRelatedDeriveOrigin = () => {
    let origin = 'https://app.deriv.com';
    let is_official = false;
    const split_host_name = /^(staging-)?(bot.deriv.)([a-zA-Z]*)$/.exec(window.location.hostname);
    let prefix = '';
    let extension = 'com';
    if (split_host_name) {
        prefix = split_host_name[1] || '';
        extension = split_host_name[3] || 'com';
        if (['com', 'me', 'be'].includes(extension)) {
            is_official = true;
            origin = `https://${prefix}app.deriv.${extension}`;
        }
    }
    return { origin, extension, prefix, is_official };
};

export const getExtension = () => {
    const host = document.location.hostname;
    const extension = host.split('.').slice(-1)[0];
    return host !== extension ? extension : '';
};

export const generateDerivLink = (path, ...queries) => {
    const redirect_query = `ext_platform_url=${encodeURIComponent(window.location.origin)}&lang=${localStorage.getItem(
        'lang'
    )}`;
    queries.push(redirect_query);
    return `${getRelatedDeriveOrigin().origin}/${path}?${queries.join('&')}`;
};

export const getDomainAppId = () => {
    const hostName = document.location.hostname;
    const hostname = hostName.replace(/^www./, '');

    // eslint-disable-next-line no-nested-ternary
    return hostname in APP_ID_MAP.production
        ? APP_ID_MAP.production[hostname]
        : // eslint-disable-next-line no-nested-ternary
        hostname in APP_ID_MAP.staging
            ? APP_ID_MAP.staging[hostname]
            : hostname in APP_ID_MAP.dev
                ? APP_ID_MAP.dev[hostname]
                : 29864;
};

export const queryToObjectArray = queryStr => {
    const tokens = [];

    Object.keys(queryStr).forEach(o => {
        if (!/\d$/.test(o)) return;
        const splited_query = /^([a-zA-Z]*)([\d]*)?/.exec(o);
        let key = splited_query[1];
        const index = splited_query[2];
        key = key === 'acct' ? 'accountName' : key; // Make it consistent with src/storage.js naming
        if (index) {
            if (index <= tokens.length) {
                tokens[index - 1][key] = queryStr[o];
            } else {
                tokens.push({});
                tokens[index - 1][key] = queryStr[o];
            }
        }
    });
    return tokens;
};

export const isMobile = () => window.innerWidth <= MAX_MOBILE_WIDTH;

export const isDesktop = () => window.innerWidth > MAX_MOBILE_WIDTH;
