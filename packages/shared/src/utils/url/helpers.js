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
    return {
        is_staging_deriv_crypto: /^staging-app\.deriv\.com$/i.test(domain),
        is_staging_deriv_app: /^staging-app\.derivcrypto\.com$/i.test(domain),
        is_deriv_crypto: /^app\.derivcrypto\.com$/i.test(domain),
        is_deriv_app: /^app\.deriv\.com$/i.test(domain),
        is_test_link: /^(.*)\.binary\.sx$/i.test(domain),
    };
};
