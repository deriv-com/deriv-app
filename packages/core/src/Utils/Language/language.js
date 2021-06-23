import WS from 'Services/ws-methods';
import { isProduction, urlForLanguage } from '@deriv/shared';
import { getLanguage, getAllLanguages } from '@deriv/translations';
import * as SocketCache from '_common/base/socket_cache';

export const currentLanguage = getLanguage();

export const getAllowedLanguages = () => {
    const exclude_languages = ['ACH'];
    // TODO Change language_list to const when languages are available in prod.
    let language_list = Object.keys(getAllLanguages())
        .filter(key => !exclude_languages.includes(key))
        .reduce((obj, key) => {
            obj[key] = getAllLanguages()[key];
            return obj;
        }, {});

    // TODO Remove this one line below when languages are available in prod.
    if (isProduction()) language_list = { EN: 'English', ID: 'Indonesia', PT: 'Português', ES: 'Español' };

    return language_list;
};

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

const defaultToEnglish = () => {
    const allowed_language = Object.keys(getAllowedLanguages()).includes(currentLanguage);
    let new_url;
    if (!allowed_language) {
        new_url = window.location.replace(getURL('EN'));
    }
    return new_url;
};
defaultToEnglish();
