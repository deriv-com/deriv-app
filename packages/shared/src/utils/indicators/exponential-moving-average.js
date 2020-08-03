import { takeField, mean } from './math';

/**
 * @param {Array} data
 * @param {Object} config of type
 * {
 *  periods: number,
 *  field?: 'open' | 'high' | 'low' | 'close',
 *  pipSize: number,
 * }
 * @param {Number} initVal
 */
export const exponentialMovingAverage = (data, config, initVal) => {
    const { periods, field, pipSize = 2 } = config;

    const weightingMultiplier = 2 / (periods + 1);

    const vals = takeField(data, field);

    if (initVal) {
        return (vals[0] - initVal) * weightingMultiplier + initVal;
    }

    if (data.length < periods) {
        throw new Error('Periods longer than data length');
    }

    const meanVal = mean(takeField(data.slice(0, periods), field));

    return +vals
        .slice(periods)
        .reduce((prev, e) => (e - prev) * weightingMultiplier + prev, meanVal)
        .toFixed(pipSize);
};

/**
 * @param {Array} data
 * @param {Object} config of type
 * {
 *  periods: number,
 *  field?: 'open' | 'high' | 'low' | 'close',
 *  pipSize: number,
 * }
 */
export const exponentialMovingAverageArray = (data, config) => {
    const { periods } = config;

    let initVal = exponentialMovingAverage(data.slice(0, periods), config);

    return data
        .slice(periods - 1)
        .map((x, i) => (!i ? initVal : (initVal = exponentialMovingAverage([x], config, initVal))));
};
