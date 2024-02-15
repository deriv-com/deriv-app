import React from 'react';
import { THooks } from '../../types';
import { WalletCardIcon } from '../WalletCardIcon';
import WalletListCardDetails from '../WalletListCardDetails/WalletListCardDetails';
import './WalletListCard.scss';

type TProps = {
    balance: THooks.WalletAccountsList['display_balance'];
    currency: THooks.WalletAccountsList['wallet_currency_type'];
    isActive: THooks.WalletAccountsList['is_active'];
    isDemo: THooks.WalletAccountsList['is_virtual'];
    loginid: THooks.WalletAccountsList['loginid'];
    onAccountSelect: (loginid: string) => void;
};

const WalletListCard: React.FC<TProps> = ({ balance, currency, isActive, isDemo, loginid, onAccountSelect }) => (
    <div className='wallets-list-header__card_container'>
        <div className='wallets-list-header__content'>
            <div className='wallets-list-header__details-container'>
                <div className='wallets-list-header__details-container-icon'>
                    <WalletCardIcon device='desktop' size='lg' type={isDemo ? 'Demo' : currency} variant='circular' />
                </div>
                <WalletListCardDetails
                    balance={balance}
                    isActive={isActive}
                    isDemo={isDemo}
                    loginid={loginid}
                    onAccountSelect={onAccountSelect}
                />
            </div>
        </div>
    </div>
);

export default WalletListCard;
