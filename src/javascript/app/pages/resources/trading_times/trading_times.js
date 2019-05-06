const TradingTimes = (() => {
    const getSubmarketInfo = (active_symbols, submarket_display_name) =>
        active_symbols.filter(sy => (sy.submarket_display_name === submarket_display_name));

    const getSymbolInfo = (q_symbol, active_symbols) =>
        active_symbols.filter(sy => (sy.symbol === q_symbol));

    return {
        getSubmarketInfo,
        getSymbolInfo,
    };
})();

module.exports = TradingTimes;
