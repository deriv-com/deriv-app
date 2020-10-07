import { sequence } from '@deriv/shared';
import { sum, takeLast } from '../utils/math';

/**
 * @param {Array} data
 * @param {Object} config of type
 * {
 *  periods: number,
 *  field?: 'open' | 'high' | 'low' | 'close',
 *  pipSize: number,
 * }
 */
export const simpleMovingAverage = (data, config) => {
    const { periods, field } = config;

    if (data.length < periods) {
        throw new Error('Periods longer than data length');
    }

    const vals = takeLast(data, periods, field);

    return sum(vals) / periods;
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
export const simpleMovingAverageArray = (data, config) => {
    const { periods, pipSize = 2 } = config;
    return sequence(data.length - periods + 1).map(
        (x, i) => +simpleMovingAverage(data.slice(i, i + periods), config).toFixed(pipSize)
    );
};
