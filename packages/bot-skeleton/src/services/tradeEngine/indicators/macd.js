import { exponentialMovingAverageArray } from './exponential-moving-average';
import { takeField } from '../utils/math';

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
 *  fastEmaPeriod: number,
 *  slowEmaPeriod: number,
 *  signalEmaPeriod: number
 *  field?: 'open' | 'high' | 'low' | 'close',
 *  pipSize: number,
 * }
 */
export const macdArray = (data, config) => {
    const { field, fastEmaPeriod = 12, slowEmaPeriod = 26, signalEmaPeriod = 9, pipSize = 2 } = config;

    const vals = takeField(data, field);

    const length = vals.length;

    const fast_ema_array = paddingLeft(
        exponentialMovingAverageArray(
            vals,
            { periods: fastEmaPeriod, pipSize: 20, field }
            // -------------------------- ^ set pipSize to 20 to prevent rounding
        ),
        length
    );
    const slow_ema_array = paddingLeft(
        exponentialMovingAverageArray(vals, { periods: slowEmaPeriod, pipSize: 20, field }),
        length
    );

    const macd_calc_array = paddingLeft(
        slow_ema_array.map((x, i) => +(fast_ema_array[i] - x).toFixed(pipSize)),
        length
    );

    const signal_ema_array = paddingLeft(
        exponentialMovingAverageArray(macd_calc_array.slice(slowEmaPeriod - 1), {
            periods: signalEmaPeriod,
            pipSize: 20,
            field,
        }),
        length
    );

    return macd_calc_array
        .map((x, i) => [+(x - signal_ema_array[i]).toFixed(pipSize), x, +signal_ema_array[i].toFixed(pipSize)])
        .slice(slowEmaPeriod + signalEmaPeriod - 2);
};
