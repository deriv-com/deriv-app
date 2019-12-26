import { localize } from 'deriv-translations';

/* eslint-disable */
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
