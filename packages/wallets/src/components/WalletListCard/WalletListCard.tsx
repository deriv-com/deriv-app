import React from 'react';
import { useActiveWalletAccount } from '@deriv/api-v2';
import { WalletCardIcon } from '../WalletCardIcon';
import WalletListCardDetails from '../WalletListCardDetails/WalletListCardDetails';
import './WalletListCard.scss';

const WalletListCard = () => {
    const { data: activeWallet } = useActiveWalletAccount();

    const currency = activeWallet?.wallet_currency_type || 'USD';
    const isDemo = activeWallet?.is_virtual;

    return (
        <div className='wallets-list-header__card_container'>
            <div className='wallets-list-header__content'>
                <div className='wallets-list-header__details-container'>
                    <div className='wallets-list-header__details-container-icon'>
                        <WalletCardIcon
                            device='desktop'
                            size='lg'
                            type={isDemo ? 'Demo' : currency}
                            variant='circular'
                        />
                    </div>
                    <WalletListCardDetails />
                </div>
            </div>
        </div>
    );
};

export default WalletListCard;
