import { localize } from 'deriv-translations/src/i18next/i18n';

// TODO: should be derived from core
export const getLanguage = () => {
    // const queryLang = parseQueryString().l;
    // const lang = queryLang in supportedLanguages ? queryLang : localStorage.getItem('lang') || 'en';
    // localStorage.setItem('lang', lang);
    // return lang;
    return 'en';
};

/* eslint-disable */
// TODO: investigate if this is still needed
export const addUiLang = () => {
    $('[data-i18n-text]').each(function each() {
        const el = $(this);
        const contents = el.contents();

        el.text(localize($(this).attr('data-i18n-text'))).append(contents);
    });

    document.querySelectorAll('[data-i18n-title]').forEach(titleNode => {
        titleNode.setAttribute('title', localize(titleNode.getAttribute('data-i18n-title')));
    });
};
