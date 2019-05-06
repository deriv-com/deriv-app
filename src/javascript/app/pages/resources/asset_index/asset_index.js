const AssetIndex = (() => {
    let market_columns;

    // Search and Remove (to decrease the next search count)
    const getSymbolInfo = (q_symbol, active_symbols) =>
        active_symbols.filter((sy, id) => {
            if (sy.symbol === q_symbol) {
                active_symbols.splice(id, 1);
                return true;
            }
            return false;
        });

    /*
     * This method generates headers for all tables of each market
     * should include headers existed in all assets of each market and its submarkets
     */
    const getAssetIndexData = (asset_index, active_symbols) => {
        if (!asset_index || !active_symbols) return null;

        market_columns = {};

        // index of items in asset_index response
        const idx = {
            symbol      : 0,
            display_name: 1,
            cells       : 2,
            sym_info    : 3,
            values      : 4,
            cell_props  : {
                cell_name        : 0,
                cell_display_name: 1,
                cell_from        : 2,
                cell_to          : 3,
            },
        };

        for (let i = 0; i < asset_index.length; i++) {
            const asset_item  = asset_index[i];
            const symbol_info = getSymbolInfo(asset_item[idx.symbol], active_symbols)[0];
            if (symbol_info) {
                const market = symbol_info.market;

                asset_item.push(symbol_info);

                // Generate market columns to use in all this market's submarket tables
                if (!(market in market_columns)) {
                    market_columns[market] = {
                        header : [''],
                        columns: [''],
                    };
                }

                const asset_cells = asset_item[idx.cells];
                const values      = {};
                for (let j = 0; j < asset_cells.length; j++) {
                    const col = asset_cells[j][idx.cell_props.cell_display_name];

                    values[col] = [asset_cells[j][idx.cell_props.cell_from], asset_cells[j][idx.cell_props.cell_to]].join(' - ');

                    const market_cols = market_columns[market];
                    if (market_cols.columns.indexOf(col) === -1) {
                        market_cols.header.push(asset_cells[j][idx.cell_props.cell_display_name]);
                        market_cols.columns.push(col);
                    }
                }
                asset_item.push(values);
            }
        }
        return asset_index;
    };

    return {
        getAssetIndexData,
        getMarketColumns: () => market_columns,
    };
})();

module.exports = AssetIndex;
