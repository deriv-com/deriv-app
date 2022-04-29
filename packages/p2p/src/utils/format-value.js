export const roundOffDecimal = (number, decimal_point = 2) => {
    // Rounds of the digit to the specified decimal point
    return parseFloat(Math.round(number * Math.pow(10, decimal_point)) / Math.pow(10, decimal_point));
};

export const setDecimalPlaces = (value, expected_decimal_point) => {
    // Returns the accurate number of decimal places to prevent trailing zeros
    if (!value?.toString()) {
        return 0;
    }
    const actual_decimal_point = value.toString().split('.')[1]?.length;
    return actual_decimal_point > expected_decimal_point ? expected_decimal_point : actual_decimal_point;
};
