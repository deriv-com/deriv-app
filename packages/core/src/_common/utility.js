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

const copyToClipboard = text => {
    const textField = document.createElement('textarea');
    textField.innerText = text;
    document.body.appendChild(textField);
    textField.select();
    document.execCommand('copy');
    textField.remove();
};
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
// check if client is from EU
const isEuCountry = country => eu_countries.includes(country);
// countries where synthetics are not offered
const countries_without_synthetics = ['sg', 'de', 'gr', 'es', 'au', 'it', 'lu'];
// check if synthetics are offered based on country
const isSyntheticsUnavailable = country => countries_without_synthetics.includes(country);
// countries where binary options are blocked
const blocked_options_countries = ['au'];
const isOptionsBlocked = country => blocked_options_countries.includes(country);

// Function that gets the selected platform from URL
const getSelectedPlatform = () => {
    const query = new URLSearchParams(window.location.search);
    const platform = query.get('platform');
    return platform;
};

// Fuction to direct user based on the selected platform from deriv-com before login
const directUser = platform => {
    const dmt5_url = 'mt5';
    const dbot_url = 'bot';
    const derivx_url = 'derivx';

    if (platform === dmt5_url) {
        window.location = `/${dmt5_url}`;
    } else if (platform === dbot_url) {
        window.location = `/${dbot_url}`;
    } else if (platform === derivx_url) {
        window.location = `/${derivx_url}`;
    } else if (platform !== dmt5_url && platform !== dbot_url && platform !== derivx_url && platform !== null) {
        window.location = `/`;
    }
};

module.exports = {
    template,
    createElement,
    getStaticHash,
    PromiseClass,
    isEuCountry,
    isOptionsBlocked,
    isSyntheticsUnavailable,
    copyToClipboard,
    getSelectedPlatform,
    directUser,
};
