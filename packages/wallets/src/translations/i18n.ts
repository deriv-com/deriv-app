import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import DE from './de.json';
import EN from './en.json';
import ID from './id.json';
import MS from './ms.json';

const DEFAULT_LANGUAGE = 'EN';

export const getInitialLanguage = () => {
    const URLParams = new URLSearchParams(window.location.search);
    const queryLang = URLParams.get('lang');
    const localStorageLanguage = localStorage.getItem('i18n_language');

    if (queryLang) {
        localStorage.setItem('i18n_language', queryLang.toUpperCase());
        return queryLang.toUpperCase();
    }

    if (localStorageLanguage) {
        return localStorageLanguage;
    }

    return DEFAULT_LANGUAGE;
};

let currentLanguage = i18n.language ?? getInitialLanguage();

export const setLanguage = (lang: string) => {
    currentLanguage = lang || DEFAULT_LANGUAGE;
    i18n.changeLanguage(lang);
};

export const getCurrentLanguage = () => currentLanguage;

const resources = {
    DE: {
        translations: DE,
    },
    EN: {
        translations: EN,
    },
    ID: {
        translations: ID,
    },
    MS: {
        translations: MS,
    },
};

i18n.use(initReactI18next).init({
    defaultNS: 'translations',
    fallbackLng: 'EN',
    lng: currentLanguage,
    ns: ['translations'],
    react: {
        bindI18n: 'loaded languageChanged',
        bindI18nStore: 'added',
        hashTransKey(defaultValue: string) {
            // FIX: replace this temporary key finding until we have a better key generation
            return Object.entries(EN).find(([, value]) => value === defaultValue)?.[0] ?? defaultValue;
        },
        useSuspense: false,
    },
    resources,
});

export default i18n;
