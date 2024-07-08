import { getProfitOrLoss } from '../profit-loss';

const STATUS = {
    PROFIT: 'profit',
    LOSS: 'loss',
};

describe('getProfitOrLoss', () => {
    it('should return "profit" when the value is positive', () => {
        expect(getProfitOrLoss('100')).toBe(STATUS.PROFIT);
        expect(getProfitOrLoss('1,000')).toBe(STATUS.PROFIT);
        expect(getProfitOrLoss('10,000')).toBe(STATUS.PROFIT);
        expect(getProfitOrLoss('1,000,000')).toBe(STATUS.PROFIT);
    });
    it('should return "loss" when the value is negative', () => {
        expect(getProfitOrLoss('-100')).toBe(STATUS.LOSS);
        expect(getProfitOrLoss('-1,000')).toBe(STATUS.LOSS);
        expect(getProfitOrLoss('-10,000')).toBe(STATUS.LOSS);
        expect(getProfitOrLoss('-1,000,000')).toBe(STATUS.LOSS);
    });
    it('should return "profit" when the value is zero or an empty string', () => {
        expect(getProfitOrLoss('0')).toBe(STATUS.PROFIT);
        expect(getProfitOrLoss('')).toBe(STATUS.PROFIT);
    });
    it('should handle values with decimal places', () => {
        expect(getProfitOrLoss('10.5')).toBe(STATUS.PROFIT);
        expect(getProfitOrLoss('-5.75')).toBe(STATUS.LOSS);
    });
});
