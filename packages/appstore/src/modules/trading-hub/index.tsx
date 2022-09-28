import * as React from 'react';
import CFDAccounts from 'Components/CFDs';

const TradingHub = () => {
    return (
        <div className='trading-hub'>
            Trading Hub
            <CFDAccounts account_type='real' />
        </div>
    );
};

export default TradingHub;
