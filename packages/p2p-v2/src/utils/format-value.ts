import { RATE_TYPE } from '@/constants';
import { formatMoney } from './currency';

/**
 * Rounds off the number to the specified decimal place.
 * @param {Number} number - The number to round off
 * @param {Number} decimalPlace - The decimal place to round off to (default: 2)
 * @returns {String} The rounded off number
 */
export const roundOffDecimal = (number: number, decimalPlace = 2): string => number.toFixed(decimalPlace);

/**
 * Sets the decimal places of the number to the specified decimal place.
 * @param {Number} value - The number to set the decimal places.
 * @param {Number} expectedDecimalPlace - The decimal place to set the number to.
 * @returns {Number} The number with the decimal places set.
 */
export const setDecimalPlaces = (value: number, expectedDecimalPlace: number): number => {
    const actualDecimalPlace = value.toString().split('.')[1]?.length;
    return actualDecimalPlace > expectedDecimalPlace ? expectedDecimalPlace : actualDecimalPlace;
};

/**
 * Calculates the percent of the number.
 * @param {String} number - The number to calculate the percent of.
 * @param {String} percent - The percent to calculate.
 * @returns {Number} The percent of the number.
 */
export const percentOf = (number: number, percent: number): number => number + number * (percent / 100);

type TGenerateEffectiveRate = {
    exchangeRate: number;
    localCurrency: string;
    marketRate: number;
    price: number;
    rate: number;
    rateType: string;
};

type TReturnGenerateEffectiveRate = {
    displayEffectiveRate: string;
    effectiveRate: number;
};

/**
 * Calculates the effective rate.
 * @param {Object} params - The parameters to calculate the effective rate.
 * @param {Number} params.exchangeRate - The exchange rate of the ad.
 * @param {String} params.localCurrency - The local currency of the ad.
 * @param {Number} params.marketRate - The market rate of the ad.
 * @param {Number} params.price - The price of the ad.
 * @param {Number} params.rate - The rate of the ad.
 * @param {String} params.rateType - The rate type of the ad.
 * @returns {Object} The effective rate and the display effective rate.
 */
export const generateEffectiveRate = ({
    exchangeRate = 0,
    localCurrency = '',
    marketRate = 0,
    price = 0,
    rate = 0,
    rateType = RATE_TYPE.FIXED,
}: Partial<TGenerateEffectiveRate>): TReturnGenerateEffectiveRate => {
    let effectiveRate, displayEffectiveRate;

    if (rateType === RATE_TYPE.FIXED) {
        effectiveRate = price;
        displayEffectiveRate = formatMoney(localCurrency, effectiveRate, true);
    } else {
        effectiveRate = exchangeRate > 0 ? percentOf(exchangeRate, rate) : marketRate;
        const decimalPlace = setDecimalPlaces(effectiveRate, 6);
        displayEffectiveRate = removeTrailingZeros(
            formatMoney(localCurrency, roundOffDecimal(effectiveRate, decimalPlace), true, decimalPlace)
        );
    }
    return { displayEffectiveRate, effectiveRate: Number(effectiveRate) };
};

/**
 * Removes the trailing zeros from the number.
 * @param {String} value - The number to remove the trailing zeros.
 * @returns {String} The number without the trailing zeros.
 */
export const removeTrailingZeros = (value: string): string => {
    const [input, unit] = value.trim().split(' ');

    if (input.indexOf('.') === -1) return formatInput(input, unit);

    let trimFrom = input.length - 1;

    do {
        if (input[trimFrom] === '0') trimFrom--;
    } while (input[trimFrom] === '0');

    if (input[trimFrom] === '.') trimFrom--;

    const result = value.toString().substring(0, trimFrom + 1);

    return formatInput(result, unit);
};

/**
 * Formats the input to the specified format.
 * @param {String} input - The input to format.
 * @param {String} unit - The unit to append to the input.
 * @returns {String} The formatted input.
 */
export const formatInput = (input: string, unit: string): string => {
    const plainInput = input.replace(/,/g, '');

    if (parseFloat(plainInput) % 1 === 0) return `${input}.00 ${unit ? unit.trim() : ''}`;

    if (plainInput.split('.')[1].length === 1) return `${input}0 ${unit ? unit.trim() : ''}`;

    return `${input}${unit ? ` ${unit.trim()}` : ''}`;
};

/**
 * Validates floating-point integers in input box and checks if the string contains only
 * digits and at most one decimal point.
 *
 * @param {String} value - The value to validate as a floating-point integer.
 * @returns {boolean} A boolean indicating if the value is a valid floating-point integer.
 */
export const floatingPointValidator = (value: string): boolean =>
    ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', '.'].includes(value) || /^\d*\.?\d+$/.test(value);
