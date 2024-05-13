import React from 'react';
import { useActiveWalletAccount, useBalance } from '@deriv/api-v2';
import { WalletText } from '../Base';
import './WalletListCardBalance.scss';

const WalletListCardBalance = () => {
    const { isLoading: isBalanceLoading } = useBalance();
    const { data: activeWallet, isInitializing: isActiveWalletInitializing } = useActiveWalletAccount();
    const balance = activeWallet?.display_balance;

    // ideally we should have one specific hook to use data & loading state together
    // as right now, we are using useBalance just to figure out if account data is complete
    // useActiveWalletAccount shouldn't return isLoading=false until the data is complete,
    // but its not the case at the moment,
    const showLoader = isBalanceLoading || isActiveWalletInitializing;

    return (
        <div className='wallets-balance__container'>
            {showLoader ? (
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
