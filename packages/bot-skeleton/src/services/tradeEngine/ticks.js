import { getLast } from 'binary-utils';
import { checkProposalReady } from './proposal';
import Store, { constants, $scope, Services } from './state';
import { isPositiveInteger, createError } from './utils';
import api from '../api/ws';
import TicksService from '../api/ticks_service';

let tickListenerKey;
const ticksService = new TicksService(api);

const expectPositiveInteger = (num, msg) => {
    if (!isPositiveInteger(num)) {
        throw createError('PositiveIntegerExpected', msg);
    }
    return num;
};

export const checkDirection = dir => {
    return new Promise(resolve =>
        ticksService.request({ symbol: $scope.symbol }).then(ticks => resolve(getDirection(ticks) === dir))
    );
};

export const getDirection = ticks => {
    const { length } = ticks;
    const [tickOld, tickNew] = ticks.slice(-2);

    let direction = '';
    if (length >= 2) {
        direction = tickOld.quote < tickNew.quote ? 'rise' : direction;
        direction = tickOld.quote > tickNew.quote ? 'fall' : direction;
    }

    return direction;
};

export const getLastDigit = () => {
    return new Promise(resolve => getLastTick(false, true).then(tick => resolve(getLastDigitHelpers(tick))));
};

export const getLastDigitHelpers = tick => {
    let number_string = tick;
    if (typeof number_string === 'number') {
        number_string = String(number_string);
    }
    return Number(number_string[number_string.length - 1]);
};

export const getLastDigitList = () => {
    return new Promise(resolve => getTicks().then(ticks => resolve(getLastDigitsFromList(ticks))));
};

export const getLastDigitsFromList = ticks => {
    const digits = ticks.map(tick => {
        return getLastDigitHelpers(tick.toFixed(getPipSize()));
    });
    return digits;
};

export const getLastTick = (raw, toString = false) => {
    return new Promise(resolve =>
        ticksService
            .request({ symbol: $scope.symbol })
            .then(ticks => {
                let last_tick = raw ? getLast(ticks) : getLast(ticks).quote;
                if (!raw && toString) {
                    last_tick = last_tick.toFixed(getPipSize());
                }
                resolve(last_tick);
            })
            .catch(e => {
                if (e.code === 'MarketIsClosed') {
                    Services.observer.emit('Error', e);
                    resolve(e.code);
                }
            })
    );
};

export const getOhlc = args => {
    const { granularity = $scope.options.candleInterval || 60, field } = args || {};

    return new Promise(resolve =>
        ticksService
            .request({ symbol: $scope.symbol, granularity })
            .then(ohlc => resolve(field ? ohlc.map(o => o[field]) : ohlc))
    );
};

export const getOhlcFromEnd = args => {
    const { index: i = 1 } = args || {};

    const index = expectPositiveInteger(Number(i), Services.localize('Index must be a positive integer'));

    return new Promise(resolve => getOhlc(args).then(ohlc => resolve(ohlc.slice(-index)[0])));
};

export const getPipSize = () => {
    return ticksService.pipSizes[$scope.symbol];
};

export const getTicks = (toString = false) => {
    return new Promise(resolve => {
        ticksService.request({ symbol: $scope.symbol }).then(ticks => {
            const ticks_list = ticks.map(tick => {
                if (toString) {
                    return tick.quote.toFixed(getPipSize());
                }
                return tick.quote;
            });

            resolve(ticks_list);
        });
    });
};

export const watchTicks = symbol => {
    if (symbol && $scope.symbol !== symbol) {
        ticksService.stopMonitor({
            symbol,
            key: tickListenerKey,
        });

        const callback = ticks => {
            checkProposalReady();
            const lastTick = ticks.slice(-1)[0];
            const { epoch } = lastTick;
            Store.dispatch({ type: constants.NEW_TICK, payload: epoch });
        };

        const key = ticksService.monitor({ symbol, callback });

        $scope.symbol = symbol;

        tickListenerKey = key;
    }
};

export const getLastDigitBinaryUtils = (value, pips) => {
    return +value.toFixed(pips).slice(-1);
};
