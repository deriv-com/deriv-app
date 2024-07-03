import useActiveSymbols from 'AppV2/Hooks/useActiveSymbols';
import { ActiveSymbols } from '@deriv/api-types';
import { useTraderStore } from 'Stores/useTraderStores';

type MarketOrderMap = {
    [key: string]: number;
};

export const useGetFavoriteSymbols = () => {
    const { activeSymbols } = useActiveSymbols({});
    const { favoriteSymbols } = useTraderStore();

    const client_favorite_list = favoriteSymbols
        ?.map(client_fav_symbol => activeSymbols.find(symbol_info => symbol_info.symbol === client_fav_symbol))
        .filter((symbol_info): symbol_info is ActiveSymbols[0] => symbol_info !== undefined);

    const market_sorting_order = ['synthetic_index', 'forex', 'indices', 'cryptocurrency', 'commodities'];

    const marketOrderMap: MarketOrderMap = market_sorting_order.reduce(
        (acc: MarketOrderMap, market: string, index: number) => {
            acc[market] = index;
            return acc;
        },
        {}
    );

    const sorted_favorite_list = client_favorite_list.sort((a, b) => {
        const marketOrderA =
            marketOrderMap[a.market] !== undefined ? marketOrderMap[a.market] : client_favorite_list.length;
        const marketOrderB =
            marketOrderMap[b.market] !== undefined ? marketOrderMap[b.market] : client_favorite_list.length;
        if (marketOrderA !== marketOrderB) {
            return marketOrderA - marketOrderB;
        }
        return a.submarket_display_name.localeCompare(b.submarket_display_name);
    });

    return sorted_favorite_list;
};
