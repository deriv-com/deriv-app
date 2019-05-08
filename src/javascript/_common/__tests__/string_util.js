const expect     = require('chai').expect;
const moment     = require('moment');
const StringUtil = require('../string_util');
global.$         = require('jquery');

describe('StringUtil', () => {
    describe('.toTitleCase()', () => {
        it('works as expected', () => {
            expect(StringUtil.toTitleCase('test string')).to.eq('Test String');
        });
        it('doesn\'t give error on empty or undefined string', () => {
            expect(StringUtil.toTitleCase('')).to.eq('');
            expect(StringUtil.toTitleCase(undefined)).to.eq('');
        });
    });

    const readable_date = '22 Jun, 2017';
    const iso_date      = '2017-06-22';
    describe('.toISOFormat()', () => {
        it('works as expected', () => {
            expect(StringUtil.toISOFormat(moment.utc(iso_date))).to.eq(iso_date);
        });
        it('doesn\'t break with non-moment date', () => {
            expect(StringUtil.toISOFormat(iso_date)).to.eq('');
            expect(StringUtil.toISOFormat(undefined)).to.eq('');
        });
    });

    describe('.toReadableFormat()', () => {
        it('works as expected when width more than 770', () => {
            expect(StringUtil.toReadableFormat(moment.utc(iso_date))).to.eq(readable_date);
        });
        window.innerWidth = 600;
        it('works as expected when width less than 770 since mocha doesn\'t have datepicker', () => {
            expect(StringUtil.toReadableFormat(moment.utc(iso_date))).to.eq(readable_date);
        });
        it('doesn\'t break with non-moment date', () => {
            expect(StringUtil.toReadableFormat(iso_date)).to.eq('');
            expect(StringUtil.toReadableFormat(undefined)).to.eq('');
        });
    });

    describe('.padLeft()', () => {
        it('puts 0 in front of single digit when length is 2', () => {
            expect(StringUtil.padLeft(1, 2, 0)).to.eq('01');
        });
        it('doesn\'t put 0 in front of double digit when length is 2', () => {
            expect(StringUtil.padLeft(11, 2, 0)).to.eq('11');
        });
    });

    describe('.compareBigUnsignedInt()', () => {
        it('big int is bigger than small int', () => {
            expect(StringUtil.compareBigUnsignedInt(12312312312312312, 1231231231312310)).to.eq(1);
            expect(StringUtil.compareBigUnsignedInt(2, 0)).to.eq(1);
        });
        it('small int is smaller than big int', () => {
            expect(StringUtil.compareBigUnsignedInt(1231231231312310, 12312312312312312)).to.eq(-1);
            expect(StringUtil.compareBigUnsignedInt(0, 2)).to.eq(-1);
        });
        it('big int is equal to big int', () => {
            expect(StringUtil.compareBigUnsignedInt(12312312312312312, 12312312312312312)).to.eq(0);
            expect(StringUtil.compareBigUnsignedInt(0, 0)).to.eq(0);
        });
        it('handles empty or undefined params', () => {
            expect(StringUtil.compareBigUnsignedInt('')).to.eq('');
            expect(StringUtil.compareBigUnsignedInt(undefined)).to.eq('');
        });
    });

    describe('.numberToString()', () => {
        it('changes int to string', () => {
            expect(StringUtil.numberToString(0)).to.be.a('string').and.to.eq('0');
            expect(StringUtil.numberToString(2)).to.be.a('string').and.to.eq('2');
        });
        it('doesn\'t change other things to string', () => {
            expect(StringUtil.numberToString(undefined)).to.eq(undefined);
        });
    });
});
