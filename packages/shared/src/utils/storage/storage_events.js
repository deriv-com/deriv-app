import { getPlatformFromUrl } from '../url/url';

export const getUrlSmartTrader = () => {
    if (getPlatformFromUrl().is_staging_deriv_app) {
        return 'https://staging-smarttrader.deriv.com';
    }

    if (getPlatformFromUrl().is_staging_deriv_crypto) {
        return 'https://staging-smarttrader.derivcrypto.com';
    }

    return 'https://smarttrader.deriv.com';
};
