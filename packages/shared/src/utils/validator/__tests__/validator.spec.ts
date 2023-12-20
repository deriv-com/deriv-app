import { template } from '../validator';

describe('validator', () => {
    describe('.template()', () => {
        it('should return a string where variables in brackets are replaced with respective items from content array', () => {
            expect(template('abc [_1] abc', ['2'])).toBe('abc 2 abc');
            expect(template('[_1] [_2]', ['1', '2'])).toBe('1 2');
            expect(template('[_1] [_1]', ['1'])).toBe('1 1');
        });
        it('should replace variables in brackets with items from content array only once, not twice', () => {
            expect(template('[_1] [_2]', ['[_2]', 'abc'])).toBe('[_2] abc');
            expect(template('[_1] [_2]', ['[_2]', 'abc'])).not.toBe('abc abc');
        });
        it('should replace the 1st variable with provided content if content is a string instead of an array', () => {
            expect(template('[_1]', 'abc')).toBe('abc');
            expect(template('[_1] [_2]', 'abc')).toBe('abc undefined');
        });
        it('should replace the variable in brackets with undefined if content is not provided', () => {
            expect(template('[_1]', '')).toBe('undefined');
        });
    });
    describe('Validator', () => {
        it('addFailure', () => {
            // const validator = new Validator();
            // expect(validator.addFailure()).toBeTruthy();
        });
        it('check', () => {
            // const validator = new Validator();
            // expect(validator.check()).toBeTruthy();
        });
        it('isPassed', () => {
            // const validator = new Validator();
            // expect(validator.isPassed()).toBeTruthy();
        });
        it('getRuleObject', () => {
            // expect(Validator.getRuleObject()).toBeTruthy();
        });
    });
});
