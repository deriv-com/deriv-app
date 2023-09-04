import React from 'react';
import { useWalletAccountsList } from '@deriv/api';
import './WalletBalance.scss';

const WalletBalance = ({
    account,
}: {
    account: NonNullable<ReturnType<typeof useWalletAccountsList>['data']>[number];
}) => {
    return (
        <div className='wallets-balance__container'>
            <div className='wallets-balance__title'>Wallet balance</div>
            <div className='wallets-balance__value'>
                {account.display_balance} {account?.currency}
            </div>
        </div>
    );
};

export default WalletBalance;
