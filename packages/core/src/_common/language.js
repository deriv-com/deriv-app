const Cookies       = require('js-cookie');
const CookieStorage = require('./storage').CookieStorage;

const Language = (() => {
    const all_languages = {
        ACH  : 'Translations',
        EN   : 'English',
        DE   : 'Deutsch',
        ES   : 'Español',
        FR   : 'Français',
        ID   : 'Indonesia',
        IT   : 'Italiano',
        PL   : 'Polish',
        PT   : 'Português',
        RU   : 'Русский',
        TH   : 'Thai',
        VI   : 'Tiếng Việt',
        ZH_CN: '简体中文',
        ZH_TW: '繁體中文',
    };
    const default_language = 'EN';

    const setCookieLanguage = (lang) => {
        if (!Cookies.get('language') || lang) {
            const cookie = new CookieStorage('language');
            cookie.write((lang || getLanguage()).toUpperCase());
        }
    };

    let url_lang = null;

    const lang_regex = new RegExp(`^(${Object.keys(all_languages).join('|')})$`, 'i');

    const languageFromUrl = (custom_url) => {
        if (url_lang && !custom_url) return url_lang;
        const url_params = (custom_url || window.location.href).split('/').slice(3);
        const language   = (url_params.find(lang => lang_regex.test(lang)) || '');
        if (!custom_url) {
            url_lang = language;
        }
        return language;
    };

    let current_lang = null;

    const getLanguage = () => {
        if (/ach/i.test(current_lang) || /ach/i.test(languageFromUrl())) {
            const crowdin_lang_key = 'jipt_language_code_binary-static';
            const crowdin_lang     = localStorage.getItem(crowdin_lang_key) || Cookies.get(crowdin_lang_key); // selected language for in-context translation
            if (crowdin_lang) {
                current_lang = crowdin_lang.toUpperCase().replace('-', '_').toUpperCase();
                if (document.body) {
                    document.body.classList.add(current_lang); // set the body class removed by crowdin code
                }
            }
        }
        current_lang = (current_lang || (languageFromUrl() || Cookies.get('language') || default_language).toUpperCase());
        return current_lang;
    };

    const urlForLanguage = (lang, url = window.location.href) =>
        url.replace(new RegExp(`/${getLanguage()}/`, 'i'), `/${(lang || default_language).trim().toLowerCase()}/`);

    return {
        getAll   : () => all_languages,
        setCookie: setCookieLanguage,
        get      : getLanguage,
        urlFor   : urlForLanguage,
        urlLang  : languageFromUrl,
        reset    : () => { url_lang = null; current_lang = null; },
    };
})();

module.exports = Language;
