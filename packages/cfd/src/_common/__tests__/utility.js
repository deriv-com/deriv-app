const Utility = require('../utility');

describe('Utility', () => {
    describe('.template()', () => {
        it('works as expected', () => {
            expect(Utility.template('abc [_1] abc', ['2'])).toBe('abc 2 abc');
            expect(Utility.template('[_1] [_2]', ['1', '2'])).toBe('1 2');
            expect(Utility.template('[_1] [_1]', ['1'])).toBe('1 1');
        });

        it('does not replace twice', () => {
            expect(Utility.template('[_1] [_2]', ['[_2]', 'abc'])).toBe('[_2] abc');
        });
    });
});
