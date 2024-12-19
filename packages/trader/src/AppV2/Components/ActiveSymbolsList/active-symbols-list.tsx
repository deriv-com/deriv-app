import { ActionSheet, Tab } from '@deriv-com/quill-ui';
import { observer } from '@deriv/stores';
import React, { useState, useEffect, useRef } from 'react';
import SymbolsSearchField from '../SymbolsSearchField';
import MarketCategories from '../MarketCategories';
import SymbolSearchResults from '../SymbolSearchResults';
import { useTraderStore } from 'Stores/useTraderStores';
import { sendMarketTypeToAnalytics } from '../../../Analytics';
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
    const { guideStates, setGuideState } = useGuideStates();
    const { should_run_market_selector_guide } = guideStates;

    const STEPS = [
        {
            content: <Localize i18n_default_text='Explore available markets here.' />,
            placement: 'top' as Step['placement'],
            target: '.joyride-element',
            title: <Localize i18n_default_text='Select a market' />,
            disableBeacon: true,
            offset: 0,
            spotlightPadding: 4,
        },
    ];

    const [show_guide, setShowGuide] = useState(false);
    const timerRef = useRef<NodeJS.Timeout>();

    useEffect(() => {
        if (should_run_market_selector_guide && isOpen) {
            timerRef.current = setTimeout(() => {
                setShowGuide(true);
            }, 300);
        }

        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
            setShowGuide(false);
        };
    }, [should_run_market_selector_guide, isOpen]);

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
                        should_run={show_guide}
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
