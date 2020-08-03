import { sequence } from '../object';
import { stddev, takeLast } from './math';
import simpleMovingAverage from './simple-moving-average';

export const bollingerBands = (data, config) => {
    const { periods = 20, field, stdDevUp = 2, stdDevDown = 2, pipSize = 2 } = config;
    const vals = takeLast(data, periods, field);
    const middle = simpleMovingAverage(vals, { periods });
    const stdDev = stddev(vals);
    const upper = middle + stdDev * stdDevUp;
    const lower = middle - stdDev * stdDevDown;

    return [+middle.toFixed(pipSize), +upper.toFixed(pipSize), +lower.toFixed(pipSize)];
};

export const bollingerBandsArray = (data, config) => {
    const { periods } = config;
    return sequence(data.length - periods + 1).map((x, i) => bollingerBands(data.slice(i, i + periods), config));
};
