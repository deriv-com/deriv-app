import { validLetterSymbol } from '../declarative-validation-rules';

describe('validLetterSymbol', () => {
    it('should return true for valid input', () => {
        expect(validLetterSymbol('John Doe')).toBe(true);
        expect(validLetterSymbol("Jane O'Connor")).toBe(true);
        expect(validLetterSymbol('Mary-Louise')).toBe(true);
        expect(validLetterSymbol("D'Artagnan")).toBe(true);
    });

    it('should return false for invalid input', () => {
        expect(validLetterSymbol('123')).toBe(false);
        expect(validLetterSymbol('John!')).toBe(false);
    });

    it('should work with special characters', () => {
        expect(validLetterSymbol('!@#$%^&*()_+')).toBe(false);
        expect(validLetterSymbol('John Doe!@#')).toBe(false);
        expect(validLetterSymbol("D'Artagnan!")).toBe(false);
    });
});
