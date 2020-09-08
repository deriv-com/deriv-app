import { slidingWindowMax, slidingWindowMin, mean } from './math';
import { sequence } from '../object';

const calcStochasticOscillator = (
    low_list,
    high_list,
    close_list,
    k_period,
    k_slowing_period,
    d_period,
    type,
    pipSize
) => {
    const close_min_list = [];
    const max_min_list = [];
    const k_list = [];
    const d_list = [];

    sequence(low_list.length - k_period + 1).map((x, i) => {
        const min = Math.min(...low_list.slice(i, i + k_period));
        const max = Math.max(...high_list.slice(i, i + k_period));
        close_min_list[i] = close_list[i + k_period - 1] - min;
        max_min_list[i] = max - min;
    });

    sequence(low_list.length - k_period - k_slowing_period + 2).map((x, i) => {
        k_list[i] = +(
            close_min_list.slice(i, i + k_slowing_period).reduce((a, b) => a + b, 0) /
            max_min_list.slice(i, i + k_slowing_period).reduce((a, b) => a + b, 0)
        ).toFixed(pipSize);
    });

    if (type === 1) {
        sequence(low_list.length - k_period - k_slowing_period - d_period + 3).map((x, i) => {
            d_list[i] = +mean(k_list.slice(i, i + d_period)).toFixed(pipSize);
        });
        return d_list;
    }
    return k_list;
};

/**
 * @param {Array} data
 * @param {Object} config of type
 * {
 *  k_period: number
 *  k_slowing_period: number
 *  d_period: number,
 *  type: number,
 *  pipSize: number,
 * }
 */
export const stochasticOscillator = (input, config) => {
    return stochasticOscillatorArray(input, config)[0];
};

/**
 * @param {Array} data
 * @param {Object} config of type
 * {
 *  k_period: number
 *  k_slowing_period: number
 *  d_period: number,
 *  type: number,
 *  pipSize: number,
 * }
 */
export const stochasticOscillatorArray = (input, config) => {
    const { data, candle } = input;
    const { k_period = 14, k_slowing_period = 10, d_period = 10, type = 0, pipSize = 2 } = config;
    const high_list = slidingWindowMax(data, k_period);
    const low_list = slidingWindowMin(data, k_period);
    const close_list = candle.map(item => {
        return isNaN(item) ? (item.close ? item.close : NaN) : item;
    });
    return calcStochasticOscillator(
        low_list,
        high_list,
        close_list,
        k_period,
        k_slowing_period,
        d_period,
        type,
        pipSize
    );
};
