import { mean, stddev, sum, takeLast } from '../utils/math';

describe('math', () => {
    it('mean', () => {
        expect(mean([1, 2, 3])).toEqual(2);
        expect(mean([3, 2, 1])).toEqual(2);
    });

    it('stddev', () => {
        expect(stddev([1])).toEqual(0);
        expect(stddev([1, 2, 3])).toBeCloseTo(0.8165);
        expect(stddev([3, 2, 1])).toBeCloseTo(0.8165);

        const data20 = [
            91.8, 92.66, 92.68, 92.3, 92.77, 92.54, 92.95, 93.2, 91.07, 89.83, 89.74, 90.4, 90.74, 88.02, 88.09, 88.84,
            90.78, 90.54, 91.39, 90.65,
        ];
        expect(stddev(data20)).toBeCloseTo(1.55);
    });

    it('sum', () => {
        expect(sum([1, 2, 3])).toEqual(6);
        expect(sum([3, 2, 1])).toEqual(6);
        expect(sum([-10, 10, 0])).toEqual(0);
    });

    it('takeLast', () => {
        expect(takeLast([1], 1)).toEqual([1]);
        expect(takeLast([1, 2, 3], 2)).toEqual([2, 3]);
        expect(takeLast([1, 2, 3], 5)).toEqual([1, 2, 3]);
        expect(takeLast([{ close: 123 }], 1, 'close')).toEqual([123]);
    });

    it('takeField', () => {
        expect(takeLast([{ close: 123 }, { close: 321 }], 2, 'close')).toEqual([123, 321]);
    });
});
