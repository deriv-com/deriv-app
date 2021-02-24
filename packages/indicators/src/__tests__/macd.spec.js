import { macdArray } from '../indicators/macd';
import { data, histogram, macd, signal } from '../test_utils/macd-data';

describe('macd', () => {
    it('real world', () => {
        const result = macdArray(data, {
            fastEmaPeriod: 12,
            slowEmaPeriod: 26,
            signalEmaPeriod: 9,
        }).slice(-100);
        const expected_histogram = histogram.slice(-100);
        const expected_macd = macd.slice(-100);
        const expected_signal = signal.slice(-100);

        const diff = result.reduce(
            (p2, val, i) =>
                p2 +
                Math.abs(val[0] - expected_histogram[i]) +
                Math.abs(val[1] - expected_macd[i]) +
                Math.abs(val[2] - expected_signal[i]),
            0
        );

        // expect diff to be less than 0.1 for each sample
        expect(parseInt((diff / (3 * 100)) * 10)).toEqual(0);
    });
});
