import { ActionSheet, Tab } from '@deriv-com/quill-ui';
import { observer } from '@deriv/stores';
import React, { useState, useEffect, useRef } from 'react';
import SymbolsSearchField from '../SymbolsSearchField';
import MarketCategories from '../MarketCategories';
import SymbolSearchResults from '../SymbolSearchResults';
import { useTraderStore } from 'Stores/useTraderStores';
import { sendMarketTypeToAnalytics } from '../../../Analytics';
import { useLocalStorageData } from '@deriv/hooks';

type TActiveSymbolsList = {
    isOpen: boolean;
    setIsOpen: (input: boolean) => void;
};

const ActiveSymbolsList = observer(({ isOpen, setIsOpen }: TActiveSymbolsList) => {
    const { setTickData, setDigitStats, symbol, contract_type } = useTraderStore();
    const [isSearching, setIsSearching] = useState(false);
    const [selectedSymbol, setSelectedSymbol] = useState(symbol);
    const [searchValue, setSearchValue] = useState('');
    const [guide_dtrader_v2] = useLocalStorageData<Record<string, boolean>>('guide_dtrader_v2', {
        trade_types_selection: false,
        trade_page: false,
        positions_page: false,
        market_selector: false,
    });

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
                            if (index !== 1 || !guide_dtrader_v2?.market_selector) {
                                marketCategoriesRef.current?.scrollTo({ top: 0 });
                            }
                        }}
                    >
                        {isSearching ? (
                            <SymbolSearchResults
                                searchValue={searchValue}
                                setSearchValue={setSearchValue}
                                setIsOpen={setIsOpen}
                                setSelectedSymbol={(symbol: string) => {
                                    sendMarketTypeToAnalytics(symbol, contract_type);
                                    setSelectedSymbol(symbol);
                                }}
                            />
                        ) : (
                            <MarketCategories
                                selectedSymbol={selectedSymbol}
                                setSelectedSymbol={(symbol: string) => {
                                    sendMarketTypeToAnalytics(symbol, contract_type);
                                    setSelectedSymbol(symbol);
                                }}
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
