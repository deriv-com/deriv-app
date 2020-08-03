import { macdArray } from '../macd';
import { data, histogram, macd, signal } from '../../../test_utils/macd-data';

describe('macd', () => {
    it('real world', () => {
        const result = macdArray(data, {
            fastEmaPeriod: 12,
            slowEmaPeriod: 26,
            signalSmaPeriod: 9,
        }).slice(-100);
        const expectedHistogram = histogram.slice(-100);
        const expectedMacd = macd.slice(-100);
        const expectedSignal = signal.slice(-100);

        const diff = result.reduce(
            (p2, val, i) =>
                p2 +
                Math.abs(val[0] - expectedHistogram[i]) +
                Math.abs(val[1] - expectedMacd[i]) +
                Math.abs(val[2] - expectedSignal[i]),
            0
        );

        // expect diff to be less than 0.1 for each sample
        expect(parseInt((diff / (3 * 100)) * 10, 10)).toEqual(0);
    });
});
