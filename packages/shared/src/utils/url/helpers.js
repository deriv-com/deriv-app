import { deriv_urls } from './constants';

export const getUrlSmartTrader = () => {
    const { is_staging_deriv_app } = getPlatformFromUrl();
    const i18n_language = window.localStorage.getItem('i18n_language') || 'en';

    let base_link = '';

    if (is_staging_deriv_app) {
        base_link = deriv_urls.SMARTTRADER_STAGING;
    } else {
        base_link = deriv_urls.SMARTTRADER_PRODUCTION;
    }

    return `${base_link}/${i18n_language.toLowerCase()}/trading.html`;
};

export const getPlatformFromUrl = (domain = window.location.hostname) => {
    const resolutions = {
        is_staging_deriv_app: /^staging-app\.deriv\.com$/i.test(domain),
        is_deriv_app: /^app\.deriv\.com$/i.test(domain),
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
