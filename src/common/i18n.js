import sha1 from 'sha1';
import pt from './translations/pt_PT/i10n.json';
import es from './translations/es_ES/i10n.json';
import en from './translations/en/i10n.json';

export const supported_languages = {
    pt,
    es,
    en,
};

const fallbackLang = en;
let translation = {};

const t = key => (translation && key in translation ? translation[key] : fallbackLang[key]);

export const init = lang => {
    translation = supported_languages[lang];
};

export const translate = str => (str && t(sha1(str))) || str;

export const translateLangToLang = (str, fromLang, toLang) => {
    if (supported_languages[fromLang]) {
        const hashIndex = Object.values(supported_languages[fromLang]).findIndex(
            translatedStr => str === translatedStr
        );
        if (hashIndex !== -1) {
            const hash = Object.keys(supported_languages[fromLang])[hashIndex];
            const translatedStr = supported_languages[toLang][hash];
            if (translatedStr) {
                return translatedStr;
            }
        }
    }
    return str;
};

export const xml = dom => {
    const categories = Array.from(dom.getElementsByTagName('category') || []);
    categories.forEach(child => {
        const text = child.getAttribute('i18n-text');
        if (text) {
            child.setAttribute('name', translate(text));
        }
        xml(child);
    });
    return dom;
};
