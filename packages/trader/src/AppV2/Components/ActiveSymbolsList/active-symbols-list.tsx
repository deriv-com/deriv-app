import { ActionSheet, Tab } from '@deriv-com/quill-ui';
import { observer } from '@deriv/stores';
import React, { useState, useEffect } from 'react';
import SymbolsSearchField from '../SymbolsSearchField';
import MarketCategories from '../MarketCategories';
import useActiveSymbols from 'AppV2/Hooks/useActiveSymbols';
import SymbolsSearchResult from '../SymbolsSearchResult';
import { useTraderStore } from 'Stores/useTraderStores';

type TActiveSymbolsList = {
    isOpen: boolean;
    setIsOpen: (input: boolean) => void;
};

const ActiveSymbolsList = observer(({ isOpen, setIsOpen }: TActiveSymbolsList) => {
    const { default_symbol } = useActiveSymbols({});

    const [isSearching, setIsSearching] = useState(false);
    const [selectedSymbol, setSelectedSymbol] = useState(default_symbol);
    const [searchValue, setSearchValue] = useState('');
    const { symbol } = useTraderStore();

    useEffect(() => {
        setSelectedSymbol(symbol ?? default_symbol);
    }, [symbol, default_symbol]);

    return (
        <React.Fragment>
            <ActionSheet.Root isOpen={isOpen}>
                <ActionSheet.Portal shouldCloseOnDrag fullHeightOnOpen>
                    <SymbolsSearchField
                        searchValue={searchValue}
                        setSearchValue={setSearchValue}
                        isSearching={isSearching}
                        setIsSearching={setIsSearching}
                    />
                    <Tab.Container
                        contentStyle='hug'
                        size='md'
                        className='active-symbols-list__content'
                        selectedTabIndex={1}
                    >
                        {isSearching ? (
                            <SymbolsSearchResult
                                searchValue={searchValue}
                                setSearchValue={setSearchValue}
                                setIsOpen={setIsOpen}
                                setSelectedSymbol={setSelectedSymbol}
                            />
                        ) : (
                            <MarketCategories
                                selectedSymbol={selectedSymbol}
                                setSelectedSymbol={setSelectedSymbol}
                                setIsOpen={setIsOpen}
                            />
                        )}
                    </Tab.Container>
                </ActionSheet.Portal>
            </ActionSheet.Root>
        </React.Fragment>
    );
});

export default ActiveSymbolsList;
