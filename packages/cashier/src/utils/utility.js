import { getCurrencyDisplayCode } from '@deriv/shared';

const template = (string, content) => {
    let to_replace = content;
    if (content && !Array.isArray(content)) {
        to_replace = [content];
    }
    return string.replace(/\[_(\d+)]/g, (s, index) => to_replace[+index - 1]);
};

/**
 * Creates a DOM element and adds any attributes to it.
 *
 * @param {String} tag_name: the tag to create, e.g. 'div', 'a', etc
 * @param {Object} attributes: all the attributes to assign, e.g. { id: '...', class: '...', html: '...', ... }
 * @return the created DOM element
 */
const createElement = (tag_name, attributes = {}) => {
    const el = document.createElement(tag_name);
    Object.keys(attributes).forEach(attr => {
        const value = attributes[attr];
        if (attr === 'text') {
            el.textContent = value;
        } else if (attr === 'html') {
            el.html(value);
        } else {
            el.setAttribute(attr, value);
        }
    });
    return el;
};

let static_hash;
const getStaticHash = () => {
    static_hash =
        static_hash || (document.querySelector('script[src*="main"]').getAttribute('src') || '').split('.')[1];
    return static_hash;
};

class PromiseClass {
    constructor() {
        this.promise = new Promise((resolve, reject) => {
            this.reject = reject;
            this.resolve = resolve;
        });
    }
}

// TODO: [duplicate_code] - Move this to shared package
// eu countries to support
const eu_countries = [
    'it',
    'de',
    'fr',
    'lu',
    'gr',
    'mf',
    'es',
    'sk',
    'lt',
    'nl',
    'at',
    'bg',
    'si',
    'cy',
    'be',
    'ro',
    'hr',
    'pt',
    'pl',
    'lv',
    'ee',
    'cz',
    'fi',
    'hu',
    'dk',
    'se',
    'ie',
    'im',
    'gb',
    'mt',
];
// TODO: [duplicate_code] - Move this to shared package
// check if client is from EU
const isEuCountry = country => eu_countries.includes(country);

// check if mlt or dxtrade for account text
const getAccountText = account => {
    let account_text = '';
    if (account.is_dxtrade || account.is_mt) {
        account_text = account.text;
    } else {
        account_text = getCurrencyDisplayCode(account.text);
    }

    return account_text;
};

const getNormalizedPaymentMethod = (payment_method, constants, is_for_icon = false) => {
    const method = is_for_icon ? payment_method.replace(/[' ',-]/g, '').toLowerCase() : payment_method;

    const normalized_payment_method = Object.entries(constants).reduce(
        (pay_method, [key, value]) => (value.some(el => el === method) ? key : pay_method),
        ''
    );
    return is_for_icon ? normalized_payment_method : normalized_payment_method || payment_method;
};

export {
    createElement,
    getAccountText,
    getNormalizedPaymentMethod,
    getStaticHash,
    isEuCountry,
    PromiseClass,
    template,
};
