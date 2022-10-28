import { ad_type } from 'Constants/floating-rate';
import { formatMoney } from '@deriv/shared';

export const roundOffDecimal = (number, decimal_place = 2) => {
    // Rounds of the digit to the specified decimal place
    if (number === null || number === undefined) {
        return 0;
    }

    return parseFloat(number).toFixed(decimal_place);
    // TODO: Uncomment the below line once BE has resolved the rounding issue
    // return parseFloat(Math.round(number * Math.pow(10, decimal_place)) / Math.pow(10, decimal_place));
};

export const setDecimalPlaces = (value, expected_decimal_place) => {
    // Returns the accurate number of decimal places to prevent trailing zeros
    if (!value?.toString()) {
        return 0;
    }
    const actual_decimal_place = value.toString().split('.')[1]?.length;
    return actual_decimal_place > expected_decimal_place ? expected_decimal_place : actual_decimal_place;
};

export const percentOf = (number, percent) => {
    // This method is used for computing the effective percent of a number
    const parsed_number = parseFloat(number);
    const parsed_percent = parseFloat(percent);
    return parsed_number + parsed_number * (parsed_percent / 100);
};

export const generateEffectiveRate = ({
    price = 0,
    rate = 0,
    local_currency = {},
    exchange_rate = 0,
    market_rate,
    rate_type = ad_type.FIXED,
} = {}) => {
    let effective_rate = 0;
    let display_effective_rate = 0;
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

export const removeTrailingZeros = value => {
    // Returns the string after truncating extra zeros
    if (!value) {
        return '';
    }
    const [input, unit] = value.toString().trim().split(' ');
    if (input.indexOf('.') === -1) {
        return formatInput(input, unit);
    }
    let trim_from = input.length - 1;
    do {
        if (input[trim_from] === '0') {
            trim_from--;
        }
    } while (input[trim_from] === '0');
    if (input[trim_from] === '.') {
        trim_from--;
    }
    const result = value.toString().substr(0, trim_from + 1);
    return formatInput(result, unit);
};

const formatInput = (input, unit) => {
    const plain_input = input.replace(/,/g, '');
    if (parseFloat(plain_input) % 1 === 0) {
        return `${input}.00 ${unit ? unit.trim() : ''}`;
    }
    if (plain_input.split('.')[1].length === 1) {
        return `${input}0 ${unit ? unit.trim() : ''}`;
    }
    return `${input}${unit ? ` ${unit.trim()}` : ''}`;
};
