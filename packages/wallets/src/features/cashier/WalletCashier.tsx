import React from 'react';
import { useActiveWalletAccount } from '@deriv/api';
import { WalletCashierContent, WalletCashierHeader } from './components';
import './WalletCashier.scss';

const WalletCashier = () => {
    const { isLoading } = useActiveWalletAccount();

    if (isLoading) return <p>Loading...</p>;

    return (
        <>
            <WalletCashierHeader />
            <div className='wallets-cashier-content'>
                <WalletCashierContent />
            </div>
        </>
    );
};

export default WalletCashier;
