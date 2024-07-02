import useActiveSymbols from 'AppV2/Hooks/useActiveSymbols';
import { ActiveSymbols } from '@deriv/api-types';

type MarketOrderMap = {
    [key: string]: number;
};

export const useGetFavoriteSymbols = () => {
    const { activeSymbols } = useActiveSymbols({});
    const chart_favorites = localStorage.getItem('cq-favorites');
    if (!chart_favorites) return [];

    const client_favorite_markets: string[] = JSON.parse(chart_favorites)['chartTitle&Comparison'];
    const client_favorite_list = client_favorite_markets
        .map(client_fav_symbol => activeSymbols.find(symbol_info => symbol_info.symbol === client_fav_symbol))
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
