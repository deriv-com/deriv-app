import React from 'react';
import { MarketGroup } from 'AppV2/Utils/symbol-categories-utils';
import { Tab, Text, CaptionText } from '@deriv-com/quill-ui';

type TMarketCategory = {
    category: MarketGroup;
};

const MarketCategory = ({ category }: TMarketCategory) => {
    return (
        <Tab.Panel key={category.market_display_name}>
            {Object.entries(category.subgroups).map(([subgroupKey, subgroup]) => {
                return (
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
                                    {submarket.items.map(item => (
                                        <div key={item.display_name} className='market-category-item'>
                                            <Text size='sm'>{item.display_name}</Text>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                );
            })}
        </Tab.Panel>
    );
};

export default MarketCategory;
