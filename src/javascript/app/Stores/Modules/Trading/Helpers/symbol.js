import { LocalStore } from '_common/storage';

export const pickDefaultSymbol = (active_symbols = []) => {
    if (!active_symbols.length) return '';
    return getFavoriteOpenSymbol(active_symbols) || getFirstOpenSymbol(active_symbols);
};

const getFavoriteOpenSymbol = (active_symbols) => {
    const chart_favorites = LocalStore.get('cq-favorites');
    if (!chart_favorites) return undefined;
    const client_favorite_symbols = JSON.parse(chart_favorites)['chartTitle&Comparison'];

    const client_favorite_list = client_favorite_symbols
        .map(client_fav_symbol => active_symbols.find(symbol_info => symbol_info.symbol === client_fav_symbol));
    if (client_favorite_list) {
        const client_first_open_symbol = client_favorite_list.filter(symbol => symbol).find(isSymbolOpen);
        if (client_first_open_symbol) return client_first_open_symbol.symbol;
    }
    return undefined;
};

const getFirstOpenSymbol = (active_symbols) => {
    const firs_open_symbol = active_symbols.filter(symbol_info => /major_pairs|random_index/.test(symbol_info.submarket))
        .find(isSymbolOpen);
    if (firs_open_symbol) return firs_open_symbol.symbol;
    return active_symbols.find(symbol_info => symbol_info.submarket === 'major_pairs').symbol;
};

const isSymbolOpen = (symbol) => (
    symbol.exchange_is_open === 1
);