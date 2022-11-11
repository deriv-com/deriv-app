import { addComma } from '../currency';
import { cloneObject } from '../object';
import { compareBigUnsignedInt } from '../string';
import { TFormErrorMessagesTypes } from './form-error-messages-types';

export type TOptions = {
    min: number;
    max: number;
    type?: string;
    decimals?: string | number;
    regex?: RegExp;
};

const validRequired = (value?: string | number /* , options, field */) => {
    if (value === undefined || value === null) {
        return false;
    }

    const str = value.toString().replace(/\s/g, '');
    return str.length > 0;
};
export const validAddress = (value: string) => !/[`~!$%^&*_=+[}{\]\\"?><|]+/.test(value);
export const validPostCode = (value: string) => value === '' || /^[A-Za-z0-9][A-Za-z0-9\s-]*$/.test(value);
export const validTaxID = (value: string) => /(?!^$|\s+)[A-Za-z0-9./\s-]$/.test(value);
export const validPhone = (value: string) => /^\+?([0-9-]+\s)*[0-9-]+$/.test(value);
export const validLetterSymbol = (value: string) => /^[A-Za-z]+([a-zA-Z.' -])*[a-zA-Z.' -]+$/.test(value);
export const validLength = (value = '', options: TOptions) =>
    (options.min ? value.length >= options.min : true) && (options.max ? value.length <= options.max : true);
export const validPassword = (value: string) => /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]+/.test(value);
export const validEmail = (value: string) => /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,63}$/.test(value);
const validBarrier = (value: string) => /^[+-]?\d+\.?\d*$/.test(value);
const validGeneral = (value: string) => !/[`~!@#$%^&*)(_=+[}{\]\\/";:?><|]+/.test(value);
const validRegular = (value: string, options: TOptions) => options.regex?.test(value);
const confirmRequired = (value: string) => value === 'true';
const checkPOBox = (value: string) => !/p[.\s]+o[.\s]+box/i.test(value);
const validEmailToken = (value: string) => value.trim().length === 8;

let pre_build_dvrs: TInitPreBuildDVRs, form_error_messages: TFormErrorMessagesTypes;

const isMoreThanMax = (value: number, options: TOptions) =>
    options.type === 'float' ? +value > +options.max : compareBigUnsignedInt(value, options.max) === 1;

export const validNumber = (value: string, opts: TOptions) => {
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

    if (!(options.type === 'float' ? /^\d*(\.\d+)?$/ : /^\d+$/).test(value) || isNaN(+value)) {
        is_ok = false;
        message = form_error_messages.number();
    } else if ('min' in options && 'max' in options && +options.min === +options.max && +value !== +options.min) {
        is_ok = false;
        message = form_error_messages.value(addComma(options.min));
    } else if (
        'min' in options &&
        'max' in options &&
        options.min > 0 &&
        (+value < +options.min || isMoreThanMax(+value, options))
    ) {
        is_ok = false;
        const min_value = addComma(options.min);
        const max_value = addComma(options.max);
        message = form_error_messages.betweenMinMax(min_value, max_value);
    } else if (
        options.type === 'float' &&
        options.decimals &&
        !new RegExp(`^\\d+(\\.\\d{0,${options.decimals}})?$`).test(value)
    ) {
        is_ok = false;
        message = form_error_messages.decimalPlaces(options.decimals);
    } else if ('min' in options && +value < +options.min) {
        is_ok = false;
        const min_value = addComma(options.min);
        message = form_error_messages.minNumber(min_value);
    } else if ('max' in options && isMoreThanMax(+value, options)) {
        is_ok = false;
        const max_value = addComma(options.max);
        message = form_error_messages.maxNumber(max_value);
    }
    return { is_ok, message };
};

export type TInitPreBuildDVRs = ReturnType<typeof initPreBuildDVRs>;
const initPreBuildDVRs = () => ({
    address: {
        func: validAddress,
        message: form_error_messages.address,
    },
    barrier: {
        func: validBarrier,
        message: form_error_messages.barrier,
    },
    email: { func: validEmail, message: form_error_messages.email },
    general: {
        func: validGeneral,
        message: form_error_messages.general,
    },
    length: { func: validLength, message: '' }, // Message will be set in validLength function on initiation
    letter_symbol: {
        func: validLetterSymbol,
        message: form_error_messages.letter_symbol,
    },
    number: {
        func: (value: string, opts: TOptions) => validNumber(value, opts),
        message: form_error_messages.number,
    },
    password: {
        func: validPassword,
        message: form_error_messages.password,
    },
    phone: { func: validPhone, message: form_error_messages.phone },
    po_box: { func: checkPOBox, message: form_error_messages.po_box },
    postcode: { func: validPostCode, message: form_error_messages.postcode },
    regular: { func: validRegular, message: '' },
    req: { func: validRequired, message: '' },
    confirm: { func: confirmRequired, message: '' },
    signup_token: { func: validEmailToken, message: form_error_messages.signup_token },
    tax_id: {
        func: validTaxID,
        message: form_error_messages.validTaxID,
    },
});

export const initFormErrorMessages = (all_form_error_messages: TFormErrorMessagesTypes) => {
    if (!pre_build_dvrs) {
        form_error_messages = all_form_error_messages;
        pre_build_dvrs = initPreBuildDVRs();
    }
};

export const getPreBuildDVRs = () => {
    return pre_build_dvrs;
};

export const getErrorMessages = () => {
    return form_error_messages;
};
