export const pickDefaultSymbol = (active_symbols = []) => {
    if (!active_symbols.length) return '';
    return active_symbols.filter(symbol_info => /major_pairs|random_index/.test(symbol_info.submarket))[0].symbol;
};
