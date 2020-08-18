import { localize } from '@deriv/translations';

export const ERROR_MESSAGES = {
    address: localize(
        'Only letters, numbers, space, and these special characters are allowed: {{permitted_characters}}',
        { permitted_characters: "- . ' # ; : ( ) , @ /" }
    ),
    barrier: localize('Only numbers and these special characters are allowed: {{permitted_characters}}', {
        permitted_characters: '+ - .',
    }),
    email: localize('Invalid email address.'),
    general: localize('Only letters, numbers, space, hyphen, period, and apostrophe are allowed.'),
    letter_symbol: localize('Only letters, space, hyphen, period, and apostrophe are allowed.'),
    min: localize('Minimum of {{value}} characters required.', { value: '{{value}}' }),
    password: localize('Password should have lower and uppercase letters with numbers.'),
    phone: localize('Only numbers and spaces are allowed.'),
    postcode: localize('Only letters, numbers, space, and hyphen are allowed.'),
    req: field => localize('{{field}} is required', { field }),
    signup_token: localize('The length of token should be 8.'),
    tax_id: localize('Should start with letter or number, and may contain hyphen and underscore.'),
    number: localize('Should be a valid number.'),
    decimalPlaces: options =>
        localize('Up to {{decimal_count}} decimal places are allowed.', { decimal_count: options.decimals }),
    value: value => localize('Should be {{value}}', { value }),
    betweenMinMax: (min_value, max_value) =>
        localize('Should be between {{min_value}} and {{max_value}}', {
            min_value,
            max_value,
        }),
    minNumber: min_value => localize('Should be more than {{min_value}}', { min_value }),
    maxNumber: max_value =>
        localize('Should be less than {{max_value}}', {
            max_value,
        }),
};
