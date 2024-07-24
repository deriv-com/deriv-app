import React from 'react';
import { Tab } from '@deriv-com/quill-ui';
import { Localize } from '@deriv/translations';
import { MarketGroup } from 'AppV2/Utils/symbol-categories-utils';

type TMarketCategoryTab = {
    category: MarketGroup;
};

const MarketCategoryTab = ({ category }: TMarketCategoryTab) => {
    return (
        <Tab.Trigger key={category.market_display_name}>
            {category.market === 'indices' ? (
                <Localize i18n_default_text='Stocks & indices' />
            ) : (
                category.market_display_name
            )}
        </Tab.Trigger>
    );
};

export default MarketCategoryTab;
