const expect = require('chai').expect;
const Utility = require('../utility');

describe('Utility', () => {
    describe('.template()', () => {
        it('works as expected', () => {
            expect(Utility.template('abc [_1] abc', ['2'])).to.eq('abc 2 abc');
            expect(Utility.template('[_1] [_2]', ['1', '2'])).to.eq('1 2');
            expect(Utility.template('[_1] [_1]', ['1'])).to.eq('1 1');
        });

        it('does not replace twice', () => {
            expect(Utility.template('[_1] [_2]', ['[_2]', 'abc'])).to.eq('[_2] abc');
        });
    });
});
