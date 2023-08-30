import React from 'react';
import './WalletHeaderActions.scss';

const WalletHeaderActions = () => {
    return (
        <div className='wallet-header__actions'>
            <p>Deposit</p>
            <p>Withdraw</p>
            <p>Transfer</p>
            <p>Transactions</p>
        </div>
    );
};

export default WalletHeaderActions;
