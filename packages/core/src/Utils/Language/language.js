import WS from 'Services/ws-methods';
import { urlForLanguage } from '@deriv/shared';
import { getLanguage } from '@deriv/translations';
import * as SocketCache from '_common/base/socket_cache';

export const currentLanguage = getLanguage();

export const getURL = lang => urlForLanguage(lang);

export const changeLanguage = key => {
    const request = {
        set_settings: 1,
        preferred_language: key,
    };
    SocketCache.clear();
    if (key === 'EN') {
        window.localStorage.setItem('i18n_language', key);
    }

    WS.setSettings(request).then(() => {
        window.location.replace(getURL(key));
    });
};
