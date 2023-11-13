import React, { useState } from 'react';
import { useActiveWalletAccount } from '@deriv/api';
import { WalletCashierContent, WalletCashierHeader } from './components';
import './WalletCashier.scss';
import { Loader } from '../../components';

const WalletCashier = () => {
    const { isLoading } = useActiveWalletAccount();
    const [isContentScrolled, setIsContentScrolled] = useState(false);

    const onContentScroll = (e: React.UIEvent<HTMLDivElement, UIEvent>) => {
        const target = e.target as HTMLDivElement;
        setIsContentScrolled(target.scrollTop > 0);
    };

    if (isLoading) return <Loader />;

    return (
        <div className='wallets-cashier'>
            <WalletCashierHeader hideWalletDetails={isContentScrolled} />
            <div className='wallets-cashier-content' onScroll={onContentScroll}>
                <WalletCashierContent />
            </div>
        </div>
    );
};

export default WalletCashier;
