import { localize } from 'deriv-translations/src/i18next/i18n';

// TODO: move to deriv-translations
export const getLanguage = () => {
    // const queryLang = parseQueryString().l;
    // const lang = queryLang in supportedLanguages ? queryLang : localStorage.getItem('lang') || 'en';
    // localStorage.setItem('lang', lang);
    // return lang;
    return 'en';
};

/* eslint-disable */
// TODO: investigate this
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

// TODO: investigate this
export const load = () => {
    if (typeof $ !== 'function') return; // Adding this check to skip unit test
    const lang = getLanguage();

    $('#select_language li:not(:first)').click(function click() {
        const newLang = $(this).attr('class');
        document.location.search = `l=${newLang}`;
    });

    $('.language').text(
        $(`.${lang}`)
            .hide()
            .text()
    );

    if (lang === 'ach') {
        // eslint-disable-next-line no-underscore-dangle
        window._jipt = [['project', 'binary-bot']];
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = `${document.location.protocol}//cdn.crowdin.com/jipt/jipt.js`;
        $('body').append(script);
    }

    init(lang);

    addUiLang();
};
