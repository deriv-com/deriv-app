export const getUrlSmartTrader = () => {
    const { is_staging_deriv_app, is_staging_deriv_crypto } = getPlatformFromUrl();
    if (is_staging_deriv_app) {
        return 'https://staging-smarttrader.deriv.com';
    }

    if (is_staging_deriv_crypto) {
        return 'https://staging-smarttrader.derivcrypto.com';
    }

    return 'https://smarttrader.deriv.com';
};

export const getPlatformFromUrl = (domain = window.location.hostname) => {
    const resolutions = {
        is_staging_deriv_crypto: /^staging-app\.derivcrypto\.com$/i.test(domain),
        is_staging_deriv_app: /^staging-app\.deriv\.com$/i.test(domain),
        is_deriv_crypto: /^app\.derivcrypto\.com$/i.test(domain),
        is_deriv_app: /^app\.deriv\.com$/i.test(domain),
        is_test_link: /^(.*)\.binary\.sx$/i.test(domain),
    };

    return {
        ...resolutions,
        is_staging: resolutions.is_staging_deriv_app || resolutions.is_staging_deriv_crypto,
    };
};

export const isStaging = (domain = window.location.hostname) => {
    const { is_staging_deriv_crypto, is_staging_deriv_app } = getPlatformFromUrl(domain);

    return is_staging_deriv_crypto || is_staging_deriv_app;
};
