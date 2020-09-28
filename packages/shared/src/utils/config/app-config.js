export const website_domain =
    window?.localStorage.getItem('is_deriv_crypto_app') === 'true' ? 'app.derivcrypto.com' : 'app.deriv.com';
export const website_name = window?.localStorage.getItem('is_deriv_crypto_app') === 'true' ? 'DerivCrypto' : 'Deriv';
export const default_title = website_name;
export const TRACKING_STATUS_KEY = 'tracking_status';
