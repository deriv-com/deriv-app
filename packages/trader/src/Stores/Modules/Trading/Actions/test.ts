import { TicksStreamResponse } from '@deriv/api-types';
import { WS } from '@deriv/shared';

type TCallback = (data: string) => void;
/* This action does not modify state directlly.
 * The payload will be the callback that get's called for each tick
 */
let cb: TCallback;
const ticksCallback = (response: TicksStreamResponse) => {
    if (
        response.error &&
        typeof response.error === 'object' &&
        'message' in response.error &&
        typeof response.error.message === 'string'
    ) {
        return cb(response.error.message);
    }
    return cb(`${new Date(Number(response.tick?.epoch) * 1000).toUTCString()}: ${response.tick?.quote}`);
};

export const getTicks = function ({ symbol }: { symbol: string }, callback: TCallback) {
    cb = callback;
    WS.forgetAll('ticks').then(() => {
        WS.subscribeTicks(symbol, ticksCallback);
    });
    return {};
};
