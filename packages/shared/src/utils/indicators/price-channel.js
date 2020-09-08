import { slidingWindowMax, slidingWindowMin } from './math';
import { sequence } from '../object';

const calcPriceChannel = (low_list, high_list, periods, pipSize) => {
    const min = Math.min(...low_list.slice(low_list.length - periods, low_list.length));
    const max = Math.max(...high_list.slice(high_list.length - periods, high_list.length));
    return [+min.toFixed(pipSize), +max.toFixed(pipSize)];
};

/**
 * @param {Array} data
 * @param {Object} config of type
 * {
 *  periods: number
 *  pipSize: number,
 * }
 */
export const priceChannel = (data, config) => {
    const { periods = 20, pipSize = 2 } = config;
    const low_list = slidingWindowMin(data, periods);
    const high_list = slidingWindowMax(data, periods);
    return calcPriceChannel(low_list, high_list, periods, pipSize);
};

/**
 * @param {Array} data
 * @param {Object} config of type
 * {
 *  periods: number,
 *  pipSize: number,
 * }
 */
export const priceChannelArray = (data, config) => {
    const { periods = 20, pipSize = 2 } = config;
    const low_list = slidingWindowMin(data, periods);
    const high_list = slidingWindowMax(data, periods);
    return sequence(low_list.length - periods + 1).map((x, i) =>
        calcPriceChannel(low_list.slice(i, i + periods), high_list.slice(i, i + periods), periods, pipSize)
    );
};
