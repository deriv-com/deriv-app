import { localize } from '@deriv/translations';
import { createError } from '../../../utils/error';

const isPositiveNumber = num => Number.isFinite(num) && num > 0;

const isPositiveInteger = num => isPositiveNumber(num) && Number.isInteger(num);

export const expectPositiveInteger = (num, msg) => {
    if (!isPositiveInteger(num)) {
        throw createError('PositiveIntegerExpected', msg);
    }
    return num;
};

const expectOptions = options => {
    const { symbol, contractTypes } = options;

    if (!symbol) {
        throw createError('OptionError', localize('Underlying market is not selected'));
    }

    if (!contractTypes[0]) {
        throw createError('OptionError', localize('Contract type is not selected'));
    }
};

export const expectInitArg = args => {
    const [token, options] = args;

    if (!token) {
        throw createError('LoginError', localize('Please login'));
    }

    expectOptions(options);

    return args;
};

const isCandle = candle =>
    candle instanceof Object &&
    ['open', 'high', 'low', 'close'].every(key => isPositiveNumber(candle[key])) &&
    isPositiveInteger(candle.epoch);

export const expectCandle = candle => {
    if (!isCandle(candle)) {
        throw createError('CandleExpected', localize('Given candle is not valid'));
    }
    return candle;
};

export const expectCandles = candles => {
    if (!(candles instanceof Array) || !candles.every(c => isCandle(c))) {
        throw createError('CandleListExpected', localize('Given candle list is not valid'));
    }
    return candles;
};
