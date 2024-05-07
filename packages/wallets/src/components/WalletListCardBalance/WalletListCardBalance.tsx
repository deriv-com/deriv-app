import React, { useEffect } from 'react';
import { useActiveWalletAccount, useBalanceSubscription } from '@deriv/api-v2';
import { displayMoney } from '@deriv/api-v2/src/utils';
import { WalletText } from '../Base';
import './WalletListCardBalance.scss';

const WalletListCardBalance = () => {
    const { data: balanceData, isLoading, subscribe, unsubscribe } = useBalanceSubscription();
    const { data: activeWallet, isLoading: isActiveWalletLoading } = useActiveWalletAccount();

    useEffect(() => {
        subscribe({ loginid: activeWallet?.loginid });
        return () => unsubscribe();
    }, [activeWallet?.loginid, subscribe, unsubscribe]);

    return (
        <div className='wallets-balance__container'>
            {isLoading || isActiveWalletLoading ? (
                <div
                    className='wallets-skeleton wallets-balance--loader'
                    data-testid='dt_wallet_list_card_balance_loader'
                />
            ) : (
                <WalletText align='right' size='xl' weight='bold'>
                    {displayMoney?.(balanceData?.balance ?? 0, activeWallet?.currency ?? '', {
                        fractional_digits: activeWallet?.currency_config?.fractional_digits,
                    })}
                </WalletText>
            )}
        </div>
    );
};

export default WalletListCardBalance;
