import React from 'react';
import { useActiveWalletAccount } from '@deriv/api';
import WalletCashierContent from '../WalletCashierContent/WalletCashierContent';
import WalletCashierHeader from '../WalletCashierHeader/WalletCashierHeader';

const WalletCashier = () => {
    const { data, isLoading } = useActiveWalletAccount();

    if (isLoading) return <p>Loading...</p>;

    return (
        <div>
            <WalletCashierHeader data={data} />
            <WalletCashierContent data={data} />
        </div>
    );
};

export default WalletCashier;
