import { expectCandle, expectCandles } from '../utils/sanitize';

export const candleField = (candle, field) => expectCandle(candle)[field];

export const candleValues = (ohlc, field) => expectCandles(ohlc).map(o => o[field]);

export const isCandleBlack = candle => expectCandle(candle) && candle.close < candle.open;
