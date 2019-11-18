import ObjectUtils from 'deriv-shared/utils/object';
import { WS }      from 'Services/ws-methods';

const trading_events = {};
export const getTradingEvents = async (date, underlying = null) => {
    if (!date) {
        return [];
    }

    if (!(date in trading_events)) {
        const trading_times_response = await WS.tradingTimes(date);

        if (ObjectUtils.getPropertyValue(trading_times_response, ['trading_times', 'markets'])) {
            for (let i = 0; i < trading_times_response.trading_times.markets.length; i++) {
                const submarkets = trading_times_response.trading_times.markets[i].submarkets;
                if (submarkets) {
                    for (let j = 0; j < submarkets.length; j++) {
                        const symbols = submarkets[j].symbols;
                        if (symbols) {
                            for (let k = 0; k < symbols.length; k++) {
                                const symbol = symbols[k];
                                if (!trading_events[trading_times_response.echo_req.trading_times]) {
                                    trading_events[trading_times_response.echo_req.trading_times] = {};
                                }
                                trading_events[trading_times_response.echo_req.trading_times][symbol.symbol] =
                                    symbol.events;
                            }
                        }
                    }
                }
            }
        }
    }

    return trading_events[date][underlying];
};
