const extend = require('extend');
require('./lib/polyfills/element.matches');

const template = (string, content) => {
    let to_replace = content;
    if (content && !Array.isArray(content)) {
        to_replace = [content];
    }
    return string.replace(/\[_(\d+)]/g, (s, index) => to_replace[(+index) - 1]);
};

const isEmptyObject = (obj) => {
    let is_empty = true;
    if (obj && obj instanceof Object) {
        Object.keys(obj).forEach((key) => {
            if (Object.prototype.hasOwnProperty.call(obj, key)) is_empty = false;
        });
    }
    return is_empty;
};

const cloneObject = obj => (!isEmptyObject(obj) ? extend(true, Array.isArray(obj) ? [] : {}, obj) : obj);

const isDeepEqual = (a, b) => {
    if (typeof a !== typeof b) {
        return false;
    } else if (Array.isArray(a)) {
        return isEqualArray(a, b);
    } else if (a && b && typeof a === 'object') {
        return isEqualObject(a, b);
    }
    // else
    return a === b;
};

const isEqualArray = (arr1, arr2) => (
    arr1 === arr2 ||
    (
        arr1.length === arr2.length &&
        arr1.every((value, idx) => isDeepEqual(value, arr2[idx]))
    )
);

const isEqualObject = (obj1, obj2) => (
    obj1 === obj2 ||
    (
        Object.keys(obj1).length === Object.keys(obj2).length &&
        Object.keys(obj1).every(key => isDeepEqual(obj1[key], obj2[key]))
    )
);

// Filters out duplicates in an array of objects by key
const unique = (array, key) => array.filter((e, idx) =>
    array.findIndex((a, i) => a[key] ? a[key] === e[key] : i === idx) === idx);

const getPropertyValue = (obj, k) => {
    let keys = k;
    if (!Array.isArray(keys)) keys = [keys];
    if (!isEmptyObject(obj) && keys[0] in obj && keys && keys.length > 1) {
        return getPropertyValue(obj[keys[0]], keys.slice(1));
    }
    // else return clone of object to avoid overwriting data
    return obj ? cloneObject(obj[keys[0]]) : undefined;
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
    Object.keys(attributes).forEach((attr) => {
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
    static_hash = static_hash || (document.querySelector('script[src*="main"]').getAttribute('src') || '').split('.')[1];
    return static_hash;
};

class PromiseClass {
    constructor() {
        this.promise = new Promise((resolve, reject) => {
            this.reject  = reject;
            this.resolve = resolve;
        });
    }
}

module.exports = {
    template,
    isEmptyObject,
    cloneObject,
    isDeepEqual,
    unique,
    getPropertyValue,
    createElement,
    getStaticHash,
    PromiseClass,
};
