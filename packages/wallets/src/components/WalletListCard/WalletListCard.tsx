import React from 'react';
import WalletGradientBackground from '../WalletGradientBackground/WalletGradientBackground';
import WalletListCardIBalance from '../WalletListCardIBalance/WalletListCardIBalance';
import WalletListCardIcon from '../WalletListCardIcon/WalletListCardIcon';
import WalletListCardIDetails from '../WalletListCardIDetails/WalletListCardIDetails';
import './WalletListCard.scss';

type TProps = {
    badge?: string;
    balance: string;
    currency: string;
    isActive: boolean;
    isDemo: boolean;
    loginid: string;
    walletType: string;
};

const WalletListCard: React.FC<TProps> = ({ badge, balance, currency, isActive, isDemo, loginid, walletType }) => (
    <div className='wallets-list-header__card_container'>
        <div className='wallets-list-header__content'>
            <div className='wallets-list-header__details-container'>
                <WalletGradientBackground currency={currency} is_demo={isDemo} type='card'>
                    <div className='wallets-list-header__details-container-icon'>
                        <WalletListCardIcon type={walletType} />
                    </div>
                </WalletGradientBackground>

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
