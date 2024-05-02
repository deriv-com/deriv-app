import React from 'react';
import { useActiveWalletAccount } from '@deriv/api-v2';
import { WalletCurrencyIcon } from '../WalletCurrencyIcon';
import WalletListCardDetails from '../WalletListCardDetails/WalletListCardDetails';
import './WalletListCard.scss';

const WalletListCard = () => {
    const { data: activeWallet } = useActiveWalletAccount();

    const currency = activeWallet?.wallet_currency_type || 'USD';
    const isDemo = activeWallet?.is_virtual;

    return (
        <div className='wallets-list-card'>
            <div className='wallets-list-card__container'>
                <div className='wallets-list-card__details'>
                    <div className='wallets-list-card__icon'>
                        <WalletCurrencyIcon currency={isDemo ? 'DEMO' : currency} rounded size='xl' />
                    </div>
                    <WalletListCardDetails />
                </div>
            </div>
        </div>
    );
};

export default WalletListCard;
