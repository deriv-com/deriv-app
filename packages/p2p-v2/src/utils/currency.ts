/**
 * Converts a number into a string of US-supported currency format. For example:
 * 10000 => 10,000.00

 * @param value - The numerical currency value to convert to US-supported currency format
 * @returns 
 */
export const numberToCurrencyText = (value: number) =>
    new Intl.NumberFormat('en-US', {
        maximumFractionDigits: 2,
        minimumFractionDigits: 2,
        style: 'decimal',
    }).format(value);
