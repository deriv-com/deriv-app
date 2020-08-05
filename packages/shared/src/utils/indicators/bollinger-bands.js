import { stddev, takeLast } from './math';
import { simpleMovingAverage } from './simple-moving-average';
import { sequence } from '../object';

/**
 * @param {Array} data
 * @param {Object} config of type
 * {
 *  periods: number,
 *  field?: 'open' | 'high' | 'low' | 'close',
 *  type: 'SMA' | 'WMA' | 'EMA' | 'TEMA' | 'TRIMA',
 *  std_dev_up: number,
 *  std_dev_down: number,
 *  pip_size: number,
 * }
 */
export const bollingerBands = (data, config) => {
    const { periods = 20, field, std_dev_up = 2, std_dev_down = 2, pip_size = 2 } = config;
    const vals = takeLast(data, periods, field);
    const middle = simpleMovingAverage(vals, { periods });
    const std_dev = stddev(vals);
    const upper = middle + std_dev * std_dev_up;
    const lower = middle - std_dev * std_dev_down;

    return [+middle.toFixed(pip_size), +upper.toFixed(pip_size), +lower.toFixed(pip_size)];
};

/**
 * @param {Array} data
 * @param {Object} config of type
 * {
 *  periods: number,
 *  field?: 'open' | 'high' | 'low' | 'close',
 *  type: 'SMA' | 'WMA' | 'EMA' | 'TEMA' | 'TRIMA',
 *  std_dev_up: number,
 *  std_dev_down: number,
 *  pip_size: number,
 * }
 */
export const bollingerBandsArray = (data, config) => {
    const { periods } = config;
    return sequence(data.length - periods + 1).map((x, i) => bollingerBands(data.slice(i, i + periods), config));
};
