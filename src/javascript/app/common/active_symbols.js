const isEmptyObject = require('../../_common/utility').isEmptyObject;

const ActiveSymbols = (() => {
    const groupBy = (xs, key) => (
        xs.reduce((rv, x) => {
            (rv[x[key]] = rv[x[key]] || []).push(x);
            return rv;
        }, {})
    );

    const extend = (a, b) => {
        if (!a || !b) return null;
        Object.keys(b).forEach((key) => {
            a[key] = b[key];
        });
        return a;
    };

    const clone = obj => extend({}, obj);

    let markets    = {};
    let submarkets = {};
    let symbols    = {};

    const getMarkets = (all_symbols) => {
        if (!isEmptyObject(markets)) {
            return clone(markets);
        }

        const all_markets = groupBy(all_symbols, 'market');
        Object.keys(all_markets).forEach((key) => {
            const market_name    = key;
            const market_symbols = all_markets[key];
            const symbol         = market_symbols[0];
            markets[market_name] = {
                name     : symbol.market_display_name,
                is_active: !symbol.is_trading_suspended && symbol.exchange_is_open,
            };
            getSubmarketsForMarket(market_symbols, markets[market_name]);
        });
        return clone(markets);
    };

    const clearData = () => {
        markets    = {};
        symbols    = {};
        submarkets = {};
    };

    const getSubmarketsForMarket = (all_symbols, market) => {
        if (!isEmptyObject(market.submarkets)) {
            return clone(market.submarkets);
        }
        market.submarkets = {};

        const all_submarkets = groupBy(all_symbols, 'submarket');

        Object.keys(all_submarkets).forEach((key) => {
            const submarket_name    = key;
            const submarket_symbols = all_submarkets[key];
            const symbol            = submarket_symbols[0];

            market.submarkets[submarket_name] = {
                name     : symbol.submarket_display_name,
                is_active: !symbol.is_trading_suspended && symbol.exchange_is_open,
            };

            getSymbolsForSubmarket(submarket_symbols, market.submarkets[submarket_name]);
        });
        return clone(market.submarkets);
    };

    const getSymbolsForSubmarket = (all_symbols, submarket) => {
        if (isEmptyObject(submarket.symbols)) {
            submarket.symbols = {};
            all_symbols.forEach((symbol) => {
                submarket.symbols[symbol.symbol] = {
                    display    : symbol.display_name,
                    symbol_type: symbol.symbol_type,
                    is_active  : !symbol.is_trading_suspended && symbol.exchange_is_open,
                    pip        : symbol.pip,
                    market     : symbol.market,
                    submarket  : symbol.submarket,
                };
            });
        }
        return clone(submarket.symbols);
    };

    const getSubmarkets = (active_symbols) => {
        if (isEmptyObject(submarkets)) {
            const all_markets = getMarkets(active_symbols);
            Object.keys(all_markets).forEach((key) => {
                const market         = all_markets[key];
                const all_submarkets = getSubmarketsForMarket(active_symbols, market);
                extend(submarkets, all_submarkets);
            });
        }
        return clone(submarkets);
    };

    const getSymbols = (active_symbols) => {
        if (isEmptyObject(symbols)) {
            const all_submarkets = getSubmarkets(active_symbols);
            Object.keys(all_submarkets).forEach((key) => {
                const submarket   = all_submarkets[key];
                const all_symbols = getSymbolsForSubmarket(active_symbols, submarket);
                extend(symbols, all_symbols);
            });
        }
        return clone(symbols);
    };

    const getMarketsList = (active_symbols) => {
        const trade_markets_list = {};
        extend(trade_markets_list, getMarkets(active_symbols));
        extend(trade_markets_list, getSubmarkets(active_symbols));
        return trade_markets_list;
    };

    const getTradeUnderlyings = (active_symbols) => {
        const trade_underlyings = {};
        const all_symbols       = getSymbols(active_symbols);
        Object.keys(all_symbols).forEach((key) => {
            const symbol = all_symbols[key];
            if (!trade_underlyings[symbol.market]) {
                trade_underlyings[symbol.market] = {};
            }
            if (!trade_underlyings[symbol.submarket]) {
                trade_underlyings[symbol.submarket] = {};
            }
            trade_underlyings[symbol.market][key]    = symbol;
            trade_underlyings[symbol.submarket][key] = symbol;
        });
        return trade_underlyings;
    };

    const getSymbolNames = (active_symbols) => {
        const all_symbols = clone(getSymbols(active_symbols));
        Object.keys(all_symbols).forEach((key) => {
            all_symbols[key] = all_symbols[key].display;
        });
        return all_symbols;
    };

    return {
        getMarkets,
        getSubmarkets,
        getMarketsList,
        getTradeUnderlyings,
        getSymbolNames,
        clearData,
        getSymbols,
    };
})();

module.exports = ActiveSymbols;
