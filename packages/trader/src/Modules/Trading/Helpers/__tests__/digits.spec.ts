import { isDigitTradeType, isDigitContractType } from '../digits';

describe('isDigitTradeType', () => {
    it('should return true if trade type is digit (for e.g. even_odd)', () => {
        expect(isDigitTradeType('even_odd')).toBeTruthy();
    });
    it('should return false if trade type is not digit', () => {
        expect(isDigitTradeType('test_trade_type')).toBeFalsy();
    });
});

describe('isDigitContractType', () => {
    it('should return true if contract type is digit (for e.g. DIGITDIFF)', () => {
        expect(isDigitContractType('DIGITDIFF')).toBeTruthy();
    });
    it('should return false if trade type is not digit', () => {
        expect(isDigitContractType('test_trade_type')).toBeFalsy();
    });
});
