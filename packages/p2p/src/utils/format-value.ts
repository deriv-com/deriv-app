import { formatMoney } from '@deriv/shared';
import { ad_type } from 'Constants/floating-rate';

/**
 * Rounds off the number to the specified decimal place.
 * @param {Number} number - The number to round off
 * @param {Number} decimal_place - The decimal place to round off to (default: 2)
 * @returns {String} The rounded off number
 */
export const roundOffDecimal = (number: number, decimal_place = 2): string => number.toFixed(decimal_place);

/**
 * Sets the decimal places of the number to the specified decimal place.
 * @param {Number} value - The number to set the decimal places.
 * @param {Number} expected_decimal_place - The decimal place to set the number to.
 * @returns {Number} The number with the decimal places set.
 */
export const setDecimalPlaces = (value: number, expected_decimal_place: number): number => {
    const actual_decimal_place = value.toString().split('.')[1]?.length;
    return actual_decimal_place > expected_decimal_place ? expected_decimal_place : actual_decimal_place;
};

/**
 * Calculates the percent of the number.
 * @param {String} number - The number to calculate the percent of.
 * @param {String} percent - The percent to calculate.
 * @returns {Number} The percent of the number.
 */
export const percentOf = (number: number, percent: number): number => number + number * (percent / 100);

type TGenerateEffectiveRate = {
    price: number;
    rate: number;
    local_currency: string;
    exchange_rate: number;
    market_rate: number;
    rate_type: string;
};

/**
 * Calculates the effective rate.
 * @param {Object} params - The parameters to calculate the effective rate.
 * @param {Number} params.price - The price of the ad.
 * @param {Number} params.rate - The rate of the ad.
 * @param {String} params.local_currency - The local currency of the ad.
 * @param {Number} params.exchange_rate - The exchange rate of the ad.
 * @param {Number} params.market_rate - The market rate of the ad.
 * @param {String} params.rate_type - The rate type of the ad.
 * @returns {Object} The effective rate and the display effective rate.
 */
export const generateEffectiveRate = ({
    price = 0,
    rate = 0,
    local_currency = '',
    exchange_rate = 0,
    market_rate = 0,
    rate_type = ad_type.FIXED,
}: Partial<TGenerateEffectiveRate>): object => {
    let effective_rate, display_effective_rate;

    if (rate_type === ad_type.FIXED) {
        effective_rate = price;
        display_effective_rate = formatMoney(local_currency, effective_rate, true);
    } else {
        effective_rate = exchange_rate > 0 ? percentOf(exchange_rate, rate) : market_rate;
        const decimal_place = setDecimalPlaces(effective_rate, 6);
        display_effective_rate = removeTrailingZeros(
            formatMoney(local_currency, roundOffDecimal(effective_rate, decimal_place), true, decimal_place)
        );
    }
    return { effective_rate, display_effective_rate };
};

/**
 * Removes the trailing zeros from the number.
 * @param {String} value - The number to remove the trailing zeros.
 * @returns {String} The number without the trailing zeros.
 */
export const removeTrailingZeros = (value: string): string => {
    const [input, unit] = value.trim().split(' ');

    if (input.indexOf('.') === -1) return formatInput(input, unit);

    let trim_from = input.length - 1;

    do {
        if (input[trim_from] === '0') trim_from--;
    } while (input[trim_from] === '0');

    if (input[trim_from] === '.') trim_from--;

    const result = value.toString().substring(0, trim_from + 1);

    return formatInput(result, unit);
};

/**
 * Formats the input to the specified format.
 * @param {String} input - The input to format.
 * @param {String} unit - The unit to append to the input.
 * @returns {String} The formatted input.
 */
export const formatInput = (input: string, unit: string): string => {
    const plain_input = input.replace(/,/g, '');

    if (parseFloat(plain_input) % 1 === 0) return `${input}.00 ${unit ? unit.trim() : ''}`;

    if (plain_input.split('.')[1].length === 1) return `${input}0 ${unit ? unit.trim() : ''}`;

    return `${input}${unit ? ` ${unit.trim()}` : ''}`;
};
