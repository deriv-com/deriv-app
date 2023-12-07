import {
    decimalValidator,
    lengthValidator,
    textValidator,
    rangeValidator,
    floatingPointValidator,
} from 'Utils/validations';

describe('decimalValidator', () => {
    it('should return true if the string is a valid decimal number', () => {
        expect(decimalValidator('123')).toBeTruthy();
        expect(decimalValidator('123.456')).toBeTruthy();
    });
    it('should return false if the string is not a valid decimal number', () => {
        expect(decimalValidator('123.')).toBeFalsy();
        expect(decimalValidator('123.456.789')).toBeFalsy();
        expect(decimalValidator('123.456.')).toBeFalsy();
        expect(decimalValidator('123.456.789')).toBeFalsy();
    });
});

describe('lengthValidator', () => {
    it('should return true if the string is between 1 and 300 characters', () => {
        expect(lengthValidator('a')).toBeTruthy();
        expect(lengthValidator('a'.repeat(150))).toBeTruthy();
        expect(lengthValidator('a'.repeat(300))).toBeTruthy();
    });
    it('should return false if the string is not between 1 and 300 characters', () => {
        expect(lengthValidator('')).toBeFalsy();
        expect(lengthValidator('a'.repeat(301))).toBeFalsy();
    });
});

describe('textValidator', () => {
    it('should return true if the string contains only letters, numbers, spaces, and certain punctuation marks', () => {
        expect(textValidator('test')).toBeTruthy();
        expect(textValidator('test123')).toBeTruthy();
        expect(textValidator('test 123')).toBeTruthy();
        expect(textValidator('test 123 .,:;()@#+/-')).toBeTruthy();
    });
    it('should return false if the string contains other characters', () => {
        expect(textValidator('test 123 .,:;()@#+/-!')).toBeFalsy();
    });
});

describe('rangeValidator', () => {
    it('should return true if the value is within the set range', () => {
        expect(rangeValidator(1, 1)).toBeTruthy();
        expect(rangeValidator(1, 2)).toBeTruthy();
        expect(rangeValidator(1, 3)).toBeTruthy();
        expect(rangeValidator(-1, 1)).toBeTruthy();
        expect(rangeValidator(-1, 2)).toBeTruthy();
        expect(rangeValidator(-1, 3)).toBeTruthy();
    });
    it('should return false if the value is not within the set range', () => {
        expect(rangeValidator(2, 1)).toBeFalsy();
        expect(rangeValidator(3, 2)).toBeFalsy();
        expect(rangeValidator(4, 3)).toBeFalsy();
        expect(rangeValidator(-2, 1)).toBeFalsy();
        expect(rangeValidator(-3, 2)).toBeFalsy();
        expect(rangeValidator(-4, 3)).toBeFalsy();
    });
});

describe('floatingPointValidator', () => {
    it('should return true if the value is a valid floating-point integer', () => {
        expect(floatingPointValidator('1')).toBeTruthy();
        expect(floatingPointValidator('1.2')).toBeTruthy();
    });
    it('should return false if the value is not a valid floating-point integer', () => {
        expect(floatingPointValidator('1.')).toBeFalsy();
        expect(floatingPointValidator('1.2.3')).toBeFalsy();
        expect(floatingPointValidator('1.2.')).toBeFalsy();
        expect(floatingPointValidator('a')).toBeFalsy();
        expect(floatingPointValidator('1a')).toBeFalsy();
        expect(floatingPointValidator('1.a')).toBeFalsy();
    });
});
