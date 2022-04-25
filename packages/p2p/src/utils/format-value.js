export function truncateDecimal(number, decimal_point = 2) {
    // Truncates the number to specified decimal digits without rounding off the next decimal digit
    return Math.trunc(number * Math.pow(10, decimal_point)) / Math.pow(10, decimal_point);
}
