import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { str as crc32 } from 'crc-32';
import { isLocal, isProduction } from '../../../shared/src/utils/config/config';
import { isStaging } from '../../../shared/src/utils/url/helpers';
import { ALL_LANGUAGES, DEFAULT_LANGUAGE, LANGUAGE_KEY } from './config';

export const getAllLanguages = () => ALL_LANGUAGES;

export const getAllowedLanguages = () => {
    const allowed_languages = {
        EN: 'English',
        PT: 'Português',
        ES: 'Español',
        RU: 'Русский',
        FR: 'Français',
    };
    const exclude_languages = ['ACH'];
    // TODO Change language_list to const when languages are available in prod.
    type Key = keyof typeof ALL_LANGUAGES;
    let language_list = Object.keys(getAllLanguages())
        .filter(key => !exclude_languages.includes(key))
        .reduce((obj: { [key: string]: string }, key) => {
            obj[key] = getAllLanguages()[key as Key];
            return obj;
        }, {});

    // TODO Remove production check when all languages are available in prod.
    if (isProduction()) language_list = allowed_languages;

    return language_list;
};

const isLanguageAvailable = (lang: string) => {
    if (!lang) return false;

    const selected_language = lang.toUpperCase();
    const is_ach = selected_language === 'ACH';

    if (is_ach) return isStaging() || isLocal();

    return Object.keys(getAllowedLanguages()).includes(selected_language);
};

export const getInitialLanguage = () => {
    const url_params = new URLSearchParams(window.location.search);
    const query_lang = url_params.get('lang');
    const local_storage_language = localStorage.getItem(LANGUAGE_KEY);

    if (query_lang) {
        const query_lang_uppercase = query_lang.toUpperCase();
        if (isLanguageAvailable(query_lang_uppercase)) {
            localStorage.setItem(LANGUAGE_KEY, query_lang_uppercase);
            return query_lang_uppercase;
        }
    }

    if (local_storage_language) {
        if (isLanguageAvailable(local_storage_language)) {
            return local_storage_language;
        }
    }

    return DEFAULT_LANGUAGE;
};

export const getLanguage = () => i18n.language || getInitialLanguage();

i18n.use(initReactI18next).init({
    react: {
        hashTransKey(defaultValue: string) {
            return crc32(defaultValue);
        },
        useSuspense: false,
    },
    lng: getInitialLanguage(),
    fallbackLng: 'EN',
    ns: ['translations'],
    defaultNS: 'translations',
});

export default i18n;
