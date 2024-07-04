import React from 'react';
import { Text } from '@deriv-com/quill-ui';
import { Localize } from '@deriv/translations';
import SymbolNotFound from '../SymbolNotFound';
import { useGetSymbolSearchResults } from 'AppV2/Hooks/useGetSymbolSearchResults';
import { observer } from '@deriv/stores';
import MarketCategoryItem from '../MarketCategoryItem';

type TSymbolsSearchResult = {
    searchValue: string;
    setSearchValue: (input: string) => void;
    setIsOpen: (input: boolean) => void;
    setSelectedSymbol: (input: string) => void;
};
const SymbolsSearchResult = observer(({ searchValue, setIsOpen, setSelectedSymbol }: TSymbolsSearchResult) => {
    const searchResults = useGetSymbolSearchResults(searchValue);

    return (
        <div className='symbols-search-result--container'>
            {searchValue === '' && (
                <Text size='sm' color='quill-typography__color--subtle' className='symbols-search-result--suggestion'>
                    <Localize i18n_default_text='Try searching for markets or keywords' />
                </Text>
            )}
            {searchValue !== '' &&
                (searchResults.length > 0 ? (
                    searchResults.map(symbol => (
                        <MarketCategoryItem
                            key={symbol?.display_name}
                            item={symbol}
                            selectedSymbol={''}
                            setSelectedSymbol={setSelectedSymbol}
                            setIsOpen={setIsOpen}
                        />
                    ))
                ) : (
                    <SymbolNotFound searchTerm={searchValue} />
                ))}
        </div>
    );
});

export default SymbolsSearchResult;
