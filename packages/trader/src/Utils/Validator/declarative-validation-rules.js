import CurrencyUtils             from 'deriv-shared/utils/currency';
import ObjectUtils               from 'deriv-shared/utils/object';
import { ClientBase }           from '_common/base/client_base';
import { getElementById }        from '_common/common_functions';
import { compareBigUnsignedInt } from '_common/string_util';
import { localize }              from 'deriv-translations';

// ------------------------------
// ----- Validation Methods -----
// ------------------------------
const validRequired     = (value/* , options, field */) => {
    if (value === undefined || value === null) {
        return false;
    }

    const str = String(value).replace(/\s/g, '');
    return str.length > 0;
};
const validEmail               = value => /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,63}$/.test(value);
export const validPassword     = value => /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]+/.test(value);
export const validLetterSymbol = value => !/[`~!@#$%^&*)(_=+[}{\]\\/";:?><,|\d]+/.test(value);
const validGeneral             = value => !/[`~!@#$%^&*)(_=+[}{\]\\/";:?><|]+/.test(value);
export const validAddress      = value => !/[`~!$%^&*_=+[}{\]\\"?><|]+/.test(value);
export const validPostCode     = value => /^[a-zA-Z\d-\s]*$/.test(value);
export const validPhone        = value => /^\+?((-|\s)*[0-9])*$/.test(value);
const validRegular             = (value, options) => options.regex.test(value);
const validEmailToken          = value => value.trim().length === 8;
export const validTaxID        = value => /^[a-zA-Z0-9]*[\w-]*$/.test(value);
const validBarrier             = value => /^[+-]?\d+\.?\d*$/.test(value);

const validCompare  = (value, options) => value === getElementById(options.to.substr(1)).value;
const validNotEqual = (value, options) => value !== getElementById(options.to.substr(1)).value;
const validMin      = (value, options) => (options.min ? value.length >= options.min : true);
export const validLength   = (value, options) => (
    (options.min ? value.length >= options.min : true) &&
    (options.max ? value.length <= options.max : true)
);

export const validNumber = (value, opts) => {
    const options = ObjectUtils.cloneObject(opts);
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
        is_ok   = false;
        message = localize('Should be a valid number.');
    } else if (options.type === 'float' && options.decimals &&
        !(new RegExp(`^\\d+(\\.\\d{0,${options.decimals}})?$`).test(value))) {
        is_ok   = false;
        message = localize('Up to {{decimal_count}} decimal places are allowed.', { decimal_count: options.decimals });
    } else if ('min' in options && 'max' in options && +options.min === +options.max && +value !== +options.min) {
        is_ok   = false;
        message = localize('Should be {{value}}', { value: CurrencyUtils.addComma(options.min, options.format_money ? CurrencyUtils.getDecimalPlaces(ClientBase.get('currency')) : undefined) });
    } else if ('min' in options && 'max' in options && (+value < +options.min || isMoreThanMax(value, options))) {
        is_ok   = false;
        message = localize(
            'Should be between {{min_value}} and {{max_value}}',
            {
                min_value: CurrencyUtils.addComma(options.min, options.format_money ? CurrencyUtils.getDecimalPlaces(ClientBase.get('currency')) : undefined),
                max_value: CurrencyUtils.addComma(options.max, options.format_money ? CurrencyUtils.getDecimalPlaces(ClientBase.get('currency')) : undefined),
            }
        );
    } else if ('min' in options && +value < +options.min) {
        is_ok   = false;
        message = localize('Should be more than {{min_value}}', { min_value: CurrencyUtils.addComma(options.min, options.format_money ? CurrencyUtils.getDecimalPlaces(ClientBase.get('currency')) : undefined) });
    } else if ('max' in options && isMoreThanMax(value, options)) {
        is_ok   = false;
        message = localize('Should be less than {{max_value}}', { max_value: CurrencyUtils.addComma(options.max, options.format_money ? CurrencyUtils.getDecimalPlaces(ClientBase.get('currency')) : undefined) });
    }

    getPreBuildDVRs().number.message = message;
    return is_ok;
};

const isMoreThanMax = (value, options) =>
    (options.type === 'float' ? +value > +options.max : compareBigUnsignedInt(value, options.max) === 1);

const initPreBuildDVRs = () => ({
    address      : { func: validAddress,      message: localize('Only letters, numbers, space, and these special characters are allowed: {{permitted_characters}}', { permitted_characters: '- . \' # ; : ( ) , @ /' }) },
    barrier      : { func: validBarrier,      message: localize('Only numbers and these special characters are allowed: {{permitted_characters}}', { permitted_characters: '+ - .' }) },
    compare      : { func: validCompare,      message: localize('The two passwords that you entered do not match.') },
    email        : { func: validEmail,        message: localize('Invalid email address.') },
    general      : { func: validGeneral,      message: localize('Only letters, numbers, space, hyphen, period, and apostrophe are allowed.') },
    length       : { func: validLength,       message: localize('You should enter {{value}} characters.', { value: '{{value}}' }) },
    letter_symbol: { func: validLetterSymbol, message: localize('Only letters, space, hyphen, period, and apostrophe are allowed.') },
    min          : { func: validMin,          message: localize('Minimum of {{value}} characters required.', { value: '{{value}}' }) },
    not_equal    : { func: validNotEqual,     message: localize('{{value_one}} and {{value_two}} cannot be the same.', { value_one: '{{value_one}}', value_two: '{{value_two}}' }) },
    number       : { func: validNumber,       message: '' }, // TODO: i18n_issue
    password     : { func: validPassword,     message: localize('Password should have lower and uppercase letters with numbers.') },
    phone        : { func: validPhone,        message: localize('Only numbers and spaces are allowed.') },
    postcode     : { func: validPostCode,     message: localize('Only letters, numbers, space, and hyphen are allowed.') },
    regular      : { func: validRegular,      message: '' },
    req          : { func: validRequired,     message: '' },
    signup_token : { func: validEmailToken,   message: localize('The length of token should be 8.') },
    tax_id       : { func: validTaxID,        message: localize('Should start with letter or number, and may contain hyphen and underscore.') },
});

let pre_build_dvrs;
export const getPreBuildDVRs = () => {
    if (!pre_build_dvrs) {
        pre_build_dvrs = initPreBuildDVRs();
    }
    return pre_build_dvrs;
};

export const getPasswordLengthConfig = type => ({ min: (/^mt$/.test(type) ? 8 : 6), max: 25 });
