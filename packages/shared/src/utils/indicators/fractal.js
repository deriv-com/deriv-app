import { slidingWindowMax, slidingWindowMin } from './math';
import { sequence } from '../object';

const calcFractal = (low_list, high_list, pipSize) => {
    const n = low_list.length,
        low_ref = low_list[n - 3],
        high_ref = high_list[n - 3];
    let result_low = null,
        result_high = null;

    if (
        low_ref < low_list[n - 2] &&
        low_ref < low_list[n - 1] &&
        low_ref <= low_list[n - 4] &&
        low_ref <= low_list[n - 5]
    ) {
        result_low = low_ref;
    } else {
        result_low = null;
    }

    if (
        high_ref > high_list[n - 2] &&
        high_ref > high_list[n - 1] &&
        high_ref >= high_list[n - 4] &&
        high_ref >= high_list[n - 5]
    ) {
        result_high = high_ref;
    } else {
        result_high = null;
    }
    return [
        result_low ? +result_low.toFixed(pipSize) : result_low,
        result_high ? +result_high.toFixed(pipSize) : result_high,
    ];
};

/**
 * @param {Array} data
 * @param {Object} config of type
 * {
 *  periods: number,
 *  pipSize: number,
 * }
 */
export const fractal = (data, config) => {
    const { periods = 20, pipSize = 2 } = config;
    if (data.length < periods) {
        throw new Error('Periods longer than data length');
    }
    const low_list = slidingWindowMin(data, periods);
    const high_list = slidingWindowMax(data, periods);
    return calcFractal(low_list, high_list, pipSize);
};

/**
 * @param {Array} data
 * @param {Object} config of type
 * {
 *  periods: number,
 *  pipSize: number,
 * }
 */
export const fractalArray = (data, config) => {
    const { periods = 20, pipSize = 2 } = config;
    if (data.length < periods) {
        throw new Error('Periods longer than data length');
    }
    const low_list = slidingWindowMin(data, periods);
    const high_list = slidingWindowMax(data, periods);
    return sequence(low_list.length - 4).map((x, i) =>
        calcFractal(low_list.slice(i, i + 5), high_list.slice(i, i + 5), pipSize)
    );
};
