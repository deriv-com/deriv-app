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
import { getPipSize } from '../trade/Ticks';

const decorate = (f, input, config, ...args) => {
    const pipSize = getPipSize();
    return f(input, { pipSize, ...config }, ...args);
};

const getIndicatorsInterface = () => {
    return {
        sma: (input, periods) => decorate(sma, input, { periods }),
        smaa: (input, periods) => decorate(smaa, input, { periods }),
        ema: (input, periods) => decorate(ema, input, { periods }),
        emaa: (input, periods) => decorate(emaa, input, { periods }),
        rsi: (input, periods) => decorate(rsi, input, { periods }),
        rsia: (input, periods) => decorate(rsia, input, { periods }),
        bb: (input, config, field) => decorate(bb, input, config)[field],
        bba: (input, config, field) => decorate(bba, input, config).map(r => r[field]),
        macda: (input, config, field) => decorate(macda, input, config).map(r => r[field]),
    };
};

export default getIndicatorsInterface;
