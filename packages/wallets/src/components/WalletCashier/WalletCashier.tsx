import React from 'react';
import { useActiveWalletAccount } from '@deriv/api';
import WalletCashierContent from '../WalletCashierContent/WalletCashierContent';
import WalletCashierHeader from '../WalletCashierHeader/WalletCashierHeader';
import './WalletCashier.scss';

const WalletCashier = () => {
    const { isLoading } = useActiveWalletAccount();

    if (isLoading) return <p>Loading...</p>;

    return (
        <div className='wallets-cashier'>
            <WalletCashierHeader />
            <WalletCashierContent />
        </div>
    );
};

export default WalletCashier;
