/**
 * Validates that a string represents a decimal number.
 * It checks if the string contains only digits and at most one decimal point.
 *
 * @param {String} value - The string to validate as a decimal number.
 * @returns A boolean indicating the string is a valid decimal number.
 */
export const decimalValidator = (value: string) => /^(\d+\.)?\d+$/.test(value);

/**
 * Validates the length of the text is between 1 and 300 characters.
 *
 * @param {String} value - The string to validate length.
 * @returns A boolean indicating the length of the text is valid.
 */
export const lengthValidator = (value: string) => value.length >= 1 && value.length <= 300;

/**
 * Validates whether a string contains only letters, numbers, spaces, and certain punctuation marks.
 * @param {String} value - The string to validate text.
 * @returns A boolean indicating the text is valid.
 */
export const textValidator = (value: string) => /^[\p{L}\p{Nd}\s'.,:;()@#+/-]*$/u.test(value);

/**
 * Validates if the given value falls within the set range and returns a boolean.
 *
 * @param {Number} input - The value to validate
 * @param {Number} limit - The limit to validate against.
 * @returns A boolean indicating if the value is within the set range.
 */
export const rangeValidator = (input: number, limit: number) => input >= limit * -1 && input <= limit;

/**
 * Validates floating-point integers in input box that do not contain scientific notation (e, E, -, +)
 * such as 12.2e+2 or 12.2e-2 and no negative numbers
 *
 * @param {String} value - The value to validate as a floating-point integer.
 * @returns A boolean indicating if the value is a valid floating-point integer.
 */
export const floatingPointValidator = (value: string) =>
    ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', '.'].includes(value) ||
    /^[0-9]*[.]?[0-9]+$(?:[eE\-+]*$)/.test(value);
