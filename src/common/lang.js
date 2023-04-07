import { parseQueryString } from '../common/utils/tools';
import { set as setStorage, get as getStorage } from '../common/utils/storageManager';
import { setCookieLanguage } from '../common/utils/cookieManager';
import { supported_languages, translate, init } from './i18n';

const setLanguage = lang => {
    setStorage('lang', lang);
    setCookieLanguage(lang);
    return lang;
};

export const getLanguage = () => {
    const parsed_url = parseQueryString().lang || parseQueryString().l;
    const parsed_valid_url =
        parsed_url?.length > 1 ? document.location.search.match(/(lang|l)=([a-z]{2})/)[2] : parsed_url;
    const supported_storage_lang = getStorage('lang') in supported_languages ? getStorage('lang') : null;
    const query_lang = parsed_valid_url ? parsed_valid_url || supported_storage_lang : 'en';
    const is_query_lang_supported = query_lang in supported_languages;

    if (is_query_lang_supported) {
        setLanguage(query_lang);
    } else {
        const new_search = document.location.search.replace(/(lang|l)+=[a-z]{2}/, 'lang=en');
        window.history.pushState(null, '/', new_search);
        setLanguage('en');
    }
};

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
