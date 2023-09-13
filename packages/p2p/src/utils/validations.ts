/**
 * Validates that a string represents a decimal number.
 * It checks if the string contains only digits and at most one decimal point.
 *
 * @param {String} value - The string to validate as a decimal number.
 * @returns {boolean} A boolean indicating the string is a valid decimal number.
 */
export const decimalValidator = (value: string): boolean => /^(\d+\.)?\d+$/.test(value);

/**
 * Validates the length of the text is between 1 and 300 characters.
 *
 * @param {String} value - The string to validate length.
 * @returns {boolean} A boolean indicating the length of the text is valid.
 */
export const lengthValidator = (value: string): boolean => value.length >= 1 && value.length <= 300;

/**
 * Validates whether a string contains only letters, numbers, spaces, and certain punctuation marks.
 * @param {String} value - The string to validate text.
 * @returns {boolean} A boolean indicating the text is valid.
 */
export const textValidator = (value: string): boolean => /^[\p{L}\p{Nd}\s'.,:;()@#+/-]*$/u.test(value);

/**
 * Validates if the given value falls within the set range and returns a boolean.
 *
 * @param {Number} input - The value to validate
 * @param {Number} limit - The limit to validate against.
 * @returns {boolean} A boolean indicating if the value is within the set range.
 */
export const rangeValidator = (input: number, limit: number): boolean => input >= limit * -1 && input <= limit;

/**
 * Validates floating-point integers in input box and checks if the string contains only
 * digits and at most one decimal point.
 *
 * @param {String} value - The value to validate as a floating-point integer.
 * @returns {boolean} A boolean indicating if the value is a valid floating-point integer.
 */
export const floatingPointValidator = (value: string): boolean =>
    ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', '.'].includes(value) || /^\d*\.?\d+$/.test(value);
