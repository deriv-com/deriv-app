import { expect } from 'chai';
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
import { runAndGetResult } from '../tools';

const periods = 12;

const bbOption = {
    periods,
    stdDevUp: 5,
    stdDevDown: 5,
};

const macdOption = {
    fastEmaPeriod: 12,
    slowEmaPeriod: 26,
    signalEmaPeriod: 9,
};

const getIndicatorsFromApi = () =>
    runAndGetResult(
        undefined,
        `
    watch('before');
    var ticks = Bot.getTicks();
    result.ticks = ticks
    result.rsi = Bot.rsi(ticks, ${periods})
    result.rsia = Bot.rsia(ticks, ${periods})
    result.bb = Bot.bb(ticks, ${JSON.stringify(bbOption)}, 1)
    result.bba = Bot.bba(ticks, ${JSON.stringify(bbOption)}, 2)
    result.ema = Bot.ema(ticks, ${periods})
    result.emaa = Bot.emaa(ticks, ${periods})
    result.macda = Bot.macda(ticks, ${JSON.stringify(macdOption)}, 0)
    result.sma = Bot.sma(ticks, ${periods})
    result.smaa = Bot.smaa(ticks, ${periods})
  `
    );

describe('Relative Strength Index', () => {
    let result, expected;

    beforeAll(done =>
        getIndicatorsFromApi().then(r => {
            result = r;
            const { ticks } = result;

            expected = {
                sma: sma(ticks, { periods }),
                smaa: smaa(ticks, { periods }),
                bb: bb(ticks, bbOption)[1],
                bba: bba(ticks, bbOption).map(e => e[2]),
                ema: ema(ticks, { periods }),
                emaa: emaa(ticks, { periods }),
                rsi: rsi(ticks, { periods }),
                rsia: rsia(ticks, { periods }),
                macda: macda(ticks, macdOption).map(e => e[0]),
            };

            done();
        })
    );

    it('Indicator values are set correctly', () => {
        Object.keys(expected).forEach(name => {
            const endResult = JSON.parse(JSON.stringify(result[name]));
            const expectedResult = JSON.parse(JSON.stringify(expected[name]));
            expect(endResult).to.deep.equal(expectedResult);
        });
    });
});
