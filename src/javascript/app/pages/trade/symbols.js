const ActiveSymbols = require('../../common/active_symbols');

/*
 * Symbols object parses the active_symbols json that we get from socket.send({active_symbols: 'brief'}
 * and outputs in usable form, it gives markets, underlyings
 *
 *
 * Usage:
 *
 * use `Symbols.details` to populate this object first
 *
 * then use
 *
 * `Symbols.markets` to get markets like Forex, Random etc
 * `Symbols.underlyings` to get underlyings
 *
 */

const Symbols = (() => {
    let trade_markets      = {};
    let trade_markets_list = {};
    let trade_underlyings  = {};
    let names              = {};

    const details = (data) => {
        const all_symbols  = data.active_symbols;
        trade_markets      = ActiveSymbols.getMarkets(all_symbols);
        trade_markets_list = ActiveSymbols.getMarketsList(all_symbols);
        trade_underlyings  = ActiveSymbols.getTradeUnderlyings(all_symbols);
        names              = ActiveSymbols.getSymbolNames(all_symbols);
    };

    return {
        details,
        markets      : list => (list ? trade_markets_list : trade_markets),
        getName      : symbol => names[symbol],
        underlyings  : () => trade_underlyings,
        getAllSymbols: () => names,
    };
})();

module.exports = Symbols;
