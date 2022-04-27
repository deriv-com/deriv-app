export const roundOffDecimal = (number, decimal_point = 2) => {
    // Rounds of the digit to the specified decimal point
    return parseFloat(Math.round(number * Math.pow(10, decimal_point)) / Math.pow(10, decimal_point));
};
