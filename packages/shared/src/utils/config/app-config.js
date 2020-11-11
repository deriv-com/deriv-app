const is_crypto_app = window.localStorage.getItem('is_deriv_crypto_app')
    ? window.localStorage.getItem('is_deriv_crypto_app') === 'true'
    : process.env.IS_CRYPTO_APP;
export const website_domain = is_crypto_app ? 'app.derivcrypto.com' : 'app.deriv.com';
export const website_name = is_crypto_app ? 'DerivCrypto' : 'Deriv';
export const default_title = website_name;
export const TRACKING_STATUS_KEY = 'tracking_status';
