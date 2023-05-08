export const LANGUAGE_KEY = 'i18n_language';
export const DEFAULT_LANGUAGE = 'EN';
export type Language = keyof typeof ALL_LANGUAGES;
export const ALL_LANGUAGES = Object.freeze({
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
