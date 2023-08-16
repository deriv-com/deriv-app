import i18n from './i18n-instance';
import {
    ALL_LANGUAGE,
    PRODUCTION_LANGUAGE,
    DEFAULT_LANGUAGE,
    Language,
    STORE_LANGUAGE_KEY,
    Environment,
    LanguageData,
} from './config';

let temp_environment: Environment = 'production';

export const setEnvironment = (env: Environment) => (temp_environment = env);

export const getLanguage = () => i18n.language || getInitialLanguage(temp_environment);

export const getAllowedLanguages = (environment: Environment): Partial<LanguageData> => {
    switch (environment) {
        case 'production':
            return PRODUCTION_LANGUAGE;
        case 'test_link':
        case 'local':
        case 'staging':
        default:
            return ALL_LANGUAGE;
    }
};

/**
 * Checks if the specified language is available in the given environment.
 *
 * @param {string} lang - The language code to check for availability.
 * @param {Environment} environment - The environment in which the language availability is to be checked.
 * @returns {boolean} Returns true if the language is available; otherwise, returns false.
 */
export const isLanguageAvailable = (lang: string, environment: Environment) => {
    if (!lang) return false;

    const selected_language = lang.toUpperCase();
    const is_ach = selected_language === 'ACH';

    if (is_ach) return environment === 'staging' || environment === 'local';

    return Object.keys(getAllowedLanguages(environment)).includes(selected_language);
};

/**
 * Gets the initial language to be used in the application based on the specified environment.
 *
 * @param {Environment} environment - The environment for which to get the initial language.
 * @returns {string} The initial language code to be used in the application.
 */
export const getInitialLanguage = (environment: Environment): Language => {
    const url_params = new URLSearchParams(window.location.search);
    const query_lang = url_params.get('lang');
    const local_storage_language = localStorage.getItem(STORE_LANGUAGE_KEY);

    if (query_lang) {
        const query_lang_uppercase = query_lang.toUpperCase();
        if (isLanguageAvailable(query_lang_uppercase, environment)) {
            localStorage.setItem(STORE_LANGUAGE_KEY, query_lang_uppercase);
            return query_lang_uppercase as Language;
        }
    }

    if (local_storage_language) {
        if (isLanguageAvailable(local_storage_language, environment)) {
            return local_storage_language as Language;
        }
    }

    return DEFAULT_LANGUAGE;
};

export const loadIncontextTranslation = () => {
    const in_context_loaded = document.getElementById('in_context_crowdin');
    if (in_context_loaded) return;

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

export const switchLanguage = async (
    lang: Language,
    environment: Environment,
    onChange?: (lang: Language) => void | Promise<void>
) => {
    if (!isLanguageAvailable(lang, environment)) return;
    await i18n.changeLanguage(lang, () => {
        localStorage.setItem(STORE_LANGUAGE_KEY, lang);
        if (typeof onChange === 'function') onChange(lang);
    });
};
