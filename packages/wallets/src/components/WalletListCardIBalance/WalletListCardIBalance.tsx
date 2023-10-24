import React from 'react';
import { WalletText } from '../Base';
import './WalletListCardIBalance.scss';

type TProps = {
    balance: string;
};

const WalletListCardIBalance: React.FC<TProps> = ({ balance }) => (
    <div className='wallets-balance__container'>
        <WalletText align='right' color='primary' lineHeight='sm' size='xs'>
            Wallet balance
        </WalletText>

        <WalletText align='right' lineHeight='6xl' size='3xl' weight='bold'>
            {balance}
        </WalletText>
    </div>
);

export default WalletListCardIBalance;
