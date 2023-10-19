import React from 'react';
import { WalletText } from '../Base';
import './WalletListCardIBalance.scss';

type TProps = {
    balance: string;
};

const WalletListCardIBalance: React.FC<TProps> = ({ balance }) => (
    <div className='wallets-balance__container'>
        <WalletText align='right' color='primary' size='xs'>
            Wallet balance
        </WalletText>

        <WalletText align='right' size='xl' weight='bold'>
            {balance}
        </WalletText>
    </div>
);

export default WalletListCardIBalance;
