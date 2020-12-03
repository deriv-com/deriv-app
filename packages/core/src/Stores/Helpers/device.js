import { CookieStorage } from '@deriv/shared';

export const createDeviceDataObject = cookies_object => {
    const url_params = new URLSearchParams(window.location.search);
    const device_data = {};

    for (cookie_name in cookies_object) {
        if (cookie_object[key].get(cookie_name)) {
            device_data[cookie_name] = cookie_object[key].get(cookie_name);
        }
    }

    return device_data;
};

export const setDeviceDataCookie = (cookie_name, cookie_value) => {
    const cookie_object = getCookieObject(cookie_name);

    if (!cookie_object.get(cookie_name)) {
        cookie_object.set(cookie_name, cookie_value);
    }

    return cookie_object;
};

export const getCookieObject = cookie_name => {
    const cookie_object = new CookieStorage(cookie_name);
    return cookie_object;
};
