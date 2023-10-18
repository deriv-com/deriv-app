import React from 'react';
import { WalletCurrencyCard } from '../WalletCurrencyCard';
import WalletListCardIBalance from '../WalletListCardIBalance/WalletListCardIBalance';
import WalletListCardIDetails from '../WalletListCardIDetails/WalletListCardIDetails';
import './WalletListCard.scss';

type TProps = {
    badge?: string;
    balance: string;
    currency: string;
    isActive: boolean;
    isDemo: boolean;
    loginid: string;
};

const WalletListCard: React.FC<TProps> = ({ badge, balance, currency, isActive, isDemo, loginid }) => (
    <div className='wallets-list-header__card_container'>
        <div className='wallets-list-header__content'>
            <div className='wallets-list-header__details-container'>
                <WalletCurrencyCard currency={currency} isDemo={isDemo} />

                <WalletListCardIDetails
                    badge={badge}
                    currency={currency}
                    isActive={isActive}
                    isDemo={isDemo}
                    loginid={loginid}
                />
            </div>
            <WalletListCardIBalance balance={balance} />
        </div>
    </div>
);

export default WalletListCard;
