import useActiveSymbols from 'AppV2/Hooks/useActiveSymbols';
import { ActiveSymbols } from '@deriv/api-types';
import { useTraderStore } from 'Stores/useTraderStores';
import sortSymbols from 'AppV2/Utils/sort-symbols-utils';

export const useGetFavoriteSymbols = () => {
    const { activeSymbols } = useActiveSymbols({});
    const { favoriteSymbols } = useTraderStore();

    const clientFavoriteList = favoriteSymbols
        ?.map(client_fav_symbol => activeSymbols.find(symbol_info => symbol_info.symbol === client_fav_symbol))
        .filter((symbol_info): symbol_info is ActiveSymbols[0] => symbol_info !== undefined);

    const sortedFavoriteSymbols = sortSymbols(clientFavoriteList);

    return sortedFavoriteSymbols;
};
