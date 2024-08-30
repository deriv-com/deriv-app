import React from 'react';
import './WalletsPriorityCryptoWithdrawLoader.scss';

const WalletsPriorityCryptoWithdrawLoader = () => {
    return (
        <div className='wallets-priority-crypto-withdrawal' data-testid='wallets_priority_crypto_withdrawal_loader'>
            <div className='wallets-skeleton wallets-priority-crypto-withdrawal-div' />
            <div className='wallets-skeleton wallets-priority-crypto-withdrawal-div' />
            <hr className='wallets-priority-crypto-withdrawal-divider' />
            <div className='wallets-skeleton wallets-priority-crypto-withdrawal-div' />
        </div>
    );
};

export default WalletsPriorityCryptoWithdrawLoader;
