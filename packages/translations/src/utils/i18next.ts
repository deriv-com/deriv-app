import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { str as crc32 } from 'crc-32';
import {
    ALL_LANGUAGES,
    ALLOWED_LANGUAGES,
    DEFAULT_LANGUAGE,
    Language,
    STORE_LANGUAGE_KEY,
    Environment,
    LanguageData,
} from './config';

/**
 * Gets the current set language.
 *
 * @deprecated This function is deprecated. You should always use the useLanguageSettings() to get the
 * current_language.
 *
 * @param {Environment} [environment='production'] - The environment in which the language is to be fetched.
 * @returns {string} The current language.
 */
export const getLanguage = (environment: Environment = 'production') =>
    i18n.language || getInitialLanguage(environment);

export const getAllowedLanguages = (environment: Environment): Partial<LanguageData> => {
    switch (environment) {
        case 'production':
            return ALLOWED_LANGUAGES;
        case 'local':
        case 'staging':
        default:
            return ALL_LANGUAGES;
    }
};

export const isLanguageAvailable = (lang: string, environment: Environment) => {
    if (!lang) return false;

    const selected_language = lang.toUpperCase();
    const is_ach = selected_language === 'ACH';

    if (is_ach) return environment === 'staging' || environment === 'local';

    return Object.keys(getAllowedLanguages(environment)).includes(selected_language);
};

export const getInitialLanguage = (environment: Environment) => {
    if (i18n.language) return i18n.language;

    const url_params = new URLSearchParams(window.location.search);
    const query_lang = url_params.get('lang');
    const local_storage_language = localStorage.getItem(STORE_LANGUAGE_KEY);

    if (query_lang) {
        const query_lang_uppercase = query_lang.toUpperCase();
        if (isLanguageAvailable(query_lang_uppercase, environment)) {
            localStorage.setItem(STORE_LANGUAGE_KEY, query_lang_uppercase);
            return query_lang_uppercase;
        }
    }

    if (local_storage_language) {
        if (isLanguageAvailable(local_storage_language, environment)) {
            return local_storage_language;
        }
    }

    return DEFAULT_LANGUAGE;
};

export const loadIncontextTranslation = (current_language: Language) => {
    const in_context_loaded = document.getElementById('in_context_crowdin');
    const is_ach = current_language.toUpperCase() === 'ACH';

    if (!is_ach || in_context_loaded) return;

    const jipt = document.createElement('script');
    jipt.id = 'in_context_crowdin';
    jipt.type = 'text/javascript';
    jipt.text = `
            var _jipt = []; _jipt.push(['project', 'deriv-app']);
            var crowdin = document.createElement("script");
            crowdin.setAttribute('src', '//cdn.crowdin.com/jipt/jipt.js');
            document.head.appendChild(crowdin);
        `;
    document.head.appendChild(jipt);
};

export const loadLanguageJson = async (lang: string) => {
    if (!i18n.hasResourceBundle(lang, 'translations') && lang.toUpperCase() !== DEFAULT_LANGUAGE) {
        const lang_json = await import(
            /* webpackChunkName: "[request]" */ `../translations/${lang.toLowerCase()}.json`
        );
        i18n.addResourceBundle(lang, 'translations', lang_json);
        document.documentElement.setAttribute('lang', lang);
    }
};

export const switchLanguage = async (lang: Language, environment: Environment, onChange?: (lang: Language) => void) => {
    if (isLanguageAvailable(lang, environment)) {
        await loadLanguageJson(lang);
        await i18n.changeLanguage(lang, () => {
            localStorage.setItem(STORE_LANGUAGE_KEY, lang);
            if (typeof onChange === 'function') onChange(lang);
        });
    }
};

i18n.use(initReactI18next).init({
    react: {
        bindI18n: 'loaded languageChanged',
        bindI18nStore: 'added',
        hashTransKey(defaultValue: string) {
            return crc32(defaultValue);
        },
        useSuspense: false,
    },
    fallbackLng: 'EN',
    ns: ['translations'],
    defaultNS: 'translations',
});

export default i18n;
