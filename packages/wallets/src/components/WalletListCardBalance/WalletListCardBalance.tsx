import React from 'react';
import { useActiveWalletAccount, useBalance } from '@deriv/api-v2';
import { WalletText } from '../Base';
import './WalletListCardBalance.scss';

const WalletListCardBalance = () => {
    const { isLoading } = useBalance();
    const { data: activeWallet, isLoading: isActiveWalletLoading } = useActiveWalletAccount();

    const balance = activeWallet?.display_balance;

    return (
        <div className='wallets-balance__container'>
            {isLoading || isActiveWalletLoading ? (
                <div
                    className='wallets-skeleton wallets-balance--loader'
                    data-testid='dt_wallet_list_card_balance_loader'
                />
            ) : (
                <WalletText align='right' size='xl' weight='bold'>
                    {balance}
                </WalletText>
            )}
        </div>
    );
};

export default WalletListCardBalance;
