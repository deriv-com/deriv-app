import { simpleMovingAverage, simpleMovingAverageArray } from '../indicators/simple-moving-average';

describe('simpleMovingAverage', () => {
    it('single value with periods of 1 equals the value', () => {
        const result = simpleMovingAverage([1], { periods: 1 });
        expect(result).toEqual(1);
    });

    it('whole data sample', () => {
        const result = simpleMovingAverage([1, 2, 3], { periods: 3 });
        expect(result).toEqual(2);
    });

    it('fractions', () => {
        const data = [28.93, 28.48, 28.44, 28.91, 28.48];
        const result = simpleMovingAverage(data, { periods: 5 });
        expect(result).toBeCloseTo(28.65);
    });

    it('throws if periods is longer than data length', () => {
        expect(() => simpleMovingAverage([1, 2, 3], { periods: 5 })).toThrow();
    });

    it('part of whole', () => {
        const result = simpleMovingAverage([1, 2, 3, 4, 5], { periods: 3 });
        expect(result).toEqual(4);
    });

    it.skip('longer stuff', () => {
        const result = simpleMovingAverage([11, 12, 13, 14, 15, 16, 17], { periods: 5 });
        expect(result).toEqual([13, 14, 15]);
    });

    it('can extract field', () => {
        const data = [{ close: 1 }, { close: 2 }, { close: 3 }];
        const result = simpleMovingAverage(data, { periods: 3, field: 'close' });
        expect(result).toEqual(2);
    });

    it('complicated', () => {
        const data = [1, 10, 100, 1000, 10000];
        const result = simpleMovingAverageArray(data, { periods: 3 });
        expect(result).toEqual([37, 370, 3700]);
    });

    it('real world', () => {
        const data = [
            22.27, 22.19, 22.08, 22.17, 22.18, 22.13, 22.23, 22.43, 22.24, 22.29, 22.15, 22.39, 22.38, 22.61, 23.36,
            24.05, 23.75, 23.83, 23.95, 23.63, 23.82, 23.87, 23.65, 23.19, 23.1, 23.33, 22.68, 23.1, 22.4, 22.17,
        ];
        const sma10days = [
            22.22, 22.21, 22.23, 22.26, 22.3, 22.42, 22.61, 22.77, 22.91, 23.08, 23.21, 23.38, 23.52, 23.65, 23.71,
            23.68, 23.61, 23.51, 23.43, 23.28, 23.13,
        ];
        const result = simpleMovingAverageArray(data, { periods: 10 });
        const rounded_result = result.map(x => Math.round(x * 100) / 100);
        expect(rounded_result).toEqual(sma10days);
    });
});
