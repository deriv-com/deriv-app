import * as React from 'react';
import TotalAssets from 'Components/total-assets';

const TradingHub = () => {
    return (
        <div className='trading-hub'>
            <TotalAssets amount={'10000.0'} currency={'USD'} platform={'real'} />
        </div>
    );
};

export default TradingHub;
