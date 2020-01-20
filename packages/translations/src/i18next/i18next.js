import { str as crc32 }     from 'crc-32';
import i18n                 from 'i18next';
import { initReactI18next } from 'react-i18next';
import withI18n             from '../components';

const LANGUAGE_KEY     = 'i18n_language';
const DEFAULT_LANGUAGE = 'EN';
const ALL_LANGUAGES    = Object.freeze({
    ACH  : 'Translations',
    EN   : 'English',
    ES   : 'Español',
    FR   : 'Français',
    ID   : 'Indonesia',
    IT   : 'Italiano',
    PL   : 'Polish',
    PT   : 'Português',
    RU   : 'Русский',
    VI   : 'Tiếng Việt',
    ZH_CN: '简体中文',
    ZH_TW: '繁體中文',
});

const getUrlBase = (path = '') => {
    const l = window.location;

    if (!/^\/(br_)/.test(l.pathname)) return path;

    return `/${l.pathname.split('/')[1]}${/^\//.test(path) ? path : `/${path}`}`;
};

const isStaging = () => /staging\.deriv\.app/i.test(window.location.hostname);

const isLanguageAvailable = (lang) => {
    if (!lang) return false;

    const selected_language = lang.toUpperCase();
    const is_ach = selected_language === 'ACH';

    if (is_ach && isStaging()) return true;
    if (is_ach) return false;

    // TODO: remove when translations are ready
    if (selected_language !== DEFAULT_LANGUAGE) return false;

    return Object.keys(ALL_LANGUAGES).includes(selected_language);
};

const getAllLanguages = () => ALL_LANGUAGES;

const getInitialLanguage = () => {
    const url_params = new URLSearchParams(window.location.search);
    const query_lang = url_params.get('lang');
    const local_storage_language  = localStorage.getItem(LANGUAGE_KEY);

    if (query_lang) {
        if (isLanguageAvailable(query_lang)) {
            localStorage.setItem(LANGUAGE_KEY, query_lang);
            return query_lang;
        }
    }

    if (local_storage_language) {
        if (isLanguageAvailable(local_storage_language)) {
            return local_storage_language;
        }
    }

    return DEFAULT_LANGUAGE;
};

const loadLanguageJson = async (lang) => {
    if (!i18n.hasResourceBundle(lang, 'translations') && lang !== DEFAULT_LANGUAGE) {
        const response = await fetch(getUrlBase(`/public/i18n/${lang.toLowerCase()}.json`));
        const lang_json = await response.text();

        i18n.addResourceBundle(lang, 'translations', JSON.parse(lang_json));
    }
};

const initial_language = getInitialLanguage();
const i18n_config = {
    react: {
        hashTransKey(defaultValue) {
            return crc32(defaultValue);
        },
    },
    lng        : initial_language,
    fallbackLng: 'EN',
    ns         : ['translations'],
    defaultNS  : 'translations',
};

i18n
    .use(initReactI18next) // passes i18n down to react-i18next
    .init(i18n_config);

const initializeTranslations = async () => {
    if (isStaging()) {
        loadIncontextTranslation();
    }
    await loadLanguageJson(initial_language);
};

const getLanguage = () => {
    return i18n.language || initial_language;
};

// eslint-disable-next-line no-unused-vars
const changeLanguage = async (lang, cb) => {
    // TODO: uncomment this when translations are ready	    // TODO: uncomment this when translations are ready
    // if (isLanguageAvailable(lang)) {
    //     await loadLanguageJson(lang);
    //     i18n.changeLanguage(lang, () => {
    //         localStorage.setItem(LANGUAGE_KEY, lang);
    //         cb();
    //     })
    // }
};

// <Localize /> component wrapped with i18n
const Localize = withI18n(i18n);

const localize = (string, values) => {
    if (!string) return '';

    return i18n.t(crc32(string), { defaultValue: string, ...values });
};

const loadIncontextTranslation = () => {
    const is_ach = getLanguage() === 'ACH';
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

export default {
    changeLanguage,
    getAllLanguages,
    getLanguage,
    initializeTranslations,
    localize,
    Localize,
};
