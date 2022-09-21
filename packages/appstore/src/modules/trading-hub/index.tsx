import * as React from 'react';
import CFDAccounts from 'Components/CFDs';
// import  AccountManager from 'Components/account-manager'
const TradingHub = () => {
    return (
        <div className='trading-hub'>
            Trading Hub
            <CFDAccounts account_type='real' />
            {/* <AccountManager type='options' appname='options account' disabled={false} has_account={false} description={'Get a real Options account, start trading and manage your funds.'}/> */}
        </div>
    );
};

export default TradingHub;
