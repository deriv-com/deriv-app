import { slidingWindowMax, slidingWindowMin } from './math';
import { sequence } from '../object';

const calcWilliamRIndicator = (low_list, high_list, close_list, period, pipSize) => {
    const list = [];

    sequence(low_list.length - period + 1).map((x, i) => {
        const min = Math.min(...low_list.slice(i, i + period));
        const max = Math.max(...high_list.slice(i, i + period));
        list[i] = +((max - close_list[i + period - 1]) / (max - min)).toFixed(pipSize);
    });

    return list;
};

/**
 * @param {Array} data
 * @param {Object} config of type
 * {
 *  period: number
 *  pipSize: number,
 * }
 */
export const williamRIndicator = (input, config) => {
    return williamRIndicatorArray(input, config)[0];
};

/**
 * @param {Array} data
 * @param {Object} config of type
 * {
 *  period: number
 *  pipSize: number,
 * }
 */
export const williamRIndicatorArray = (input, config) => {
    const { data, candle } = input;
    const { period = 14, pipSize = 2 } = config;
    const high_list = slidingWindowMax(data, period);
    const low_list = slidingWindowMin(data, period);
    const close_list = candle.map(item => {
        return isNaN(item) ? (item.close ? item.close : NaN) : item;
    });
    return calcWilliamRIndicator(low_list, high_list, close_list, period, pipSize);
};
