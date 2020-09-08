import { slidingWindowMax, slidingWindowMin } from './math';
import { exponentialMovingAverageArray } from './exponential-moving-average';
import { sequence } from '../object';

/**
 * @param {Array} data
 * @param {Object} config of type
 * {
 *  periods: number,
 *  pipSize: number,
 * }
 */
export const averageTrueRange = (input, config) => {
    const result = averageTrueRangeArray(input, config);
    return result[result.length - 1];
};

/**
 * @param {Array} data
 * @param {Object} config of type
 * {
 *  periods: number,
 *  pipSize: number,
 * }
 */
export const averageTrueRangeArray = (input, config) => {
    const { data, candle } = input;
    const { periods = 20 } = config;
    const high_list = slidingWindowMax(data, periods);
    const low_list = slidingWindowMin(data, periods);
    const close_list = candle.map(item => {
        return isNaN(item) ? (item.close ? item.close : NaN) : item;
    });
    const true_range = sequence(low_list.length - 1).map(
        (x, i) => Math.max(high_list[i + 1], close_list[i]) - Math.min(low_list[i + 1], close_list[i])
    );
    return exponentialMovingAverageArray(true_range, config);
};
