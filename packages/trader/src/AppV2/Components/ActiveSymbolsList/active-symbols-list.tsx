import { ActionSheet, Tab } from '@deriv-com/quill-ui';
import { observer } from '@deriv/stores';
import React, { useState, useEffect, useRef } from 'react';
import SymbolsSearchField from '../SymbolsSearchField';
import MarketCategories from '../MarketCategories';
import SymbolSearchResults from '../SymbolSearchResults';
import { useTraderStore } from 'Stores/useTraderStores';

type TActiveSymbolsList = {
    isOpen: boolean;
    setIsOpen: (input: boolean) => void;
};

const ActiveSymbolsList = observer(({ isOpen, setIsOpen }: TActiveSymbolsList) => {
    const { setTickData, setDigitStats, symbol } = useTraderStore();
    const [isSearching, setIsSearching] = useState(false);
    const [selectedSymbol, setSelectedSymbol] = useState(symbol);
    const [searchValue, setSearchValue] = useState('');

    const marketCategoriesRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setSelectedSymbol(symbol);
        setTickData(null);
        setDigitStats([]);
    }, [setDigitStats, setTickData, symbol]);

    return (
        <React.Fragment>
            <ActionSheet.Root isOpen={isOpen} onClose={() => setIsOpen(false)}>
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
                                isOpen={isOpen}
                                marketCategoriesRef={marketCategoriesRef}
                            />
                        )}
                    </Tab.Container>
                </ActionSheet.Portal>
            </ActionSheet.Root>
        </React.Fragment>
    );
});

export default ActiveSymbolsList;
