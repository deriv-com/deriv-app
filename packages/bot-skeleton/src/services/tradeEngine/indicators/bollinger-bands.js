import { sequence } from '@deriv/shared';
import { simpleMovingAverage } from './simple-moving-average';
import { stddev, takeLast } from '../utils/math';

/**
 * @param {Array} data
 * @param {Object} config of type
 * {
 *  periods: number,
 *  field?: 'open' | 'high' | 'low' | 'close',
 *  type: 'SMA' | 'WMA' | 'EMA' | 'TEMA' | 'TRIMA',
 *  stdDevUp: number,
 *  stdDevDown: number,
 *  pipSize: number,
 * }
 */
export const bollingerBands = (data, config) => {
    const { periods = 20, field, stdDevUp = 2, stdDevDown = 2, pipSize = 2 } = config;
    const vals = takeLast(data, periods, field);
    const middle = simpleMovingAverage(vals, { periods });
    const std_dev = stddev(vals);
    const upper = middle + std_dev * stdDevUp;
    const lower = middle - std_dev * stdDevDown;

    return [+middle.toFixed(pipSize), +upper.toFixed(pipSize), +lower.toFixed(pipSize)];
};

/**
 * @param {Array} data
 * @param {Object} config of type
 * {
 *  periods: number,
 *  field?: 'open' | 'high' | 'low' | 'close',
 *  type: 'SMA' | 'WMA' | 'EMA' | 'TEMA' | 'TRIMA',
 *  stdDevUp: number,
 *  stdDevDown: number,
 *  pipSize: number,
 * }
 */
export const bollingerBandsArray = (data, config) => {
    const { periods } = config;
    return sequence(data.length - periods + 1).map((x, i) => bollingerBands(data.slice(i, i + periods), config));
};
