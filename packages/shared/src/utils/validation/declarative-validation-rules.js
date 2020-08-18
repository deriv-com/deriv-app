import { addComma, getDecimalPlaces } from '../currency';
import { cloneObject } from '../object';
import { compareBigUnsignedInt } from '../string';

export const validRequired = (value /* , options, field */) => {
    if (value === undefined || value === null) {
        return false;
    }

    const str = String(value).replace(/\s/g, '');
    return str.length > 0;
};
export const validAddress = value => !/[`~!$%^&*_=+[}{\]\\"?><|]+/.test(value);
export const validPostCode = value => /^[a-zA-Z\s\W\d-]*$/.test(value);
export const validTaxID = value => /^[a-zA-Z0-9]*[\w-]*$/.test(value);
export const validPhone = value => /^\+(?:[0-9] ?){6,14}[0-9]$/.test(value);
export const validCountryCode = (list, value) => list.some(item => value.startsWith(`+${item.phone_idd}`));
export const validLetterSymbol = value => !/[`~!@#$%^&*)(_=+[}{\]\\/";:?><,|\d]+/.test(value);
export const validLength = (value, options) =>
    (options.min ? value.length >= options.min : true) && (options.max ? value.length <= options.max : true);
export const validPassword = value => /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]+/.test(value);
const validBarrier = value => /^[+-]?\d+\.?\d*$/.test(value);
const validEmail = value => /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,63}$/.test(value);
const validGeneral = value => !/[`~!@#$%^&*)(_=+[}{\]\\/";:?><|]+/.test(value);
const validMin = (value, options) => (options.min ? value.length >= options.min : true);
const validRegular = (value, options) => options.regex.test(value);
const confirmRequired = value => value === true;
const validEmailToken = value => value.trim().length === 8;

let pre_build_dvrs, error_messages;

const isMoreThanMax = (value, options) =>
    options.type === 'float' ? +value > +options.max : compareBigUnsignedInt(value, options.max) === 1;

export const validNumber = (value, opts) => {
    const options = cloneObject(opts);
    let message = null;
    if (options.allow_empty && value.length === 0) {
        return true;
    }

    let is_ok = true;
    if ('min' in options && typeof options.min === 'function') {
        options.min = options.min();
    }
    if ('max' in options && typeof options.max === 'function') {
        options.max = options.max();
    }

    if (!(options.type === 'float' ? /^\d*(\.\d+)?$/ : /^\d+$/).test(value) || isNaN(value)) {
        is_ok = false;
        message = error_messages.number;
    } else if (
        options.type === 'float' &&
        options.decimals &&
        !new RegExp(`^\\d+(\\.\\d{0,${options.decimals}})?$`).test(value)
    ) {
        is_ok = false;
        message = error_messages.decimalPlaces(options);
    } else if ('min' in options && 'max' in options && +options.min === +options.max && +value !== +options.min) {
        is_ok = false;
        message = error_messages.value(
            addComma(options.min, options.format_money ? getDecimalPlaces(Client.get('currency')) : undefined)
        );
    } else if ('min' in options && 'max' in options && (+value < +options.min || isMoreThanMax(value, options))) {
        is_ok = false;
        const min_value = addComma(
            options.min,
            options.format_money ? getDecimalPlaces(Client.get('currency')) : undefined
        );
        const max_value = addComma(
            options.max,
            options.format_money ? getDecimalPlaces(Client.get('currency')) : undefined
        );
        message = error_messages.betweenMinMax(min_value, max_value);
    } else if ('min' in options && +value < +options.min) {
        is_ok = false;
        const min_value = addComma(
            options.min,
            options.format_money ? getDecimalPlaces(Client.get('currency')) : undefined
        );
        message = error_messages.minNumber(min_value);
    } else if ('max' in options && isMoreThanMax(value, options)) {
        is_ok = false;
        const max_value = addComma(
            options.max,
            options.format_money ? getDecimalPlaces(Client.get('currency')) : undefined
        );
        message = error_messages.maxNumber(max_value);
    }

    getPreBuildDVRs().number.message = message;
    return is_ok;
};

const initPreBuildDVRs = error_messages => ({
    address: {
        func: validAddress,
        message: error_messages.address,
    },
    barrier: {
        func: validBarrier,
        message: error_messages.barrier,
    },
    email: { func: validEmail, message: error_messages.email },
    general: {
        func: validGeneral,
        message: error_messages.general,
    },
    length: { func: validLength, message: '' }, // Message will be set in validLength function on initiation
    letter_symbol: {
        func: validLetterSymbol,
        message: error_messages.letter_symbol,
    },
    min: { func: validMin, message: error_messages.min },
    number: { func: validNumber, message: '' },
    password: {
        func: validPassword,
        message: error_messages.password,
    },
    phone: { func: validPhone, message: error_messages.phone },
    postcode: { func: validPostCode, message: error_messages.postcode },
    regular: { func: validRegular, message: '' },
    req: { func: validRequired, message: error_messages.req },
    confirm: { func: confirmRequired, message: '' },
    signup_token: { func: validEmailToken, message: error_messages.signup_token },
    tax_id: {
        func: validTaxID,
        message: error_messages.validTaxID,
    },
});

export const setValidationErrorMessages = all_error_messages => {
    if (!pre_build_dvrs) {
        error_messages = all_error_messages;
        pre_build_dvrs = initPreBuildDVRs(error_messages);
    }
};

export const getPreBuildDVRs = () => {
    return pre_build_dvrs;
};

export const getErrorMessages = () => {
    return error_messages;
};
