import * as React from 'react';
import CFDAccounts from 'Components/CFDs';
// import  AccountManager from 'Components/account-manager'
const TradingHub = () => {
    return (
        <div className='trading-hub'>
            Trading Hub
            <CFDAccounts account_type='real' />
        </div>
    );
};

export default TradingHub;
