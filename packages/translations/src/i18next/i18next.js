/* eslint-disable */
import { str as crc32 }     from 'crc-32';
import i18n                 from 'i18next';
import { initReactI18next } from 'react-i18next';
import en                   from '../translations/en.json';
// TODO: import the rest of the language json files when they are ready
// import fr                   from '../translations/fr.json';

const LANGUAGE_KEY = 'i18n_language';
const DEFAULT_LANGUAGE = 'EN';

const getInitialLanguage = () => {
    const has_url_search_language = window.location.search && window.location.search.includes('lang=')
    const local_storage_language  = localStorage.getItem(LANGUAGE_KEY);

    if (has_url_search_language) {
        const query_lang = window.location.search
            .substr(1).split('&')
            .find(query => query.includes('lang='))
            .split('=')[1]
            .toUpperCase()
        // TODO: if query lang is one of languages then
        return query_lang
        // else DEFAULT_LANGUAGE
    }

    if (local_storage_language) {
        // TODO: check if language is one of languages
        return local_storage_language;
        // else DEFAULT_LANGUAGE
    }

    return DEFAULT_LANGUAGE;
};

const initial_language = getInitialLanguage();

const i18n_config = {
    resources: {
        EN: { translation: { ...en } },
        // FR: { translation: { ...fr } },
    },
    react: {
        hashTransKey(defaultValue) {
            return crc32(defaultValue);
        },
    },
    lng: initial_language,
    fallbackLng: 'EN',
};

i18n
    .use(initReactI18next) // passes i18n down to react-i18next
    .init(i18n_config);

const changeLanguage = (lang, cb) => {
    // if language exists then
    i18n.changeLanguage(lang, () => {
        localStorage.setItem(LANGUAGE_KEY, lang);
        cb();
    })
}

const getLanguage = () => {
    console.log(process.env.NODE_ENV);
    console.log('getLanguage');
    console.log(i18n);
    console.log(i18n.language);
    console.log(i18n.languages);
}

const localize = (string, values) => {
    if (!string) return '';
    return i18n.t(crc32(string), { defaultValue: string, ...values })
};

// todo move to Translations
const loadIncontextTranslation = () => {
    // TODO: getLanguage
    const is_ach = false;
    if (is_ach) {
        const jipt = document.createElement('script')
        jipt.type = 'text/javascript'
        jipt.text = `
            var _jipt = []; _jipt.push(['project', 'deriv-app']);
            var crowdin = document.createElement("script");
            crowdin.setAttribute('src', '//cdn.crowdin.com/jipt/jipt.js');
            document.head.appendChild(crowdin);
        `
        document.head.appendChild(jipt)
    }
}

export default { i18n, localize, changeLanguage, getLanguage, loadIncontextTranslation };
