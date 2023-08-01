import { getLanguage } from '@storage';
import { init, translate, redirectToSupportedLang } from '@i18n';

const addUiLang = () => {
    $('[data-i18n-text]').each(function each() {
        const el = $(this);
        const contents = el.contents();

        el.text(translate($(this).attr('data-i18n-text'))).append(contents);
    });

    document.querySelectorAll('[data-i18n-title]').forEach(titleNode => {
        titleNode.setAttribute('title', translate(titleNode.getAttribute('data-i18n-title')));
    });
};

export const load = async () => {
    if (typeof $ !== 'function') return; // Adding this check to skip unit test

    const lang = await getLanguage();
    if (lang) {
        init(lang);
    }

    $('#select_language li:not(:first)').click(function click() {
        const newLang = $(this).attr('class');
        redirectToSupportedLang(newLang);
    });

    $('.language').text($(`.${lang}`).hide().text());

    if (lang === 'ach') {
        // eslint-disable-next-line no-underscore-dangle
        window._jipt = [['project', 'binary-bot']];
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = `${document.location.protocol}//cdn.crowdin.com/jipt/jipt.js`;
        $('body').append(script);
    }
    addUiLang();
};

export const showBanner = () => {
    if (getLanguage() === 'pt') {
        document.querySelectorAll(`.${getLanguage()}-show`).forEach(el => {
            el.classList.remove('invisible');
        });
        // TODO: Whenever banners for all languages were added remove else part of the condition.
    } else {
        document.querySelectorAll('.any-show').forEach(el => {
            el.classList.remove('invisible');
        });
    }
};
