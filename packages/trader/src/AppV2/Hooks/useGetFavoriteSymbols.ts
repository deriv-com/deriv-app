import React, { useMemo } from 'react';
import useActiveSymbols from 'AppV2/Hooks/useActiveSymbols';
import { ActiveSymbols } from '@deriv/api-types';
import sortSymbols from 'AppV2/Utils/sort-symbols-utils';
import { useModulesStore } from 'Stores/useModulesStores';

export const useGetFavoriteSymbols = () => {
    const { activeSymbols } = useActiveSymbols();
    const { markets } = useModulesStore();
    const { favoriteSymbols } = markets;

    const clientFavoriteList = useMemo(() => {
        return favoriteSymbols
            ?.map(client_fav_symbol => activeSymbols.find(symbol_info => symbol_info.symbol === client_fav_symbol))
            .filter((symbol_info): symbol_info is ActiveSymbols[0] => symbol_info !== undefined);
    }, [activeSymbols, favoriteSymbols]);

    const sortedFavoriteSymbols = useMemo(() => {
        return sortSymbols(clientFavoriteList);
    }, [clientFavoriteList]);

    return sortedFavoriteSymbols;
};
