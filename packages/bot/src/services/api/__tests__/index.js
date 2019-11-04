/* eslint-disable no-unused-expressions */
import { expect }                  from 'chai';
import _Symbol                     from '../symbolApi';
import { generateLiveApiInstance } from '../appId';

describe('symbol', () => {
    const api = generateLiveApiInstance();
    describe('Checking functions', () => {
        let symbol;
        // eslint-disable-next-line prefer-arrow-callback
        beforeAll(function(done) {
            symbol = new _Symbol(api);
            symbol.initPromise.then(() => {
                done();
            });
        });
        it('getAllowedCategoryNames returns allowed category names', () => {
            expect(symbol.getAllowedCategoryNames('r_100')).to.be.ok.and.to.have.all.members([
                'Up/Down',
                'Touch/No Touch',
                'In/Out',
                'Asians',
                'Digits',
                'Reset Call/Reset Put',
                'Call Spread/Put Spread',
                'High/Low Ticks',
                'Only Ups/Only Downs',
            ]);

            expect(symbol.getAllowedCategoryNames('FAKE')).to.be.empty;
        });
        it('getCategoryNameForCondition returns category name of a condition', () => {
            expect(symbol.getCategoryNameForCondition('callput')).to.be.equal('Up/Down');
        });
        it('getConditionName returns name of a condition', () => {
            expect(symbol.getConditionName('callput')).to.be.equal('Rise/Fall');
        });
        it('isConditionAllowedInSymbol returns true if a condition is allowed in a symbol', () => {
            expect(symbol.isConditionAllowedInSymbol('r_100', 'callput')).to.be.ok;
            expect(symbol.isConditionAllowedInSymbol('frxeurusd', 'asians')).not.to.be.ok;
            expect(symbol.isConditionAllowedInSymbol('fake', 'asians')).not.to.be.ok;
            expect(symbol.isConditionAllowedInSymbol('frxeurusd', 'fake')).not.to.be.ok;
        });
    });
});
