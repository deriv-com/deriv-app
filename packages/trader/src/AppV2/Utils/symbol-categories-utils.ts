export type TProcessedSymbolItem = {
    symbol: string;
    name: string;
    market: string;
    market_display_name: string;
    subgroup: string;
    subgroup_display_name: string;
    submarket: string;
    submarket_display_name: string;
    exchange_is_open: boolean;
    decimal_places: number;
};

/**
 *
 * @param {TProcessedSymbolItem} symbol_object
 * @returns {string} concatenation of market name, market subgroup name (if has a subgroup) & submarket name.
 * E.g.: 'derived-baskets-forex_basket', where 'Derived' is a market, 'Baskets' is a market subgroup,
 * and 'Forex basket' is a submarket.
 */
export const getSymbolMarketCategory = (symbol_object: TProcessedSymbolItem) => {
    const { market_display_name, submarket_display_name, subgroup } = symbol_object || {};
    if (!market_display_name) return '';
    const market = market_display_name.replace(' ', '_');
    const submarket = submarket_display_name.replace(' ', '_');
    if (subgroup && subgroup !== 'none') {
        return `${market}-${subgroup}-${submarket}`.toLowerCase();
    }
    return `${market}-${submarket}`.toLowerCase();
};

export const stringToSlug = (str: string) =>
    str
        .toLowerCase()
        .replace(/[^\w ]+/g, '')
        .replace(/ +/g, '-');
