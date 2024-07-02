import React from 'react';
import { MarketGroup } from 'AppV2/Utils/symbol-categories-utils';
import { Tab, Text, CaptionText } from '@deriv-com/quill-ui';
import MarketCategoryItem from '../MarketCategoryItem';
import { ActiveSymbols } from '@deriv/api-types';
import FavoriteSymbols from '../FavoriteSymbols';

type TMarketCategory = {
    category: MarketGroup;
    selectedSymbol: string;
    setSelectedSymbol: (input: string) => void;
    setIsOpen: (input: boolean) => void;
};

const MarketCategory = ({ category, selectedSymbol, setSelectedSymbol, setIsOpen }: TMarketCategory) => {
    return (
        <React.Fragment>
            <Tab.Panel key={category.market_display_name}>
                {category.market !== 'favorites' ? (
                    Object.entries(category.subgroups).map(([subgroupKey, subgroup]) => (
                        <div key={subgroupKey} className='market-category-content--container'>
                            {subgroupKey !== 'none' && (
                                <div className='market-category-title--container'>
                                    <Text size='sm' className='market-category-title'>
                                        {category.subgroups[subgroupKey].subgroup_display_name}
                                    </Text>
                                </div>
                            )}
                            {Object.entries(subgroup.submarkets).map(([submarketKey, submarket]) => (
                                <div className='market-category-body' key={submarketKey}>
                                    <CaptionText size='sm' className='market-category-subtitle'>
                                        {submarket.submarket_display_name}
                                    </CaptionText>
                                    <div className='market-category-items'>
                                        {submarket.items.map((item: ActiveSymbols[0]) => (
                                            <MarketCategoryItem
                                                item={item}
                                                key={item.display_name}
                                                selectedSymbol={selectedSymbol}
                                                setSelectedSymbol={setSelectedSymbol}
                                                setIsOpen={setIsOpen}
                                            />
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ))
                ) : (
                    <FavoriteSymbols
                        selectedSymbol={selectedSymbol}
                        setSelectedSymbol={setSelectedSymbol}
                        setIsOpen={setIsOpen}
                    />
                )}
            </Tab.Panel>
        </React.Fragment>
    );
};

export default MarketCategory;
