import React from 'react';
import DerivPassword from './deriv-password.jsx';
import TradingPassword from './trading-password.jsx';

const Passwords = ({ email }) => {
    return (
        <div className='account__passwords'>
            <DerivPassword email={email} />
            <TradingPassword email={email} />
        </div>
    );
};

export default Passwords;
