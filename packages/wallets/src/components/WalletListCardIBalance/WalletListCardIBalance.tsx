import React from 'react';
import { THooks } from '../../types';
import { WalletText } from '../Base';
import './WalletListCardIBalance.scss';

type TProps = {
    balance: THooks.WalletAccountsList['display_balance'];
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
