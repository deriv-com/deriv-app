import React from 'react';
import DerivPassword from './deriv-password.jsx';
import TradingPassword from './trading-password.jsx';

const Passwords = () => (
    <div className='account__passwords'>
        <DerivPassword />
        <TradingPassword />
    </div>
);

export default Passwords;
