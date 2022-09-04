import * as React from 'react';
import CFDAccountManager from '../../components/cfd-account-manager';

const TradingHub = () => {
    return (
        <div className='trading-hub'>
            <CFDAccountManager appname={'Appname'} amount={'0.00'} currency={'USD'} loginid={'12345678'} />
        </div>
    );
};

export default TradingHub;
