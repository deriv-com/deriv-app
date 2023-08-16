export type Environment = 'local' | 'test_link' | 'staging' | 'production';
export type Language = keyof typeof ALL_LANGUAGE;
export type LanguageKey = keyof typeof ALL_LANGUAGE;
export type LanguageData = { [key in LanguageKey]: string };

export const STORE_LANGUAGE_KEY = 'i18n_language';
export const DEFAULT_LANGUAGE = 'EN';
export const ALL_LANGUAGE = Object.freeze({
    ACH: 'Translations',
    AR: 'اَلْعَرَبِيَّةُ',
    BN: 'বাংলা',
    DE: 'Deutsch',
    EN: 'English',
    ES: 'Español',
    FR: 'Français',
    ID: 'Indonesian',
    IT: 'Italiano',
    PL: 'Polish',
    PT: 'Portugese',
    RU: 'Русский',
    SI: 'සිංහල',
    TH: 'ไทย',
    TR: 'Türkçe',
    VI: 'Tiếng Việt',
    ZH_CN: '简体中文',
    ZH_TW: '繁體中文',
});

export const PRODUCTION_LANGUAGE: Partial<LanguageData> = Object.freeze({
    EN: 'English',
    ES: 'Español',
    FR: 'Français',
    IT: 'Italiano',
    RU: 'Русский',
    TH: 'ไทย',
    VI: 'Tiếng Việt',
});
