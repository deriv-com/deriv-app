export type Environment = 'local' | 'staging' | 'production';
export type Language = keyof typeof ALL_LANGUAGES;
export type LanguageKey = keyof typeof ALL_LANGUAGES;

export const STORE_LANGUAGE_KEY = 'i18n_language';
export const DEFAULT_LANGUAGE = 'EN';
export const ALL_LANGUAGES = Object.freeze({
    ACH: 'Translations',
    EN: 'English',
    ES: 'Español',
    FR: 'Français',
    ID: 'Indonesian',
    IT: 'Italiano',
    PL: 'Polish',
    RU: 'Русский',
    VI: 'Tiếng Việt',
    ZH_CN: '简体中文',
    ZH_TW: '繁體中文',
    TH: 'ไทย',
});

export const ALLOWED_LANGUAGES = Object.freeze({
    EN: 'English',
    ES: 'Español',
    RU: 'Русский',
    FR: 'Français',
    IT: 'Italiano',
    TH: 'ไทย',
    VI: 'Tiếng Việt',
});

export const EXCLUDED_LANGUAGE_KEYS: [LanguageKey] = ['ACH'];
