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

export default Interface =>
    class extends Interface {
        getIndicatorsInterface() {
            return {
                sma: (input, periods) => this.decorate(sma, input, { periods }),
                smaa: (input, periods) => this.decorate(smaa, input, { periods }),
                ema: (input, periods) => this.decorate(ema, input, { periods }),
                emaa: (input, periods) => this.decorate(emaa, input, { periods }),
                rsi: (input, periods) => this.decorate(rsi, input, { periods }),
                rsia: (input, periods) => this.decorate(rsia, input, { periods }),
                bb: (input, config, field) => this.decorate(bb, input, config)[field],
                bba: (input, config, field) => this.decorate(bba, input, config).map(r => r[field]),
                macda: (input, config, field) => this.decorate(macda, input, config).map(r => r[field]),
            };
        }

        decorate(f, input, config, ...args) {
            const pipSize = this.tradeEngine.getPipSize();

            return f(input, { pipSize, ...config }, ...args);
        }
    };
