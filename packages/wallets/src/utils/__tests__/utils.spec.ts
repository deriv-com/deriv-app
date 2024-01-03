import unixToDateString from '../utils';
import '@testing-library/jest-dom';

describe('unixToDateString', () => {
    test('should convert date to formatted string in default locale', () => {
        const date = new Date('2022-01-01T00:00:00.000Z');

        const formattedDate = unixToDateString(date);
        expect(formattedDate).toBe('2022-01-01');
    });
});
