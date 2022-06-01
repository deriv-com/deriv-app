export const isMarketClosed = (active_symbols = [], symbol) => {
    if (!active_symbols.length) return false;
    return active_symbols.filter(x => x.symbol === symbol)[0]
        ? !active_symbols.filter(symbol_info => symbol_info.symbol === symbol)[0].exchange_is_open
        : false;
};

export const getSymbolDisplayName = (active_symbols = [], symbol) =>
    (
        active_symbols.find(symbol_info => symbol_info.symbol.toUpperCase() === symbol.toUpperCase()) || {
            display_name: '',
        }
    ).display_name;
