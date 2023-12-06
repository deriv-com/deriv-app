import { CONTRACT_TYPES, TRADE_TYPES } from '@deriv/shared';
import { isDigitTradeType, isDigitContractType } from '../digits';

describe('isDigitTradeType', () => {
    it('should return true if trade type is digit (for e.g. TRADE_TYPES.EVEN_ODD)', () => {
        expect(isDigitTradeType(TRADE_TYPES.EVEN_ODD)).toBeTruthy();
    });
    it('should return false if trade type is not digit', () => {
        expect(isDigitTradeType('test_trade_type')).toBeFalsy();
    });
    it('should return false if trade type is undefined', () => {
        expect(isDigitTradeType()).toBeFalsy();
    });
});

describe('isDigitContractType', () => {
    it('should return true if contract type is digit (for e.g. CONTRACT_TYPES.MATCH_DIFF.DIFF)', () => {
        expect(isDigitContractType(CONTRACT_TYPES.MATCH_DIFF.DIFF)).toBeTruthy();
    });
    it('should return false if trade type is not digit', () => {
        expect(isDigitContractType('test_trade_type')).toBeFalsy();
    });
});
