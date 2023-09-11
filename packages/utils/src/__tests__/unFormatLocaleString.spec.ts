import unFormatLocaleString from '../unFormatLocaleString';

describe('unFormatLocaleString', () => {
    test('should unformat correctly when the number is less than 3 digits', () => {
        const result = unFormatLocaleString('123', 'en-US');

        expect(result).toBe('123');
    });

    test('should unformat correctly when the number is more than 3 digits', () => {
        const result = unFormatLocaleString('123,456', 'en-US');

        expect(result).toBe('123456');
    });

    test('should unformat correctly when the number is more than 3 digits and has decimals', () => {
        const result = unFormatLocaleString('123,456.78', 'en-US');

        expect(result).toBe('123456.78');
    });

    test('should unformat correctly when the number is more than 3 digits and has decimals and is in spanish', () => {
        const result = unFormatLocaleString('123.456,78', 'es-ES');

        expect(result).toBe('123456.78');
    });
});
