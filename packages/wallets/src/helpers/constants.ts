import { derivUrls } from './url';

let defaultLanguage: string;

export const normalizePath = (path: string) => (path ? path.replace(/(^\/|\/$|[^a-zA-Z0-9-_./()#])/g, '') : '');

export const getlangFromUrl = () => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const lang = urlParams.get('lang');
    return lang;
};

export const getActionFromUrl = () => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const action = urlParams.get('action');
    return action;
};

export const getUrlSmartTrader = () => {
    const { isStagingDerivApp } = getPlatformFromUrl();
    const urlLang = getlangFromUrl();
    const i18NLanguage = window.localStorage.getItem('i18n_language') || urlLang || 'en';

    let baseLink = '';

    if (isStagingDerivApp) {
        baseLink = derivUrls.SMARTTRADER_STAGING;
    } else {
        baseLink = derivUrls.SMARTTRADER_PRODUCTION;
    }

    return `${baseLink}/${i18NLanguage.toLowerCase()}/trading.html`;
};

export const getUrlBinaryBot = (isLanguageRequired = true) => {
    const { isStagingDerivApp } = getPlatformFromUrl();

    const urlLang = getlangFromUrl();
    const i18NLanguage = window.localStorage.getItem('i18n_language') || urlLang || 'en';

    const baseLink = isStagingDerivApp ? derivUrls.BINARYBOT_STAGING : derivUrls.BINARYBOT_PRODUCTION;

    return isLanguageRequired ? `${baseLink}/?l=${i18NLanguage.toLowerCase()}` : baseLink;
};

export const getPlatformFromUrl = (domain = window.location.hostname) => {
    const resolutions = {
        isDerivApp: /^app\.deriv\.(com|me|be)$/i.test(domain),
        isStagingDerivApp: /^staging-app\.deriv\.(com|me|be)$/i.test(domain),
        isTestLink: /^(.*)\.binary\.sx$/i.test(domain),
    };

    return {
        ...resolutions,
        isStaging: resolutions.isStagingDerivApp,
    };
};

export const isStaging = (domain = window.location.hostname) => {
    const { isStagingDerivApp } = getPlatformFromUrl(domain);

    return isStagingDerivApp;
};

export const getStaticUrl = (path = '', isDocument = false, isEuUrl = false) => {
    const host = isEuUrl ? derivUrls.DERIV_COM_PRODUCTION_EU : derivUrls.DERIV_COM_PRODUCTION;
    let lang = defaultLanguage?.toLowerCase();

    if (lang && lang !== 'en') {
        lang = `/${lang}`;
    } else {
        lang = '';
    }

    if (isDocument) return `${host}/${normalizePath(path)}`;

    // Deriv.com supports languages separated by '-' not '_'
    if (host === derivUrls.DERIV_COM_PRODUCTION && lang.includes('_')) {
        lang = lang.replace('_', '-');
    }

    return `${host}${lang}/${normalizePath(path)}`;
};
