/* eslint-disable */
const extend = require('extend');

export const isEmptyObject = (obj: any) => {
    let is_empty = true;
    if (obj && obj instanceof Object) {
        Object.keys(obj).forEach(key => {
            if (Object.prototype.hasOwnProperty.call(obj, key)) is_empty = false;
        });
    }
    return is_empty;
};

export const cloneObject = (obj: any) => (!isEmptyObject(obj) ? extend(true, Array.isArray(obj) ? [] : {}, obj) : obj);

// Note that this function breaks on objects with circular references.
export const isDeepEqual = (a: any, b: any) => {
    if (typeof a !== typeof b) {
        return false;
    } else if (Array.isArray(a)) {
        return isEqualArray(a, b);
    } else if (a && b && typeof a === 'object') {
        return isEqualObject(a, b);
    } else if (typeof a === 'number' && typeof b === 'number' && isNaN(a) && isNaN(b)) {
        return true;
    }
    // else
    return a === b;
};

export const isEqualArray = (arr1: any[], arr2: any[]): boolean =>
    arr1 === arr2 || (arr1.length === arr2.length && arr1.every((value, idx) => isDeepEqual(value, arr2[idx])));

export const isEqualObject = (obj1: any, obj2: any): boolean =>
    obj1 === obj2 ||
    (Object.keys(obj1).length === Object.keys(obj2).length &&
        Object.keys(obj1).every(key => isDeepEqual(obj1[key], obj2[key])));

export const getPropertyValue = (obj: any, k: string | string[]): any => {
    let keys = k;
    if (!Array.isArray(keys)) keys = [keys];
    if (!isEmptyObject(obj) && keys[0] in obj && keys && keys.length > 1) {
        return getPropertyValue(obj[keys[0]], keys.slice(1));
    }
    // else return clone of object to avoid overwriting data
    return obj ? cloneObject(obj[keys[0]]) : undefined;
};

// Recursively freeze an object (deep freeze)
export const deepFreeze = (obj: any) => {
    Object.getOwnPropertyNames(obj).forEach(key => {
        const value = obj[key];
        if (value && typeof value === 'object' && !Object.isFrozen(value)) {
            deepFreeze(value);
        }
    });
    return Object.freeze(obj);
};
