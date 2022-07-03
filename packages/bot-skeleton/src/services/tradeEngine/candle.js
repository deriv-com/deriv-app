import { localize } from '@deriv/translations';
import { createError, isPositiveNumber, isPositiveInteger } from './utils';

const isCandle = candle =>
    candle instanceof Object &&
    ['open', 'high', 'low', 'close'].every(key => isPositiveNumber(candle[key])) &&
    isPositiveInteger(candle.epoch);

const expectCandle = candle => {
    if (!isCandle(candle)) {
        throw createError('CandleExpected', localize('Given candle is not valid'));
    }
    return candle;
};

const expectCandles = candles => {
    if (!(candles instanceof Array) || !candles.every(c => isCandle(c))) {
        throw createError('CandleListExpected', localize('Given candle list is not valid'));
    }
    return candles;
};

export const candleField = (candle, field) => expectCandle(candle)[field];

export const candleValues = (ohlc, field) => expectCandles(ohlc).map(o => o[field]);

export const isCandleBlack = candle => expectCandle(candle) && candle.close < candle.open;
