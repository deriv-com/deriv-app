import { CookieStorage } from '@deriv/shared';

export const createDeviceDataObject = cookies_object => {
    const device_data = {};

    Object.keys(cookies_object).forEach(cookie_name => {
        if (cookies_object[cookie_name].get(cookie_name)) {
            device_data[cookie_name] = cookies_object[cookie_name].get(cookie_name);
        }
    });

    return device_data;
};

export const getCookieObject = cookie_name => {
    const cookie_object = new CookieStorage(cookie_name.includes('utm') ? 'utm_data' : cookie_name);
    return cookie_object;
};

export const setDeviceDataCookie = (cookie_name, cookie_value) => {
    const cookie_object = getCookieObject(cookie_name);

    if (!cookie_object.get(cookie_name)) {
        cookie_object.set(cookie_name, cookie_value);
    }

    return cookie_object;
};
