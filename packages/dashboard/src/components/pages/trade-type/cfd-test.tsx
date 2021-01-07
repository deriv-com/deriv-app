import * as React from 'react';
import { AppToTrade } from '../../template/trade-type-template';
import { Banner } from '../../template/shared';

const card_data = [
    {
        title: 'DMT5 Synthetic',
        sub_title: 'Trade CFDs on synthetic indices that simulate real-world market movements.',
        icon: 'IcMt5Synthetic',
    },
    {
        title: 'DMT5 Financial',
        sub_title: 'Trade CFDs on commodities, cryptocurrencies, and currency pairs with leverage.',
        icon: 'IcMt5FinancialStp',
    },
];

const CFDTest: React.FC = () => {
    return (
        <React.Fragment>
            <div>
                <Banner type='Margin' title='Trade positions larger than your capital' />
                <AppToTrade title='Apps to trade CFDs' card_data={card_data} />
            </div>
        </React.Fragment>
    );
};

export default CFDTest;
