import { relativeStrengthIndex, relativeStrengthIndexArray } from '../indicators/relative-strength-index';

describe('relativeStrengthIndex', () => {
    it('data length equal to periods is equal to 0', () => {
        const result = relativeStrengthIndex([4, 5, 1], { periods: 3 });
        expect(result).toEqual(0);
    });

    it('ascending data (all wins) is equal to 0', () => {
        const result = relativeStrengthIndex([1, 3, 3.5, 4, 6.7, 8], { periods: 3 });
        expect(result).toEqual(100);
    });

    it('descending data (all losses) is equal to 100', () => {
        const result = relativeStrengthIndex([10, 8.8, 4.3, 3.11, 3.1, 3], { periods: 3 });
        expect(result).toEqual(0);
    });

    it('real world', () => {
        const data = [
            44.34, 44.09, 44.15, 43.61, 44.33, 44.83, 45.1, 45.42, 45.84, 46.08, 45.89, 46.03, 45.61, 46.28, 46.28,
            46.0, 46.03, 46.41, 46.22, 45.64, 46.21, 46.25, 45.71, 46.45, 45.78, 45.35, 44.03, 44.18, 44.22, 44.57,
            43.42, 42.66, 43.13,
        ];
        const result = relativeStrengthIndexArray(data, { periods: 14 });
        expect(result).toEqual([
            70.46, 66.25, 66.48, 69.35, 66.29, 57.92, 62.88, 63.21, 56.01, 62.34, 54.67, 50.39, 40.02, 41.49, 41.9,
            45.5, 37.32, 33.09, 37.79,
        ]);
    });
});
