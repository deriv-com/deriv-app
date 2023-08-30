import { template } from '../utility';

describe('Utility', () => {
    describe('should return correct template format', () => {
        it('works as expected', () => {
            expect(template('abc [_1] abc', ['2'])).toBe('abc 2 abc');
            expect(template('[_1] [_2]', ['1', '2'])).toBe('1 2');
            expect(template('[_1] [_1]', ['1'])).toBe('1 1');
        });

        it('does not replace twice', () => {
            expect(template('[_1] [_2]', ['[_2]', 'abc'])).toBe('[_2] abc');
        });
    });
});
