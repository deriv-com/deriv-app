export const roundOffDecimal = (number, decimal_place = 2) => {
    // Rounds of the digit to the specified decimal place
    return parseFloat(Math.round(number * Math.pow(10, decimal_place)) / Math.pow(10, decimal_place));
};

export const setDecimalPlaces = (value, expected_decimal_place) => {
    // Returns the accurate number of decimal places to prevent trailing zeros
    if (!value?.toString()) {
        return 0;
    }
    const actual_decimal_place = value.toString().split('.')[1]?.length;
    return actual_decimal_place > expected_decimal_place ? expected_decimal_place : actual_decimal_place;
};

export const removeTrailingZeros = value => {
    if (!value) {
        return '';
    }
    const [input, unit] = value.toString().trim().split(' ');
    if (input.indexOf('.') === -1) {
        return input;
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
    const result = value.substr(0, trim_from + 1);
    return parseFloat(result) % 1 !== 0
        ? `${result}.00 ${unit ? unit.trim() : ''}`
        : `${result} ${unit ? unit.trim() : ''}`;
};
