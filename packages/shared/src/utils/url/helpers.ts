import { deriv_urls } from './constants';

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
    const { is_staging_deriv_app } = getPlatformFromUrl();
    const url_lang = getlangFromUrl();
    const i18n_language = window.localStorage.getItem('i18n_language') || url_lang || 'en';

    let base_link = '';

    if (is_staging_deriv_app) {
        base_link = deriv_urls.SMARTTRADER_STAGING;
    } else {
        base_link = deriv_urls.SMARTTRADER_PRODUCTION;
    }

    return `${base_link}/${i18n_language.toLowerCase()}/trading.html`;
};

export const getUrlBinaryBot = () => {
    const { is_staging_deriv_app } = getPlatformFromUrl();

    const url_lang = getlangFromUrl();
    const i18n_language = window.localStorage.getItem('i18n_language') || url_lang || 'en';

    const base_link = is_staging_deriv_app ? deriv_urls.BINARYBOT_STAGING : deriv_urls.BINARYBOT_PRODUCTION;
    return `${base_link}/?l=${i18n_language.toLowerCase()}`;
};

export const getPlatformFromUrl = (domain = window.location.hostname) => {
    const resolutions = {
        is_staging_deriv_app: /^staging-app\.deriv\.(com|me|be)$/i.test(domain),
        is_deriv_app: /^app\.deriv\.(com|me|be)$/i.test(domain),
        is_test_link: /^(.*)\.binary\.sx$/i.test(domain),
    };

    return {
        ...resolutions,
        is_staging: resolutions.is_staging_deriv_app,
    };
};

export const isStaging = (domain = window.location.hostname) => {
    const { is_staging_deriv_app } = getPlatformFromUrl(domain);

    return is_staging_deriv_app;
};
