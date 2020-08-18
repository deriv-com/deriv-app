export const validAddress = value => !/[`~!$%^&*_=+[}{\]\\"?><|]+/.test(value);
export const validPostCode = value => /^[a-zA-Z\s\W\d-]*$/.test(value);
export const validTaxID = value => /^[a-zA-Z0-9]*[\w-]*$/.test(value);
export const validPhone = value => /^\+(?:[0-9] ?){6,14}[0-9]$/.test(value);
export const validCountryCode = (list, value) => list.some(item => value.startsWith(`+${item.phone_idd}`));
export const validLetterSymbol = value => !/[`~!@#$%^&*)(_=+[}{\]\\/";:?><,|\d]+/.test(value);
export const validLength = (value, options) =>
    (options.min ? value.length >= options.min : true) && (options.max ? value.length <= options.max : true);
