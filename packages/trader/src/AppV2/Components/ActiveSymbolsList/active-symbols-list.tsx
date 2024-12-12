import { ActionSheet, Tab } from '@deriv-com/quill-ui';
import { observer } from '@deriv/stores';
import React, { useState, useEffect, useRef } from 'react';
import SymbolsSearchField from '../SymbolsSearchField';
import MarketCategories from '../MarketCategories';
import SymbolSearchResults from '../SymbolSearchResults';
import { useTraderStore } from 'Stores/useTraderStores';
import { sendMarketTypeToAnalytics } from '../../../Analytics';
import { useLocalStorageData } from '@deriv/hooks';
import GuideContainer from '../OnboardingGuide/GuideForPages/guide-container';
import { Localize } from '@deriv/translations';
import useGuideStates from 'AppV2/Hooks/useGuideStates';
import { Step } from 'react-joyride';

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
        trade_param_quick_adjustment: false,
    });
    const { guideStates, setGuideState } = useGuideStates();
    const { should_run_market_selector_guide } = guideStates;

    const STEPS = [
        {
            content: <Localize i18n_default_text='Explore available markets here.' />,
            offset: -200,
            placement: 'bottom' as Step['placement'],
            spotlightPadding: 8,
            target: '.joyride-element',
            title: <Localize i18n_default_text='Select a market' />,
            disableBeacon: true,
        },
    ];

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
                    <GuideContainer
                        should_run={should_run_market_selector_guide && !guide_dtrader_v2?.market_selector}
                        steps={STEPS}
                        callback={() => setGuideState('should_run_market_selector_guide', false)}
                    />
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
