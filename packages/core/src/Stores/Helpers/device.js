import { CookieStorage } from '@deriv/shared';

export const createDeviceDataObject = (date_first_contact_cookie, signup_device_cookie) => {
    const url_params = new URLSearchParams(window.location.search);
    const device_data = {
        ...(url_params.get('affiliate_token') && { affiliate_token: url_params.get('affiliate_token') }),
        ...(url_params.get('gclid_url') && { gclid_url: url_params.get('gclid_url') }),

        // date_first_contact should be preserved to the first client contact
        ...(url_params.get('date_first_contact')
            ? {
                  date_first_contact: url_params.get('date_first_contact'),
              }
            : {
                  date_first_contact: date_first_contact_cookie.get('date_first_contact'),
              }),

        // signup device can be set anytime even if there is no url parameter by using isDesktopOs function
        signup_device: url_params.get('signup_device') || signup_device_cookie.get('signup_device'),

        // url params can be stored only if utm_source is available
        ...(url_params.get('utm_source') && {
            utm_campaign: url_params.get('utm_campaign') || '',
            utm_medium: url_params.get('utm_medium') || '',
            utm_source: url_params.get('utm_source'), // since the check is done previously
        }),
    };

    return device_data;
};

export const setDeviceDataCookie = (cookie_name, cookie_value) => {
    const cookie_object = new CookieStorage(cookie_name);

    if (!cookie_object.get(cookie_name)) {
        cookie_object.set(cookie_name, cookie_value);
    }

    return cookie_object;
};
