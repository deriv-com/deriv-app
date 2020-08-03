import { sequence } from '../object';
import { sum, takeLast } from './math';

export const simpleMovingAverage = (data, config) => {
    const { periods, field } = config;

    if (data.length < periods) {
        throw new Error('Periods longer than data length');
    }

    const vals = takeLast(data, periods, field);

    return sum(vals) / periods;
};

export const simpleMovingAverageArray = (data, config) => {
    const { periods, pipSize = 2 } = config;
    return sequence(data.length - periods + 1).map(
        (x, i) => +simpleMovingAverage(data.slice(i, i + periods), config).toFixed(pipSize)
    );
};
