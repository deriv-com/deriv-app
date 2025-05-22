export const historyToTicks = history =>
    history.times.map((t, idx) => ({
        epoch: +t,
        quote: +history.prices[idx],
    }));

export const getLast = arr => arr && (arr.length === 0 ? undefined : arr[arr.length - 1]);

export const parseTick = tick => ({
    epoch: +tick.epoch,
    quote: +tick.quote,
});

export const parseOhlc = ohlc => ({
    open: +ohlc.open,
    high: +ohlc.high,
    low: +ohlc.low,
    close: +ohlc.close,
    epoch: +(ohlc.open_time || ohlc.epoch),
});

export const parseCandles = candles => candles.map(t => parseOhlc(t));

export const updateTicks = (ticks, newTick) =>
    getLast(ticks).epoch >= newTick.epoch ? ticks : [...ticks.slice(1), newTick];

export const updateCandles = (candles, ohlc) => {
    const lastCandle = getLast(candles);
    if (
        (lastCandle.open === ohlc.open &&
            lastCandle.high === ohlc.high &&
            lastCandle.low === ohlc.low &&
            lastCandle.close === ohlc.close &&
            lastCandle.epoch === ohlc.epoch) ||
        lastCandle.epoch > ohlc.epoch
    ) {
        return candles;
    }
    const prevCandles = lastCandle.epoch === ohlc.epoch ? candles.slice(0, -1) : candles.slice(1);
    return [...prevCandles, ohlc];
};

export const getType = isCandle => (isCandle ? 'candles' : 'ticks');
