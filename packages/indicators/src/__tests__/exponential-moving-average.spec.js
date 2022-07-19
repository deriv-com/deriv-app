import { exponentialMovingAverage, exponentialMovingAverageArray } from '../indicators/exponential-moving-average';

describe('exponentialMovingAverage', () => {
    it('single value with periods of 1 equals the value', () => {
        const result = exponentialMovingAverage([1], { periods: 1 });
        expect(result).toEqual(1);
    });

    it('whole data sample', () => {
        const result = exponentialMovingAverage([1, 2, 3, 4, 5, 6], { periods: 3 });
        expect(result).toEqual(5);
    });

    it('wuut2', () => {
        const data = [1, 2, 3, 4, 5];
        const result = exponentialMovingAverageArray(data, { periods: 3 });
        expect(result).toEqual([2, 3, 4]);
    });

    it('real world', () => {
        const data = [
            22.27, 22.19, 22.08, 22.17, 22.18, 22.13, 22.23, 22.43, 22.24, 22.29, 22.15, 22.39, 22.38, 22.61, 23.36,
            24.05, 23.75, 23.83, 23.95, 23.63, 23.82, 23.87, 23.65, 23.19, 23.1, 23.33, 22.68, 23.1, 22.4, 22.17,
        ];
        const ema10days = [
            22.22, 22.21, 22.24, 22.27, 22.33, 22.52, 22.79, 22.97, 23.13, 23.28, 23.34, 23.43, 23.51, 23.53, 23.47,
            23.4, 23.39, 23.26, 23.23, 23.08, 22.91,
        ];
        const result = exponentialMovingAverageArray(data, { periods: 10 });
        const rounded_result = result.map(x => Math.round(x * 100) / 100);
        expect(rounded_result).toEqual(ema10days);
    });
});
