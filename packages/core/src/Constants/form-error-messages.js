import { localize } from '@deriv/translations';
import { address_permitted_special_characters_message } from '@deriv/shared';

export const FORM_ERROR_MESSAGES = {
    empty_address: () => localize('This field is required'),
    address: () =>
        localize('Use only the following special characters: {{permitted_characters}}', {
            permitted_characters: address_permitted_special_characters_message,
            interpolation: { escapeValue: false },
        }),
    barrier: () =>
        localize('Only numbers and these special characters are allowed: {{permitted_characters}}', {
            permitted_characters: '+ - .',
        }),
    email: () => localize('Invalid email address.'),
    general: () => localize('Only letters, numbers, space, hyphen, period, and apostrophe are allowed.'),
    name: () => localize('Letters, spaces, periods, hyphens, apostrophes only.'),
    password: () => localize('Password should have lower and uppercase English letters with numbers.'),
    po_box: () => localize('P.O. Box is not accepted in address'),
    phone: () => localize('Please enter a valid phone number (e.g. +15417541234).'),
    postcode: () => localize('Only letters, numbers, space and hyphen are allowed.'),
    signup_token: () => localize('The length of token should be 8.'),
    tax_id: () => localize('Should start with letter or number, and may contain hyphen and underscore.'),
    number: () => localize('Should be a valid number.'),
    decimalPlaces: decimals =>
        localize('Up to {{decimal_count}} decimal places are allowed.', { decimal_count: decimals }),
    value: value => localize('Should be {{value}}', { value }),
    betweenMinMax: (min_value, max_value) =>
        localize('Should be between {{min_value}} and {{max_value}}', {
            min_value,
            max_value,
        }),
    minNumber: min_value => localize('Should be more than {{min_value}}', { min_value }),
    maxNumber: max_value => localize('Should be less than {{max_value}}', { max_value }),
    // all existing warning phrases from zxcvbn

    password_warnings: {
        common: () => localize('This is a very common password'),
        commonNames: () => localize('Common names and surnames are easy to guess'),
        dates: () => localize('Dates are easy to guess'),
        extendedRepeat: () => localize('Repeated character patterns like "abcabcabc" are easy to guess'),
        keyPattern: () => localize('Short keyboard patterns are easy to guess'),
        namesByThemselves: () => localize('Single names or surnames are easy to guess'),
        pwned: () => localize('Your password was exposed by a data breach on the Internet'),
        recentYears: () => localize('Recent years are easy to guess'),
        sequences: () => localize('Common character sequences like "abc" are easy to guess'),
        similarToCommon: () => localize('This is similar to a commonly used password'),
        simpleRepeat: () => localize('Repeated characters like "aaa" are easy to guess'),
        straightRow: () => localize('Straight rows of keys on your keyboard are easy to guess'),
        topHundred: () => localize('This is a frequently used password'),
        topTen: () => localize('This is a heavily used password'),
        userInputs: () => localize('There should not be any personal or page related data'),
        wordByItself: () => localize('Single words are easy to guess'),
    },
};
