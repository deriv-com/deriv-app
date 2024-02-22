/* eslint-disable no-unused-expressions */
import { generateDerivApiInstance } from '../appId';
import TicksService from '../ticks_service';

jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000;

const ticksService = new TicksService(generateDerivApiInstance());

const isTick = t => Number.isInteger(t.epoch) && Number.isFinite(t.quote);

const isOhlc = o =>
    Number.isInteger(o.epoch) &&
    Number.isFinite(o.open) &&
    Number.isFinite(o.high) &&
    Number.isFinite(o.low) &&
    Number.isFinite(o.close);

const isTicksList = l => l.every(t => isTick(t));

const isCandles = l => l.every(o => isOhlc(o));

describe('Ticks Service', () => {
    describe('Monitor ticks', () => {
        const ticks = [];
        beforeAll(done => {
            const callback = ticksList => {
                ticks.push(ticksList);
                if (ticks.length === 3) {
                    ticksService.stopMonitor('R_100', key);
                    done();
                }
            };
            const key = ticksService.monitor({ symbol: 'R_100', callback });
        });
        it('Ticks stream received', () => {
            expect(isTicksList(ticks[0])).toBeTruthy();
        });
    });
    describe('Get ticks', () => {
        let ticks, candles;
        beforeAll(done => {
            ticksService
                .request({ symbol: 'R_25' })
                .then(t => {
                    ticks = t;
                    return ticksService.request({ symbol: 'R_50', granularity: 60 });
                })
                .then(c => {
                    candles = c;
                    done();
                });
        });
        it('ticks list received', () => {
            expect(isTicksList(ticks)).toBeTruthy();
        });
        it('ohlc list received', () => {
            expect(isCandles(candles)).toBeTruthy();
        });
    });
});
