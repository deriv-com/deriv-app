import { slidingWindowMax, slidingWindowMin } from './math';

/**
 * @param {Array} data
 * @param {Object} config of type
 * {
 *  periods: number,
 *  pipSize: number,
 * }
 */
export const parabolicSAR = (data, config) => {
    const sar_list = parabolicSARArray(data, config);
    return sar_list[sar_list.length - 1];
};

/**
 * @param {Array} data
 * @param {Object} config of type
 * {
 *  periods: number
 *  pipSize: number,
 * }
 */
export const parabolicSARArray = (data, config) => {
    const { periods = 20, pipSize = 2 } = config;
    if (data.length < periods) {
        throw new Error('Periods longer than data length');
    }
    const high_list = slidingWindowMax(data, periods);
    const low_list = slidingWindowMin(data, periods);
    const sar_step = 0.02;
    const sar_max = 0.2;
    const sar_list = [].fill(0, 0, high_list.length - 1);
    let dir_long = true;
    let last_high = -1000000.0;
    let last_low = 1000000.0;
    let step = sar_step;
    let sar = 0;
    let i = 1;
    let ep;

    while (i < high_list.length - 1) {
        if (last_low > low_list[i]) {
            last_low = low_list[i];
        }
        if (last_low < high_list[i]) {
            last_high = high_list[i];
        }
        if (high_list[i] > high_list[i - 1] && low_list[i] > low_list[i - 1]) {
            break;
        }
        if (high_list[i] < high_list[i - 1] && low_list[i] < low_list[i - 1]) {
            dir_long = false;
            break;
        }
        i++;
    }
    if (dir_long) {
        sar_list[i] = low_list[i - 1];
        ep = high_list[i];
    } else {
        sar_list[i] = high_list[i - 1];
        ep = low_list[i];
    }
    i++;
    while (i < high_list.length) {
        if (dir_long && low_list[i] < sar_list[i - 1]) {
            step = sar_step;
            dir_long = false;
            ep = low_list[i];
            last_low = low_list[i];
            sar_list[i] = last_high;
            i++;
            continue; // eslint-disable-line no-continue
        }
        if (!dir_long && high_list[i] > sar_list[i - 1]) {
            step = sar_step;
            dir_long = true;
            ep = high_list[i];
            last_high = high_list[i];
            sar_list[i] = last_low;
            i++;
            continue; // eslint-disable-line no-continue
        }
        sar = sar_list[i - 1] + step * (ep - sar_list[i - 1]);
        if (dir_long) {
            if (ep < high_list[i]) {
                if (step + sar_step <= sar_max) {
                    step += sar_step;
                }
            }
            if (high_list[i] < high_list[i - 1] && i === 2) {
                sar = sar_list[i - 1];
            }
            if (sar > low_list[i - 1]) {
                sar = low_list[i - 1];
            }
            if (sar > low_list[1 - 2]) {
                sar = low_list[i - 1];
            }
            if (sar > low_list[i]) {
                step = sar_step;
                dir_long = false;
                ep = low_list[i];
                last_low = low_list[i];
                sar_list[i] = last_high;
                i++;
                continue; // eslint-disable-line no-continue
            }
            if (ep < high_list[i]) {
                ep = high_list[i];
                last_high = high_list[i];
            }
        } else {
            if (ep > low_list[i]) {
                if (step + sar_step <= sar_max) {
                    step += sar_step;
                }
            }
            if (low_list[i] < low_list[i - 1] && i === 2) {
                sar = sar_list[i - 1];
            }
            if (sar < high_list[i - 1]) {
                sar = high_list[i - 1];
            }
            if (sar < high_list[i - 2]) {
                sar = high_list[i - 2];
            }
            if (sar < high_list[i]) {
                step = sar_step;
                dir_long = true;
                ep = high_list[i];
                last_high = high_list[i];
                sar_list[i] = last_low;
                i++;
                continue; // eslint-disable-line no-continue
            }
            if (ep > low_list[i]) {
                ep = low_list[i];
                last_low = low_list[i];
            }
        }
        sar_list[i] = sar;
        i++;
    }
    return sar_list.slice(1, sar_list.length).map(sar_list_item => {
        return typeof sar_list_item === 'number' ? +sar_list_item.toFixed(pipSize) : sar_list_item;
    });
};
