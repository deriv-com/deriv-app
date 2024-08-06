import React, { useMemo } from 'react';
import useActiveSymbols from 'AppV2/Hooks/useActiveSymbols';
import sortSymbols from 'AppV2/Utils/sort-symbols-utils';

export const useGetSymbolSearchResults = (searchValue: string) => {
    const { activeSymbols } = useActiveSymbols();

    const searchResults = useMemo(() => {
        if (searchValue.trim() === '') return [];
        return activeSymbols.filter(symbol => symbol.display_name.toLowerCase().includes(searchValue.toLowerCase()));
    }, [searchValue, activeSymbols]);

    const sortedSearchResults = useMemo(() => {
        return sortSymbols(searchResults);
    }, [searchResults]);

    return sortedSearchResults;
};
