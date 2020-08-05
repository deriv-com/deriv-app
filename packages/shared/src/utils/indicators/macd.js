import { takeField } from './math';
import { exponentialMovingAverageArray } from './exponential-moving-average';

const paddingLeft = (data, length) => {
    const arr = [];
    arr.length = length - data.length;
    arr.fill(0);
    return [...arr, ...data];
};

/**
 * @param {Array} data
 * @param {Object} config of type
 * {
 *  fast_ema_period: number,
 *  slow_ema_period: number,
 *  signal_ema_period: number
 *  field?: 'open' | 'high' | 'low' | 'close',
 *  pip_size: number,
 * }
 */
export const macdArray = (data, config) => {
    const { field, fast_ema_period = 12, slow_ema_period = 26, signal_ema_period = 9, pip_size = 2 } = config;

    const vals = takeField(data, field);

    const length = vals.length;

    const fast_ema_array = paddingLeft(
        exponentialMovingAverageArray(
            vals,
            { periods: fast_ema_period, pip_size: 20, field }
            // -------------------------- ^ set pip_size to 20 to prevent rounding
        ),
        length
    );
    const slow_ema_array = paddingLeft(
        exponentialMovingAverageArray(vals, { periods: slow_ema_period, pip_size: 20, field }),
        length
    );

    const macd_calc_array = paddingLeft(
        slow_ema_array.map((x, i) => +(fast_ema_array[i] - x).toFixed(pip_size)),
        length
    );

    const signal_ema_array = paddingLeft(
        exponentialMovingAverageArray(macd_calc_array.slice(slow_ema_period - 1), {
            periods: signal_ema_period,
            pip_size: 20,
            field,
        }),
        length
    );

    return macd_calc_array
        .map((x, i) => [+(x - signal_ema_array[i]).toFixed(pip_size), x, +signal_ema_array[i].toFixed(pip_size)])
        .slice(slow_ema_period + signal_ema_period - 2);
};
