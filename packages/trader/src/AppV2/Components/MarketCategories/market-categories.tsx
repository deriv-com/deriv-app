import React, { forwardRef, Ref, useEffect, useRef } from 'react';
import { Tab, useSnackbar } from '@deriv-com/quill-ui';
import useActiveSymbols from 'AppV2/Hooks/useActiveSymbols';
import { categorizeSymbols } from 'AppV2/Utils/symbol-categories-utils';
import MarketCategory from '../MarketCategory';
import MarketCategoryTab from '../MarketCategoryTab/market-category-tab';
import { observer } from '@deriv/stores';

type TMarketCategories = {
    selectedSymbol: string;
    setSelectedSymbol: (input: string) => void;
    setIsOpen: (input: boolean) => void;
    isOpen: boolean;
};

const MarketCategories = observer(({ selectedSymbol, setSelectedSymbol, setIsOpen, isOpen }: TMarketCategories) => {
    const { activeSymbols } = useActiveSymbols();
    const categorizedSymbols = categorizeSymbols(activeSymbols);

    return (
        <React.Fragment>
            <Tab.List>
                {Object.values(categorizedSymbols).map(category => (
                    <MarketCategoryTab key={category.market} category={category} />
                ))}
            </Tab.List>
            <Tab.Content className='market-categories__list' ref={scrollRef}>
                {Object.values(categorizedSymbols).map(category => (
                    <MarketCategory
                        key={category.market}
                        category={category}
                        selectedSymbol={selectedSymbol}
                        setSelectedSymbol={setSelectedSymbol}
                        setIsOpen={setIsOpen}
                        isOpen={isOpen}
                    />
                ))}
            </Tab.Content>
        </React.Fragment>
    );
});

MarketCategories.displayName = 'MarketCategories';

export default MarketCategories;
