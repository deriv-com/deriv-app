import { ActionSheet, Tab, Text } from '@deriv-com/quill-ui';
import { observer } from '@deriv/stores';
import React, { useState, useEffect } from 'react';
import SymbolsSearchField from '../SymbolsSearchField';
import { Localize } from '@deriv/translations';
import MarketCategories from '../MarketCategories';
import SymbolNotFound from '../SymbolNotFound';
import clsx from 'clsx';
import useActiveSymbols from 'AppV2/Hooks/useActiveSymbols';

const MarketSelector = observer(() => {
    const { default_symbol } = useActiveSymbols({});

    const [isOpen, setIsOpen] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const notFound = true;
    const [selectedSymbol, setSelectedSymbol] = useState(default_symbol);

    useEffect(() => {
        setSelectedSymbol(default_symbol);
    }, [default_symbol]);

    return (
        <React.Fragment>
            <button onClick={() => setIsOpen(!isOpen)}>button</button>
            <ActionSheet.Root isOpen={isOpen}>
                <ActionSheet.Portal shouldCloseOnDrag>
                    <SymbolsSearchField isSearching={isSearching} setIsSearching={setIsSearching} />
                    <Tab.Container
                        contentStyle='hug'
                        size='md'
                        className={clsx('market-selector__content', {
                            // 'market-selector__content--not-found': notFound,
                        })}
                        selectedTabIndex={1}
                    >
                        {isSearching ? (
                            <Text
                                size='sm'
                                color='quill-typography__color--subtle'
                                className='symbols__search--suggestion'
                            >
                                <Localize i18n_default_text='Try searching for markets or keywords' />
                            </Text>
                        ) : (
                            // <SymbolNotFound searchTerm='yello' />
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

export default MarketSelector;
