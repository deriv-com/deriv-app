import React from 'react';
import { useWalletAccountsList } from '@deriv/api';
import './WalletListCardIBalance.scss';

type TProps = {
    account: NonNullable<ReturnType<typeof useWalletAccountsList>['data']>[number];
};

const WalletListCardIBalance: React.FC<TProps> = ({ account }) => {
    return (
        <div className='wallets-balance__container'>
            <div className='wallets-balance__title'>Wallet balance</div>
            <div className='wallets-balance__value'>
                {account.display_balance} {account?.currency}
            </div>
        </div>
    );
};

export default WalletListCardIBalance;
