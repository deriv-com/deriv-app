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
