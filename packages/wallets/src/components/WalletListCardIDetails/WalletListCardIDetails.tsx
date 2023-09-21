import React from 'react';
import WalletListCardActions from '../WalletListCardActions/WalletListCardActions';
import WalletListCardBadge from '../WalletListCardBadge/WalletListCardBadge';
import WalletListCardTitle from '../WalletListCardTitle/WalletListCardTitle';
import './WalletListCardIDetails.scss';

type TProps = {
    badge?: string;
    currency: string;
    isDemo: boolean;
    loginid: string;
};

const WalletListCardIDetails: React.FC<TProps> = ({ isDemo, currency, badge, loginid }) => (
    <div className='wallets-list-details__action-container'>
        <div className='wallets-list-details__elements'>
            <WalletListCardTitle currency={currency} />
            {!isDemo && badge && <WalletListCardBadge label={badge.toUpperCase()} />}
        </div>
        <WalletListCardActions isDemo={isDemo} loginid={loginid} />
    </div>
);

export default WalletListCardIDetails;
