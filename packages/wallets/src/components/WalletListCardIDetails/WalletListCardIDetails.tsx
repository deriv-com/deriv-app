import React from 'react';
import WalletListCardActions from '../WalletListCardActions/WalletListCardActions';
import WalletListCardBadge from '../WalletListCardBadge/WalletListCardBadge';
import WalletListCardTitle from '../WalletListCardTitle/WalletListCardTitle';
import './WalletListCardIDetails.scss';

type TProps = {
    badge?: string;
    currency: string;
    isActive: boolean;
    isDemo: boolean;
    loginid: string;
};

const WalletListCardIDetails: React.FC<TProps> = ({ badge, currency, isActive, isDemo, loginid }) => (
    <div className='wallets-list-details__action-container'>
        <div className='wallets-list-details__elements'>
            <WalletListCardTitle currency={currency} />
            {!isDemo && badge && <WalletListCardBadge label={badge.toUpperCase()} />}
        </div>
        <WalletListCardActions isActive={isActive} isDemo={isDemo} loginid={loginid} />
    </div>
);

export default WalletListCardIDetails;
