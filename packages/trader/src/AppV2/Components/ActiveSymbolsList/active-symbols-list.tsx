import { ActionSheet, Tab } from '@deriv-com/quill-ui';
import { observer } from '@deriv/stores';
import React, { useState, useEffect, useRef } from 'react';
import SymbolsSearchField from '../SymbolsSearchField';
import MarketCategories from '../MarketCategories';
import useActiveSymbols from 'AppV2/Hooks/useActiveSymbols';
import SymbolSearchResults from '../SymbolSearchResults';
import { useTraderStore } from 'Stores/useTraderStores';

type TActiveSymbolsList = {
    isOpen: boolean;
    setIsOpen: (input: boolean) => void;
};

const ActiveSymbolsList = observer(({ isOpen, setIsOpen }: TActiveSymbolsList) => {
    const { default_symbol } = useActiveSymbols();

    const [isSearching, setIsSearching] = useState(false);
    const [selectedSymbol, setSelectedSymbol] = useState(default_symbol);
    const [searchValue, setSearchValue] = useState('');
    const { setTickData, symbol } = useTraderStore();

    const marketCategoriesRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setSelectedSymbol(symbol ?? default_symbol);
        setTickData(null);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [symbol, default_symbol]);

    return (
        <React.Fragment>
            <ActionSheet.Root isOpen={isOpen} onClose={() => setIsOpen(false)}>
                <ActionSheet.Portal shouldCloseOnDrag fullHeightOnOpen>
                    <SymbolsSearchField
                        marketCategoriesRef={marketCategoriesRef}
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
                        onChangeTab={index => {
                            if (index !== 1) {
                                marketCategoriesRef.current?.scrollTo({ top: 0 });
                            }
                        }}
                    >
                        {isSearching ? (
                            <SymbolSearchResults
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
                                ref={marketCategoriesRef}
                                isOpen={isOpen}
                            />
                        )}
                    </Tab.Container>
                </ActionSheet.Portal>
            </ActionSheet.Root>
        </React.Fragment>
    );
});

export default ActiveSymbolsList;
