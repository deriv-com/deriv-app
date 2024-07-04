import useActiveSymbols from 'AppV2/Hooks/useActiveSymbols';
import sortSymbols from 'AppV2/Utils/sort-symbols-utils';

export const useGetSymbolSearchResults = (searchValue: string) => {
    const { activeSymbols } = useActiveSymbols({});
    const searchResults =
        searchValue.trim() === ''
            ? []
            : activeSymbols.filter(symbol => symbol.display_name.toLowerCase().includes(searchValue.toLowerCase()));
    const sortedSearchResults = sortSymbols(searchResults);
    return sortedSearchResults;
};
