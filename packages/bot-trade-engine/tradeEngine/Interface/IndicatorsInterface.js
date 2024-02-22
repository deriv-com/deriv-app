import {
    simpleMovingAverage as sma,
    simpleMovingAverageArray as smaa,
    bollingerBands as bb,
    bollingerBandsArray as bba,
    exponentialMovingAverage as ema,
    exponentialMovingAverageArray as emaa,
    relativeStrengthIndex as rsi,
    relativeStrengthIndexArray as rsia,
    macdArray as macda,
} from '@deriv/indicators';

const decorate = (f, input, tradeEngine, config, ...args) => {
    const pipSize = tradeEngine.getPipSize();
    return f(input, { pipSize, ...config }, ...args);
};

const getIndicatorsInterface = tradeEngine => {
    return {
        sma: (input, periods) => decorate(sma, input, tradeEngine, { periods }),
        smaa: (input, periods) => decorate(smaa, input, tradeEngine, { periods }),
        ema: (input, periods) => decorate(ema, input, tradeEngine, { periods }),
        emaa: (input, periods) => decorate(emaa, input, tradeEngine, { periods }),
        rsi: (input, periods) => decorate(rsi, input, tradeEngine, { periods }),
        rsia: (input, periods) => decorate(rsia, input, tradeEngine, { periods }),
        bb: (input, config, field) => decorate(bb, input, tradeEngine, config)[field],
        bba: (input, config, field) => decorate(bba, input, tradeEngine, config).map(r => r[field]),
        macda: (input, config, field) => decorate(macda, input, tradeEngine, config).map(r => r[field]),
    };
};

export default getIndicatorsInterface;
