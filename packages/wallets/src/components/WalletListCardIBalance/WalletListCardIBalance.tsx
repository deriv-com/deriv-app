import React from 'react';
import { Trans } from 'react-i18next';
import { useBalance } from '@deriv/api';
import { THooks } from '../../types';
import { WalletText } from '../Base';
import './WalletListCardIBalance.scss';

type TProps = {
    balance: THooks.WalletAccountsList['display_balance'];
};

const WalletListCardIBalance: React.FC<TProps> = ({ balance }) => {
    const { isLoading } = useBalance();
    return (
        <div className='wallets-balance__container'>
            <WalletText align='right' color='primary' size='xs'>
                <Trans defaults='Wallet balance' />
            </WalletText>
            {isLoading ? (
                <div className='wallets-skeleton wallets-balance--loader' />
            ) : (
                <WalletText align='right' size='xl' weight='bold'>
                    {balance}
                </WalletText>
            )}
        </div>
    );
};

export default WalletListCardIBalance;
