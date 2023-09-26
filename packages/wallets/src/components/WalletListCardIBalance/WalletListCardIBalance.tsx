import React from 'react';
import './WalletListCardIBalance.scss';

type TProps = {
    balance: string;
};

const WalletListCardIBalance: React.FC<TProps> = ({ balance }) => (
    <div className='wallets-balance__container'>
        <div className='wallets-balance__title'>Wallet balance</div>
        <div className='wallets-balance__value'>{balance}</div>
    </div>
);

export default WalletListCardIBalance;
