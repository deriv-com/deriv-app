/**
 * A function that counts the number of decimal places in a number.
 * @param {Number | String} value - The number to count the decimal places of.
 * @returns {Number} The number of decimal places in the number.
 */
export const countDecimalPlaces = (value: number | string): number => (value.toString().split('.')?.[1] ?? '').length;

/**
 * A function that gets the short nickname from a nickname.
 *
 * @param {String} nickname - The nickname to get the short nickname from.
 * @returns {String} The short nickname.
 */
export const getShortNickname = (nickname: string): string => nickname?.substring(0, 2).toUpperCase();

/**
 * A function that gets the error message for a text field.
 *
 * @param {String} fieldName - The name of the field.
 * @returns {String} The error message for the text field.
 */
export const getTextFieldError = (fieldName: string): string =>
    `${fieldName} can only include letters, numbers, spaces, and any of these symbols: -+.,'#@():;`;
