import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { str as crc32 } from 'crc-32';
import { isLocal, isProduction } from '../../../shared/src/utils/config/config';
import { isStaging } from '../../../shared/src/utils/url/helpers';
import {
    ALL_LANGUAGES,
    ALLOWED_LANGUAGES,
    EXCLUDED_LANGUAGE_KEYS,
    DEFAULT_LANGUAGE,
    Language,
    LanguageKey,
    STORE_LANGUAGE_KEY,
} from './config';

export const getAllowedLanguages = () => {
    let language_list = Object.keys(ALL_LANGUAGES)
        .filter(key => !EXCLUDED_LANGUAGE_KEYS.includes(key as LanguageKey))
        .reduce((obj: { [key: string]: string }, key) => {
            obj[key] = ALL_LANGUAGES[key as LanguageKey];
            return obj;
        }, {});

    if (isProduction()) language_list = ALLOWED_LANGUAGES;

    return language_list;
};

export const isLanguageAvailable = (lang: string) => {
    if (!lang) return false;

    const selected_language = lang.toUpperCase();
    const is_ach = selected_language === 'ACH';

    if (is_ach) return isStaging() || isLocal();

    return Object.keys(getAllowedLanguages()).includes(selected_language);
};

export const getInitialLanguage = () => {
    const url_params = new URLSearchParams(window.location.search);
    const query_lang = url_params.get('lang');
    const local_storage_language = localStorage.getItem(STORE_LANGUAGE_KEY);

    if (query_lang) {
        const query_lang_uppercase = query_lang.toUpperCase();
        if (isLanguageAvailable(query_lang_uppercase)) {
            localStorage.setItem(STORE_LANGUAGE_KEY, query_lang_uppercase);
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

const loadIncontextTranslation = () => {
    const in_context_loaded = document.getElementById('in_context_crowdin');
    const is_ach = getLanguage().toUpperCase() === 'ACH';

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

const loadLanguageJson = async (lang: string) => {
    if (!i18n.hasResourceBundle(lang, 'translations') && lang.toUpperCase() !== DEFAULT_LANGUAGE) {
        const lang_json = await import(
            /* webpackChunkName: "[request]" */ `../translations/${lang.toLowerCase()}.json`
        );
        i18n.addResourceBundle(lang, 'translations', lang_json);
        document.documentElement.setAttribute('lang', lang);
    }
};

export const initializeTranslations = async () => {
    if (isStaging() || isLocal()) {
        loadIncontextTranslation();
    }
    await loadLanguageJson(getInitialLanguage());
};

export const switchLanguage = async (lang: Language, cb: (lang: Language) => void) => {
    if (isLanguageAvailable(lang)) {
        await loadLanguageJson(lang);
        await i18n.changeLanguage(lang, () => {
            localStorage.setItem(STORE_LANGUAGE_KEY, lang);
            cb(lang);
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
    lng: getInitialLanguage(),
    fallbackLng: 'EN',
    ns: ['translations'],
    defaultNS: 'translations',
});

export default i18n;
