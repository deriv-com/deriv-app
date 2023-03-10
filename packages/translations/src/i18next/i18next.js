import { str as crc32 } from 'crc-32';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { isProduction } from '../../../shared/src/utils/config/config';
import withI18n from '../components';

const LANGUAGE_KEY = 'i18n_language';
const DEFAULT_LANGUAGE = 'EN';
const ALL_LANGUAGES = Object.freeze({
    ACH: 'Translations',
    EN: 'English',
    ES: 'Español',
    FR: 'Français',
    ID: 'Indonesian',
    IT: 'Italiano',
    PL: 'Polish',
    PT: 'Português',
    RU: 'Русский',
    VI: 'Tiếng Việt',
    ZH_CN: '简体中文',
    ZH_TW: '繁體中文',
});

export const getAllowedLanguages = () => {
    const allowed_languages = {
        EN: 'English',
        ID: 'Indonesian',
        PT: 'Português',
        ES: 'Español',
        RU: 'Русский',
        FR: 'Français',
    };
    const exclude_languages = ['ACH'];
    // TODO Change language_list to const when languages are available in prod.
    let language_list = Object.keys(getAllLanguages())
        .filter(key => !exclude_languages.includes(key))
        .reduce((obj, key) => {
            obj[key] = getAllLanguages()[key];
            return obj;
        }, {});

    // TODO Remove production check when all languages are available in prod.
    if (isProduction()) language_list = allowed_languages;

    return language_list;
};

const isStaging = () => /staging-app\.deriv\.com/i.test(window.location.hostname);

const isLocal = () => /localhost\.binary\.sx/i.test(window.location.hostname);

const isLanguageAvailable = lang => {
    if (!lang) return false;

    const selected_language = lang.toUpperCase();
    const is_ach = selected_language === 'ACH';

    if (is_ach) return isStaging() || isLocal();

    return Object.keys(getAllowedLanguages()).includes(selected_language);
};

export const getAllLanguages = () => ALL_LANGUAGES;

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

const loadLanguageJson = async lang => {
    if (!i18n.hasResourceBundle(lang, 'translations') && lang.toUpperCase() !== DEFAULT_LANGUAGE) {
        const response = await import(/* webpackChunkName: "[request]" */ `../translations/${lang.toLowerCase()}.json`);

        const lang_json = response;
        i18n.addResourceBundle(lang, 'translations', lang_json);
        document.documentElement.setAttribute('lang', lang);
    }
};

const initial_language = getInitialLanguage();
const i18n_config = {
    react: {
        hashTransKey(defaultValue) {
            return crc32(defaultValue);
        },
    },
    lng: initial_language,
    fallbackLng: 'EN',
    ns: ['translations'],
    defaultNS: 'translations',
};

i18n.use(initReactI18next) // passes i18n down to react-i18next
    .init(i18n_config);

export const initializeTranslations = async () => {
    if (isStaging() || isLocal()) {
        loadIncontextTranslation();
    }
    await loadLanguageJson(initial_language);
};

export const getLanguage = () => i18n.language || initial_language;

// eslint-disable-next-line no-unused-vars
export const changeLanguage = async (lang, cb) => {
    // TODO: uncomment this when translations are ready
    if (isLanguageAvailable(lang)) {
        await loadLanguageJson(lang);
        await i18n.changeLanguage(lang, () => {
            localStorage.setItem(LANGUAGE_KEY, lang);
            cb(lang);
        });
    }
};

// <Localize /> component wrapped with i18n
export const Localize = withI18n(i18n);

export const localize = (string, values) => {
    if (!string) return '';

    return i18n.t(crc32(string), { defaultValue: string, ...values });
};

const loadIncontextTranslation = () => {
    const is_ach = getLanguage().toUpperCase() === 'ACH';
    if (is_ach) {
        const jipt = document.createElement('script');
        jipt.type = 'text/javascript';
        jipt.text = `
            var _jipt = []; _jipt.push(['project', 'deriv-app']);
            var crowdin = document.createElement("script");
            crowdin.setAttribute('src', '//cdn.crowdin.com/jipt/jipt.js');
            document.head.appendChild(crowdin);
        `;
        document.head.appendChild(jipt);
    }
};
